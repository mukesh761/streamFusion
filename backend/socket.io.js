import {Server} from 'socket.io'
import express from 'express'
import { createServer } from 'http';

const app=express()
const httpServer= createServer(app)
const io=new Server(httpServer,{
    cors:{
        origin:"*",
        methods:['GET', 'POST']
    }
})
const socketToEmail=new Map()
const emailToSocket=new Map()
const roomToPassword=new Map()
const creater=new Map()
io.on('connection',(socket)=>{
    socket.on('createRoom',({data,user})=>{
        socket.join(data.roomId)
        socketToEmail.set(socket.id,user.email)
        creater.set(data.roomId,user.email)
        emailToSocket.set(user.email,socket.id)
        roomToPassword.set(data.roomId,data.password)
        console.log(socket.id,user.email)
        socket.emit('roomCreated',({data,email:user.email}))
    })
    socket.on('joinRoom',({data,user})=>{
       const room = io.sockets.adapter.rooms.get(data.roomId);
       if(room && data.password==roomToPassword.get(data.roomId)){
        socket.join(data.roomId)
         socketToEmail.set(socket.id,user.email)
        emailToSocket.set(user.email,socket.id)
        console.log('room joined')
        console.log(io.sockets.adapter)
        socket.emit("roomJoined",{data,email:user.email})
        socket.broadcast.to(data.roomId).emit('newUserJoined',{data,email:user.email})
       }
       else{
        console.log('room id or password is incorrect')
       }
    })

    socket.on('makeCall',({offer,to,data})=>{
        const socketId= emailToSocket.get(to)
        console.log({to})
       
        console.log('received offer',offer)
        socket.to(socketId).emit('IncomingCall',{offer,data})
    })
    socket.on('sendAnswer',({data,answer})=>{
        console.log('sending answer to frontend')
        const from = creater.get(data.roomId)
        console.log(from)
        const socketId=emailToSocket.get(from)
        console.log(socketId)
        socket.to(socketId).emit('receiveAnswer',{data,answer})
    })
})

export {io,httpServer, app}