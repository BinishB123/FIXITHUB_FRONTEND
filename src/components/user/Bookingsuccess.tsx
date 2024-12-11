import { useEffect } from "react";
import { ImHappy2 } from "react-icons/im";
import {  useLocation, useNavigate} from "react-router-dom";
function BookingSucess(){
        const navigate = useNavigate()
        
        
        useEffect(()=>{
             setTimeout(()=>{
                navigate('/',{replace:true,state:""})
            localStorage.removeItem("vehicle")
             },10000)
        },[])

    return (<><div className="w-[100%] h-[700px] flex  flex-col justify-center items-center">
           <div className="w-[50%] h-[20%] ">
            <div className="w-[100%] h-[50%]  flex justify-center">
                <ImHappy2 className="text-green-600 animate-bounce text-8xl "/>
               

            </div>
            <div className="w-[100%] flex h-[50%] justify-center "> 
                <h1 className="text-4xl text-white font-semibold font-dm text-center ">BOOKED SUCCESSFULLY</h1>   </div>

           </div>
           <div className="w-[100%] h-[10%] flex justify-center space-x-3 ">
             <button className="bg-orange w-[10%] h-[50px] rounded-md text-white font-semibold">GoTo Home</button>
             <button className="bg-orange w-[10%] h-[50px] rounded-md text-white font-semibold" onClick={()=>{
                navigate('/profile/latestbooking')
             }}>View Booking</button>
           </div>
        
        </div></>)
}

export default BookingSucess