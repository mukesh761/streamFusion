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

export {io,httpServer, app}