# Week_6_Exercise

1. **Token Usage:**
   
   **a. What happens if you omit the Authorization header when accessing /admin/users/{id}?**
      
      The authenticate middleware will return the error code 401 Unauthorized. 

   **b. What error occurs if you use an expired token?**

      The authenticate middleware will return the error code 401 Unauthorized

   **c. Paste the token generated to https://jwt.io, and discuss the content**

      Decoded Header
      ```
      {
      "alg": "HS256",
      "typ": "JWT"
      }
      ```
      The signing algorithm used is HS256, which ensures that the token cannot be modified without the secret key and the JSON Web Token is applied.

      Decoded Payload
      ```
      {
      "userId": "692b0a070efa81b98f672e81",
      "role": "admin",
      "iat": 1764430020,
      "exp": 1764433620
      }
      ```
      The payload show the content of the data, which are the Object ID, role, generated time and expired time. The token generated at Sat Nov 29 2025 23:27:00 GMT+0800 (Malaysia Time) and will expired at Sun Nov 30 2025 00:27:00 GMT+0800 (Malaysia Time).

2. **Role Restrictions:**

   **a. If a customer-role user tries to access /admin/users/{id}, what status code is returned?**

      The authorize(['admin']) middleware will return the error code 403 Forbidden.

   **b. How would you modify the middleware to allow both admin and driver roles to access an endpoint?**

      ```
      app.delete('/admin/users/:id', authenticate, authorize(['admin', 'driver']), async (req, res) => {
         console.log("admin only");
         return res.status(200).send("admin access");
      });
      ```

3. **Security:**

   **a. Why is the JWT token sent in the Authorization header instead of the request body?**

      Request body is easily logged in server logs, proxy servers and debugging tools, however send in headers are less frequently logged automatically. Therefore, JWT token sent in the Authorization header have higher security.

   **b. How does password hashing protect user data in a breach?**

      Password hashing will make the user password become unreadable. If the hacker hacks the database, they only see hashed values and cannot obtain the real passwords. The hacker also difficult to guess or brute-force the original password. This able to reduce the impact of a data breach.

4. **Postman Testing:**

   **a. What is the purpose of the Bearer keyword in the Authorization header?**

      The Bearer keyword will identifies the type of authentication being used. 

   **b. How would you test a scenario where a user enters an incorrect password?**

      The testing will be done in postman. The incorrent password will key in the request body and the POST request is sent. The error code 401 Unauthorized will be return as shown as Figure 2.2.