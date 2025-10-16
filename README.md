# Week_2_Exercise

**JSON Questions**
1. **Explain what is CRUD operations and how it is relates to the mongo functions in the exercise.**

   CRUD operations stand by Create, Read, Update and Delete. This is the basic operations to manage data.
   In the exercise, the mongo function for each operation:
   Create   : insertOne()
   Read     : find()
   Update   : updateOne()
   Delete   : deleteOne()

2. **Identify all the mongo operators used in the exercise, then explain the usage for each.**

   $gte     : Greater than or equal
   $inc     : Increment

3. **Replace the mongo functions in Task 5 to updateMany instead of updateOne, compare the difference based on the result in console and the mongo compass.**
   
   The coding is modified:
   ```
   //Task 5: Update
        const updatedResult = await db.collection('drivers').updateMany(
            { isAvailable: true },
            { $inc: { rating: 0.1 } },
        );
        console.log(`Driver updated: ${updatedResult.modifiedCount}`)
   ```

   The data inside MongoDB was cleared manually and the coding is re-running again to ensure that the results of this experiment were not affected by previous operations.

   According to the Figure 3, Figure 5.1, Figure 5.2, Figure 6.1 and Figure 6.2, 
   updateMany() be able to update several documents, however updateOne() only can update 1 document. 

4. **Replace the mongo functions in Task 6 to deleteMany instead of deleteOne, compare the difference based on the result in console and the mongo compass.**
   
   The coding is modified:
   ```
   //Task 6: Delete
        const deleteResult = await db.collection('drivers').deleteMany({ isAvailable: false });
        console.log(`Driver deleted: ${deleteResult.deletedCount}`);
   ```

   The experiment is continue using the data from Question 3.

   According to the Figure 4.1, Figure 4.2, Figure 7.1 and Figure 7.2, 
   deleteMany() be able to delete several documents, however deleteOne() only can delete 1 document. 