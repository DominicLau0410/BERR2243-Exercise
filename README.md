# Week_3_Exercise

1. **POST Request:**

   **a. What HTTP status code is returned when a ride is created successfully?**

      The HTTP status code is 201 created.

   **b. What is the structure of the response body?**

      The structure of response body is _id of the ride in JSON.

2. **GET Request:**

   **a. What happens if the rides collection is empty?**

      The response body will show [].

   **b. What data type is returned in the response (array/object)?**

      The data type of response body is array.

3. **Fix PATCH and DELETE Error:**

   **a. Catch the error when requesting PATCH or DELETE API, then try to fix the issue reported.**

      The PATCH request have been done with the fake _id. Figure 6 shows the PATCH request with the URL below:
      ```
      http://127.0.0.1:3000/rides/abc123
      ```

      The error message is shown in response:
      ```
      {
         "error": "Invalid ride ID or data"
      }
      ```

      In order to fix the problem, the GET request is use to check the existing ride id. The existing ride id is use to replace the fake id above in URL.
      ```
      http://127.0.0.1:3000/rides/6902dccfa04ed8d57b4e0437
      ```
   
   **b. If you try to update a non-existent ride ID, what status code is returned?**

      The HTTP status code is 400 Bad Request.

   **c. What is the value of updated in the response if the update succeeds?**

      1

   **d. How does the API differentiate between a successful deletion and a failed one?**

      When the DELETE request sent with the existing id, the MongoDB will receive the id and delete the ride of that id, then MongoDB will return a JSON with the deletedCount. 
      
      If the deletedCount is 1, the deletion is successful.

      If the deletedCount is 0, the deletion is failed.

4. **Users Endpoints:**

   **Based on the exercise above, create the endpoints to handle the CRUD operations for users account**

   Below is the coding add:
   ```
   // USER
   app.get( '/users', async (req, res) => {
      try {
         const users = await db.collection('users').find().toArray();
         res.status(200).json(users);
      } catch (err) {
         res.status(500).json({ error: "Failed to fetch users" });
      }
   });

   app.post( '/users', async (req, res) => {
      try {
         const result = await db.collection('users').insertOne(req.body);
         res.status(201).json({id: result.insertedId});
      } catch (err) {
         res.status(400).json({ error: "Invalid user data" });
      }
   });

   app.patch( '/users/:id', async (req, res) => {
      try {
         const result = await db.collection('users').updateOne(
               { _id: new ObjectId(req.params.id) },
               { $set: { status: req.body.status } }
         );

         if (result.modifiedCount === 0) {
               return res.status(404).json({ error: "User not found" });
         }
         res.status(200).json({ updated: result.modifiedCount });
      } catch (err) {
         // Handle invalid ID format or DB errors
         res.status(400).json({ error: "Invalid user ID or data" });
      }
   });

   app.delete( '/users/:id', async (req, res) => {
      try {
         const result = await db.collection('users').deleteOne(
               { _id: new ObjectId(req.params.id) }
         );

         if (result.deletedCount === 0) {
               return res.status(404).json({ error: "User not found" });
         }
         res.status(200).json({ deleted: result.deletedCount });
      } catch (err) {
         res.status(400).json({ error: "Invalid user ID or data" });
      }
   });
   ```

   The Figure 7.1, Figure 7.2, Figure 7.3 and Figure 7.4 is the result for this question.

5. **FrontEnd:**

   **Upload the Postman JSON to any AI tools, and generate a simple HTML and JS Dashboard for you.**

   HTMI:
   ```
   <!DOCTYPE html>
   <html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MongoDB Rides Dashboard</title>
      <style>
         body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f9; }
         .container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
         h1, h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
         form { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 4px; }
         input[type="text"], button { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
         button { cursor: pointer; background-color: #007bff; color: white; border: none; transition: background-color 0.3s; }
         button:hover { background-color: #0056b3; }
         #rides-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
         #rides-table th, #rides-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
         #rides-table th { background-color: #f0f0f0; color: #555; }
         .update-btn { background-color: #ffc107; color: #333; margin-left: 5px; }
         .update-btn:hover { background-color: #e0a800; }
         .message { padding: 10px; margin-bottom: 20px; border-radius: 4px; display: none; }
         .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
         .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
      </style>
   </head>
   <body>
      <div class="container">
         <h1>Rides Management Dashboard</h1>
         <p>Base API URL: <code>http://127.0.0.1:3000/rides</code></p>

         <h2>Create New Ride</h2>
         <form id="create-ride-form">
               <input type="text" id="pickupLocation" placeholder="Pickup Location (e.g., Central Park)" required>
               <input type="text" id="destination" placeholder="Destination (e.g., Times Square)" required>
               <input type="text" id="driverID" placeholder="Driver ID (e.g., DRIVER123)" required>
               <input type="text" id="status" placeholder="Initial Status (e.g., requested)" value="requested" required>
               <button type="submit">Create Ride (POST)</button>
         </form>
         <div id="create-message" class="message"></div>

         <hr>

         <h2>All Current Rides</h2>
         <button onclick="fetchRides()">Refresh Rides List (GET)</button>
         <table id="rides-table">
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Pickup</th>
                     <th>Destination</th>
                     <th>Driver ID</th>
                     <th>Status</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody id="rides-list">
                  <tr><td colspan="6" style="text-align: center;">Click "Refresh Rides List" to load data.</td></tr>
               </tbody>
         </table>
      </div>

      <script src="app.js"></script>
   </body>
   </html>
   ```

   JS Dashboard:
   ```
   const API_URL = 'http://127.0.0.1:3000/rides';
   const ridesList = document.getElementById('rides-list');
   const createForm = document.getElementById('create-ride-form');
   const createMessage = document.getElementById('create-message');

   // --- Utility Functions ---

   function showMessage(element, text, isError = false) {
      element.textContent = text;
      element.className = isError ? 'message error' : 'message success';
      element.style.display = 'block';
      setTimeout(() => {
         element.style.display = 'none';
      }, 5000);
   }

   // --- READ Operation (GET /rides) ---

   async function fetchRides() {
      ridesList.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading...</td></tr>';
      
      try {
         const response = await fetch(API_URL);
         
         if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         const rides = await response.json();
         
         // Clear the list and repopulate
         ridesList.innerHTML = ''; 
         
         if (rides.length === 0) {
               ridesList.innerHTML = '<tr><td colspan="6" style="text-align: center;">No rides found.</td></tr>';
               return;
         }

         rides.forEach(ride => {
               const row = ridesList.insertRow();
               // Assuming your MongoDB API returns an '_id' field
               const rideId = ride._id || 'N/A';
               
               row.insertCell().textContent = rideId;
               row.insertCell().textContent = ride.pickupLocation;
               row.insertCell().textContent = ride.destination;
               row.insertCell().textContent = ride.driverID;
               row.insertCell().textContent = ride.status;

               // Action Cell for Update/Patch
               const actionCell = row.insertCell();
               
               // PATCH Button to cancel a ride
               const cancelBtn = document.createElement('button');
               cancelBtn.textContent = 'Cancel Ride';
               cancelBtn.className = 'update-btn';
               cancelBtn.onclick = () => updateRideStatus(rideId, 'cancelled');
               
               actionCell.appendChild(cancelBtn);
         });

      } catch (error) {
         ridesList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Error fetching rides: ${error.message}. Ensure your API is running on http://127.0.0.1:3000.</td></tr>`;
         console.error('Fetch Error:', error);
      }
   }

   // --- CREATE Operation (POST /rides) ---

   createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const newRide = {
         pickupLocation: document.getElementById('pickupLocation').value,
         destination: document.getElementById('destination').value,
         driverID: document.getElementById('driverID').value,
         status: document.getElementById('status').value
      };

      try {
         const response = await fetch(API_URL, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify(newRide)
         });

         const data = await response.json();

         if (response.ok) {
               showMessage(createMessage, `Successfully created ride with ID: ${data._id || 'N/A'}`, false);
               createForm.reset();
               fetchRides(); // Refresh the list
         } else {
               throw new Error(`Server Error: ${data.message || response.statusText}`);
         }

      } catch (error) {
         showMessage(createMessage, `Error creating ride: ${error.message}`, true);
         console.error('Create Error:', error);
      }
   });

   // --- UPDATE Operation (PATCH /rides/:id) ---

   async function updateRideStatus(rideId, newStatus) {
      if (!confirm(`Are you sure you want to change status of ride ${rideId} to "${newStatus}"?`)) {
         return;
      }

      try {
         const response = await fetch(`${API_URL}/${rideId}`, {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ status: newStatus })
         });
         
         if (response.ok) {
               showMessage(createMessage, `Ride ${rideId} status updated to: ${newStatus}`, false);
               fetchRides(); // Refresh the list
         } else {
               const errorData = await response.json();
               throw new Error(`Server Error: ${errorData.message || response.statusText}`);
         }

      } catch (error) {
         showMessage(createMessage, `Error updating ride ${rideId}: ${error.message}`, true);
         console.error('Update Error:', error);
      }
   }

   // Initial load of the rides list when the page loads
   window.onload = fetchRides;
   ```