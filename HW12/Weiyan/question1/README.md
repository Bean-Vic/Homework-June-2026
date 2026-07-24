# Question 1: MongoDB Native Driver

This project demonstrates core CRUD operations using the native Node.js MongoDB driver, without the use of an ODM like Mongoose.

## Connect to MongoDB

Create a cluster at MongoDB Atlas and download the `.env` file which contains a credential like

   ```txt
    MONGODB_USERNAME="corneliazhang_db_user"
    MONGODB_PASSWORD="<password>"
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

## Setup

Run the following command to install the native driver and environment variable loader:

   ```bash
   npm init -y
   npm install mongodb dotenv
   ```

## Run

   ```bash
   node index.js
   ```
