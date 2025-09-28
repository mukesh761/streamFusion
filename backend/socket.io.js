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
io.on('connection',(socket)=>{
    socket.on('createRoom',({data,user})=>{
        socket.join(data.roomId)
        socketToEmail.set(socket.id,user.email)
        emailToSocket.set(user.email,socket.id)
        roomToPassword.set(data.roomId,data.password)
        console.log(socket.id,user.email)
        socket.emit('roomCreated',(data))
    })
    socket.on('joinRoom',({data,user})=>{
       const room = io.sockets.adapter.rooms.get(data.roomId);
       if(room && data.password==roomToPassword.get(data.roomId)){
        socket.join(data.roomId)
         socketToEmail.set(socket.id,user.email)
        emailToSocket.set(user.email,socket.id)
        console.log('room joined')
        socket.to(data.roomId).emit('newUser',user.email)
        socket.emit("roomJoined",(data))
       }
       else{
        console.log('room id or password is incorrect')
       }
    })

    socket.on('makeCall',({offer,data})=>{
        console.log('received offer',offer)
        socket.emit('IncomingCall',{offer,data})
    })
})

export {io,httpServer, app}