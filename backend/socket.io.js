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
let roomId
io.on('connection', (socket) => {
    //setting up a call
    console.log('a new socket joined ', socket.id)
    socket.on('createRoom', ({ data, user }) => {
        socket.join(data.roomId);
        roomId=roomId
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
    socket.on('createOffer',({offer,roomId})=>{
        console.log('inside create offer event ')
        socket.to(roomId).emit('handleOffer',{offer,roomId})
    })
    socket.on('handleAnswer',({answer,roomId})=>{
        console.log('handling answer')
        socket.to(roomId).emit('handleincominganswer',{answer,roomId})
    })
    socket.on("ice:candidate",({candidate,roomId})=>{
        console.log('hancling ice:candidate')
        socket.to(roomId).emit('ice:candidate',{candidate})
    })


    // adding fuctions 
    socket.on('mute-call',()=>{
        console.log('handling mute call')
        socket.emit('mute-call')
    })
    socket.on('hang-up',()=>{
        console.log('hanging call');
        socket.emit('hang:up')
    })
})

export { io, httpServer, app }