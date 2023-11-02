import env from 'dotenv'
env.config('.env');

import express from 'express';
const app = express();

import dbConnection from './db.js';
import post from './routes/postRoute.js';
import user from './routes/userRoute.js';
import conversation from './routes/conversationRoute.js';
import message from './routes/msgRoute.js';
import cors from 'cors';
import { auth } from './middleware/auth.js';
import http from 'http';
import { Server } from 'socket.io';
const port = process.env.PORT || 8000;

dbConnection();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/post", post);
app.use("/user", user);
app.use("/conversation", auth, conversation);
app.use("/message", auth, message);

// socket.io implementation
const onlineUsers = new Map();

io.on('connection', (socket) => {

    socket.on('userConnected', (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('disconnect', () => {
        const userId = Array.from(onlineUsers.keys()).find((key) => {
            return onlineUsers.get(key) === socket.id
        });
        
        if (userId) {
            onlineUsers.delete(userId);
            io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
        }
    });

    socket.on("sendmsg", (data) => {
        io.emit("msg", data);
    });
    socket.on('close', () => {
        console.log('Client disconnected.');
    });
});

server.listen(port, () => {
    console.log(`Application Listening on port ${port}`);
});
