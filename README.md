# Week_1_Exercise

1. **Code Execution & Output**

   After running your index.js script:

   a. **What exact text does the console display when the document is inserted?**

       Query result: {
          _id: new ObjectId('68e8272df938140df8a30119'),
          name: 'Alice',
          age: 25
        }
   
   b. **What _id value is automatically assigned to the document?**

      The _id value is new ObjectId('68e8272df938140df8a30119').

2. **Modify and Observe**

   Change the name field in index.js to your own name and the age to your birth year. Run the script again.

   a. **What new _id is generated for this document?**

      The new _id is new ObjectId('68e82b086639ac589a177668').
   
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
   
   b. **What command did you use? Paste the full output.**
   








