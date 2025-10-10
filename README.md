# Week_1_Exercise

1. **Code Execution & Output**

   After running your index.js script:

   a. **What exact text does the console display when the document is inserted?**

       Query result: {
          _id: new ObjectId('68e857a5835200e6a56cfdb1'),
          name: 'Alice',
          age: 25
        }
   
   b. **What _id value is automatically assigned to the document?**

      The _id value is new ObjectId('68e857a5835200e6a56cfdb1'),

2. **Modify and Observe**

   Change the name field in index.js to your own name and the age to your birth year. Run the script again.

   a. **What new _id is generated for this document?**

      The new _id is new ObjectId('68e85816b3a7f50572932f36'),
   
   b. **What error occurs if you forget to call await client.connect()?**

      In order to investigate the result of this situation, I make the "await client.connect()" become comment and add the "await client.close()":

       =========================================================
       //await client.connect();
       //console.log("Connected to MongoDB!");
        
       await client.close();
       =========================================================

      The error message is:
      Error: MongoNotConnectedError: Client must be connected before running operations

3. **MongoDB Connection Failure**

   Intentionally break the MongoDB connection string (e.g., change the port to 27018).

   a. **What error message does NodeJS throw?**

      The error message is:
      Error: MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27018
   
   b. **What is the exact text of the error code (e.g., ECONNREFUSED)?**

      The exact text of the ECONNREFUSED is Error: Connection Refused.

4. **MongoDB Shell Query**

   Use the MongoDB shell (not Compass) to:

   a. **List all documents in the testDB.users collection.**

        [
           { _id: ObjectId('68e857a5835200e6a56cfdb1'), name: 'Alice', age: 25 },
           {
             _id: ObjectId('68e85816b3a7f50572932f36'),
             name: 'Lau Jian Fong',
             age: 2004
           }
         ]
      
   b. **What command did you use? Paste the full output.**
   
      C:\Users\JFLau04>mongosh
      Current Mongosh Log ID: 68e85d041fdde8ae12cebea3
      Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8
      Using MongoDB:          8.2.1
      Using Mongosh:          2.5.8
      
      For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/
      
      ------
         The server generated these startup warnings when booting
         2025-10-09T18:27:22.390+08:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
      ------
      
      test> use testDB
      switched to db testDB
      testDB> show collections
      users
      testDB> db.users.find()
      [
         { _id: ObjectId('68e857a5835200e6a56cfdb1'), name: 'Alice', age: 25 },
         {
            id: ObjectId('68e85816b3a7f50572932f36'),
            name: 'Lau Jian Fong',
            age: 2004
         }
      ]

5. **File System & Dependencies**

   a. **What is the absolute path to your project’s package-lock.json file?**

      C:\Users\JFLau04\Degree Y2S2 - Database\Week_1_Exercise\package-lock.json
   
   b. **What exact version of the mongodb driver is installed?**

      6.20.0

6. **Troubleshooting Practice**
   Stop the MongoDB service and run the script.
   
   a. **What error occurs?**
   
      The error message is:
      Error: MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017

   b. **What command restarts the service?**

      net start MongoDB


