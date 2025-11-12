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

// TODO: function to check the acc exist or not

// POST /register - Register as user or driver
app.post( '/register', async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !["user", "driver"].includes(role)) {
            return res.status(400).json({ error: "Invalid role." });
        }
        
        const collection = role === "user" ? "users" : "drivers";

        const result = await db.collection(collection).insertOne(req.body);
        return res.status(201).json({Profile: result.insertedId});
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({ error: "Registration failed." });
    }
});

// POST /auth/login - Login
app.post( '/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required." });
        }

        const user = await db.collection("users").findOne({ username }) ||
                     await db.collection("drivers").findOne({ username });
        
        if (!user) {
            return res.status(404).json({ error: "Account not found." });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: "Wrong password." });
        }

        return res.status(200).json({ Message: "Login successful", userId: user._id });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to login." });
    }
});

// POST /auth/logout - Logout
app.post('/auth/logout', (req, res) => {
    return res.status(200).json({ Message: "Logout successful" });
});

// GET /profile/:id - allow user or driver to view the profile
app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) }) ||
                     await db.collection("drivers").findOne({ _id: new ObjectId(id) });

        if (!user) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const { password, ...safeProfile } = user;
        return res.status(200).json(safeProfile);

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// TODO: _id and role cannot be edit, password cannot be edit

// PATCH /profile/:id - allow user or driver to update the profile
app.patch('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        let result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            result = await db.collection("drivers").updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
        }
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        return res.status(200).json({ Profile: "Profile updated" });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
    }
});

// DELETE /profile/:id - delete user or driver profile
app.delete('/profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            result = await db.collection("drivers").deleteOne({ _id: new ObjectId(id) });
        }

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        return res.status(200).json({ Profile: "Profile deleted successfully" });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to delete profile" });
    }
});

// POST /rides - Create new ride request
app.post('/rides', async (req, res) => {
    try {
        const ride = { 
            ...req.body,
            status: "requested",
            rating: 0
        };

        const result = await db.collection("rides").insertOne(ride);
        return res.status(201).json({ Ride: result.insertedId });
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({ error: "Invalid ride data" });
    }
});

// GET /rides/:id - View ride infomation
app.get('/rides/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ride = await db.collection("rides").findOne({ _id: new ObjectId(id) });

        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to fetch ride" });
    }
});

// PATCH /rides/:id - Update ride information
app.patch('/rides/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        const result = await db.collection("rides").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        return res.status(200).json({ RIDE: "Ride updated" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to update ride" });
    }
});

// TODO: move the infomation of cancelled ride to Rides History Database

// PATCH /rides/:id/cancel - Cancel the ride
app.patch('/rides/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const cancelInfo = { status: "cancelled" };
    
    try {
        const result = await db.collection("rides").updateOne(
            { _id: new ObjectId(id) },
            { $set: cancelInfo }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        return res.status(200).json({ Ride: "Ride cancelled" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Failed to cancel ride" });
    }
});

// PATCH /rides/:id/ratings - user rates a driver after ride completed
app.patch('/rides/:id/ratings', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
        }

        const result = await db.collection("rides").updateOne(
            { _id: new ObjectId(id) },
            { $set: { rating: rating } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        return res.status(200).json({ Ride: "Rating submitted successfully" });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to submit rating" });
    }
});

// PATCH /rides/:id/accept - driver accepts the ride
app.patch('/rides/:id/accept', async (req, res) => {
    const { id } = req.params;
    const { driverInfo } = req.body;

    try {
        const result = await db.collection("rides").updateOne(
            { _id: new ObjectId(id), status: "requested" },
            {
                $set: {
                    status: "accepted",
                    driver_info: driverInfo,
                    accepted_at: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Ride not found or already accepted" });
        }

        res.status(200).json({
            Ride: "Ride accepted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to accept ride" });
    }
});

// PATCH /rides/:id/start - driver start the ride
app.patch('/rides/:id/start', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.collection("rides").updateOne(
            { _id: new ObjectId(id), status: "accepted" },
            {
                $set: {
                    status: "started",
                    started_at: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.status(200).json({Ride: "Ride started."});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch ride" });
    }
});

// PATCH /rides/:id/end - driver end the ride
app.patch('/rides/:id/end', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.collection("rides").updateOne(
            { _id: new ObjectId(id), status: "started" },
            {
                $set: {
                    status: "ended",
                    ended_at: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.status(200).json({Ride: "Arrived."});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch ride" });
    }
});

// GET /admin/rides - admin view all rides
app.get('/admin/rides', async (req, res) => {
    try {
        const rides = await db.collection("rides").find({}).toArray();
        res.status(200).json(rides);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch rides" });
    }
});

// GET /admin/accounts - view all users and drivers
app.get('/admin/accounts', async (req, res) => {
    try {
        const users = await db.collection("users").find({}).toArray();
        const drivers = await db.collection("drivers").find({}).toArray();

        res.status(200).json({
            users: users,
            drivers: drivers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
});

// PUT /admin/accounts/:role/:id - edit user or driver
app.put('/admin/accounts/:role/:id', async (req, res) => {
    const { role, id } = req.params;
    const updateData = req.body;

    if (!["user", "driver"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        const collection = role === "user" ? "users" : "drivers";
        const result = await db.collection(collection).updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Account not found" });
        }

        res.status(200).json({ message: "Account updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update account" });
    }
});

// DELETE /admin/accounts/:role/:id - delete user or driver
app.delete('/admin/accounts/:role/:id', async (req, res) => {
    const { role, id } = req.params;

    if (!["user", "driver"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        const collection = role === "user" ? "users" : "drivers";
        const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Account not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete account" });
    }
});