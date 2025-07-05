import dotenv from 'dotenv';
import connectToDatabase from "./db/index.js";
import app from './app.js';

// Load environment variables from .env file
dotenv.config({
    path: './.env'
});

// Start the server and connect to the database
connectToDatabase()
.then(() => {
    
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
})
.catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
});