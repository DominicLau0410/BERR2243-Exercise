const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
    
    const start = Date.now();

    try {
        await client.connect();
        const duration  = Date.now() - start;
        console.log(`Connected to MongoDB! (${duration} ms)`);

        const db = client.db("testDB");
        const collection = db.collection("users");

        await collection.insertOne({name: "Alice", age: 25});
        console.log("Document inserted!");

        const result = await collection.findOne({ name: "Alice"});
        console.log("Query result:", result);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();