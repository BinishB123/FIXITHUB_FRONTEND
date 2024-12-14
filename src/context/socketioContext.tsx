import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { apiUrl } from "../api/common";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";



const socketContext = createContext<{ socket: Socket | null ,online:true|false }>({ socket: null ,online:false})

// making custom hook 
export const useSocket = () => {
    return useContext(socketContext)
}


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const { providerInfo } = useSelector((state: RootState) => state.provider)
    const { userInfo } = useSelector((state: RootState) => state.user)
    const loggedUserId = userInfo?.id ? userInfo.id : providerInfo?.id
    const [online,setOnline] = useState<boolean>(false)

    useEffect(() => {
        if (loggedUserId) {
            const newSocket = io(apiUrl,{
                query:{
                    loggedUserId:loggedUserId
                }
            })
            setOnline(true)
            setSocket(newSocket)
            return () => {
                newSocket.disconnect()
            }
   
        }else{
            
            setSocket(null)
            setOnline(false)
        }
        
        
    }, [loggedUserId])
  
    return (<socketContext.Provider value={{ socket ,online}}>
        {children}
    </socketContext.Provider>)

}