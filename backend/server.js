import {app, httpServer} from './socket.io.js';
import userRoute from './routes/userRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import connection from './database/db.js';
import cors from 'cors';



dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
let corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use("/user",userRoute)
httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
})
