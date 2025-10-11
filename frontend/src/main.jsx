import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/User.context.jsx'
import { SocketProvider } from './context/Socket.context.jsx'
import { PeerProvider } from './context/Peer.context.jsx'

createRoot(document.getElementById('root')).render(

  <UserProvider>
    <SocketProvider>
      <PeerProvider>

        <App />
      </PeerProvider>

    </SocketProvider>
  </UserProvider>

)
