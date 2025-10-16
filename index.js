const { MongoClient } = require('mongodb');

const drivers = [
    {
        name: "John Doe",
        vehicleType: "Sedan",
        isAvailable: true,
        rating: 4.8
    },
    {
        name: "Alice Smith",
        vehicleType: "SUV",
        isAvailable: false,
        rating: 4.5
    },
    {
        name: "Arif",
        vehicleType: "Volvo",
        isAvailable: false,
        rating: 2.0
    },
    {
        name: "Charan",
        vehicleType: "Maserati",
        isAvailable: true,
        rating: 3.5
    },
    {
        name: "Nickson Goh",
        vehicleType: "Tesla",
        isAvailable: true,
        rating: 4.0
    }
]
console.log("All Drivers: ");
console.log(JSON.stringify(drivers, null, 2));

//Task 2: JSON Data Operations
// Show Driver's Name
console.log("\nAll Driver Names:");
drivers.forEach((element) => console.log(element.name));

// Add New Driver
drivers.push(
    {
        name: "Dominic",
        vehicleType: "Myvi",
        isAvailable: true,
        rating: 3.5
    }
);
console.log("\nAll Drivers: ");
console.log(JSON.stringify(drivers, null, 2));

async function main() {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
    
    const start = Date.now();

    try {
        await client.connect();
        const duration  = Date.now() - start;
        console.log(`Connected to MongoDB! (${duration} ms)`);
    
        const db = client.db("testDB");
        const driversCollection = db.collection("drivers");
        
        //Task 3: Insert Drivers into MongoDB
        for (const driver of drivers) {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with result: ${result.insertedId}`);
        };
        
        //Task 4: Query and Update Drivers
        const availableDrivers = await db.collection('drivers').find({
            isAvailable: true,
            rating: { $gte: 4.5 }
        }).toArray();
        console.log("Available drivers:", availableDrivers);
        
        //Task 5: Update
        const updatedResult = await db.collection('drivers').updateOne(
            { isAvailable: true },
            { $inc: { rating: 0.1 } },
        );
        console.log(`Driver updated: ${updatedResult.modifiedCount}`)
        
        //Task 6: Delete
        const deleteResult = await db.collection('drivers').deleteOne({ isAvailable: false });
        console.log(`Driver deleted: ${deleteResult.deletedCount}`);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();