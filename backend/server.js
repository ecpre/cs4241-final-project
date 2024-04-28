import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js"; 
import messageRoutes from "./routes/message.routes.js"; 
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

const PORT = process.env.PORT || 8000;
const app =  express();
const io = new Server(app.listen(3636), {
	cors: {
		origin: ["http://localhost:3000"],
	},
});
app.set("socketio", io);

dotenv.config();

app.use(express.json()); //parse json data in the request body (from req.body)
app.use(cookieParser()); //parse cookies from the request headers

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => { 
//     //root route
//     res.send("server is ready");
// });



app.listen(PORT, () => {
    connectToMongoDB();
    console.log( `server running on port ${PORT}`)
});

