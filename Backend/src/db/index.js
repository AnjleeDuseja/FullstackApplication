
import mongoose from 'mongoose';
import { DB_NAME } from '../Constants.js';


const connectToDatabase = async () => {
    try{

        console.log('Connecting to the database...' );
       const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log('Connected to the database:', connectionInstance.connection.name, connectionInstance.connection.host );
    }
    catch (error) {
        console.error('Error connecting to the MongoDB database:', error);
        throw error;
    }

}

export default connectToDatabase;