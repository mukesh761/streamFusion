import { Server } from 'socket.io'
import express from 'express'
import { createServer } from 'http';

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

const socketToEmail = new Map()
const emailToSocket = new Map()
const roomToPassword = new Map()
let roomCreator;
let roomJoiner;

io.on('connection', (socket) => {
    console.log('a new socket joined ', socket.id)
    socket.on('createRoom', ({ data, user }) => {
        socket.join(data.roomId);
        console.log(`${user.email} created ${data.roomId}`)
        roomCreator=user.email
        socketToEmail.set(socket.id, user.email)
        emailToSocket.set(user.email, socket.id)
        roomToPassword.set(data.roomId, data.password)
        socket.emit('roomCreated', { data, email: user.email })
    })
    socket.on('joinRoom', ({ data, user }) => {
        if (data.password == roomToPassword.get(data.roomId)) {
            socket.join(data.roomId)
            console.log(`${user.email} joined ${data.roomId}`)
            socketToEmail.set(socket.id, user.email)
            emailToSocket.set(user.email, socket.id)
            roomJoiner=user.email
            socket.emit('roomJoined',{data,email:user.email})
            console.log({roomCreator})
            socket.to(data.roomId).emit('newUser',{email:user.email})
        }
    })
    socket.on('handleOffer',({offer})=>{
        const socketId=emailToSocket.get(roomJoiner)
        console.log({socketId})
        socket.to(socketId).emit('incomingCall',{offer})
    })
    socket.on('handleAnswer',({answer})=>{
        const socketId= emailToSocket.get(roomCreator)
        socket.to(socketId).emit('receivedCall',{answer})
    })
    socket.on('nego:offer',({offer})=>{
        const socketId=emailToSocket.get(roomJoiner)
        socket.to(socketId).emit('nego:handleOffer',{offer})
    })
    socket.on('nego:answer',({answer})=>{
        const socketId= emailToSocket.get(roomCreator)
        socket.to(socketId).emit('nego:handleAnswer',{answer})
    })
    
})

export { io, httpServer, app }