const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const port = 3000;

const app = express();
app.use(express.json());

let db;

async function connectToMongoDB() {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
    
    const start = Date.now();

    try {
        await client.connect();
        const duration  = Date.now() - start;
        console.log(`Connected to MongoDB! (${duration} ms)`);
    
        db = client.db("testDB");
    } catch (err) {
        console.error("Error:", err);
    }
}

connectToMongoDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

// POST /register - Register as user or driver with password hashing
app.post('/register', async (req, res) => {
    try {
        const { role, username, email, password } = req.body;

        if (!role || !["user", "driver", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be user or driver." });
        }

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing information." });
        }

        let collection;
        if (role === "user") collection = "users";
        else if (role === "driver") collection = "drivers";
        else if (role === "admin") collection = "admins"; 
        else return res.status(400).json({ error: "Invalid role" });
        
        const existingAcc = await db.collection(collection).findOne({ email: email });
        if (existingAcc) {
            return res.status(409).json({ error: "Account already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newAccount = {
            role,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await db.collection(collection).insertOne(newAccount);

        res.status(201).json({
            message: `${role} registered successfully`,
            id: result.insertedId
        });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Registration failed." });
    }
});

const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /auth/login - Login
app.post( '/auth/login', async (req, res) => {
    try {
        const { role, email, password } = req.body;
        
        if (!role || !["user", "driver", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be user or driver." });
        }

        if (!email || !password) {
            return res.status(400).json({ error: "Username and password required." });
        }

        let collection;
        if (role === "user") collection = "users";
        else if (role === "driver") collection = "drivers";
        else if (role === "admin") collection = "admins"; 
        else return res.status(400).json({ error: "Invalid role" });
        
        const existingAcc = await db.collection(collection).findOne({ email: email });
        if (!existingAcc) {
            return res.status(409).json({ error: "Account not registered." });
        }

        const isMatch = await bcrypt.compare(password, existingAcc.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign(
            { userId: existingAcc._id, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({ token });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to login." });
    }
});

const authenticate = (req, res, next) => {
const token = req.headers.authorization?.split(' ')[1];

if (!token) return res.status(401).json({ error: "Unauthorized" });
try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

const authorize = (roles) => (req, res, next) => {

if (!roles.includes(req.user.role))
    return res.status(403).json({ error: "Forbidden" });
    next();
};

app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req, res) => {
    console.log("admin only");
    return res.status(200).send("admin access");
});

app.get('/analytics/passengers', async (req, res) => {
    try {
        const pipeline = [
            {$lookup: {
                from: 'rides',
                localField: '_id',
                foreignField: 'user_id',
                as: 'rides'
            }},
            { $unwind: { path: '$rides' } },
            { $match: {
                'rides.status': { $eq: 'completed' }
            }},
            { $group: {
                _id: '$_id',
                name: { $first: '$username' },
                totalRides: { $sum: 1 },
                totalFare: { $sum: '$rides.fare' },
                avgDistance: { $avg: '$rides.distance' }
            }},
            { $project: {
                _id: 0,
                name: 1,
                totalRides: 1,
                totalFare: { $round: ['$totalFare', 2] },
                avgDistance: { $round: ['$avgDistance', 2] }
            }}
        ]

        const result = await db
            .collection("users")
            .aggregate(pipeline)
            .toArray();
        res.status(200).json(result);
        console.log(result);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});