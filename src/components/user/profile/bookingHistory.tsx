import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { MdOutlineCall } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { confirmPayment, getServiceHistory } from "../../../services/user/userServiceBooking";
import { ResponsegetBookingGreaterThanTodaysDate } from "../../../interfaces/userInterface";
import { StatusColors, statusColors } from "../../../constants/colors";
import {  getChatId } from "../../../services/user/userProfile";
import { useNavigate } from "react-router-dom";

export function BookingHistory() {
    const {userInfo} = useSelector((state:RootState)=>state.user)
    const navigate = useNavigate()
    const [serviceHistory,setHistory] = useState<ResponsegetBookingGreaterThanTodaysDate[]|[]>([])
    const [upanddown, setupanddown] = useState(false);
    const [indext, setindex] = useState<number|undefined>(undefined);
   
   
   

    useEffect(()=>{
       if (userInfo?.id) {
        getServiceHistory(userInfo.id).then((response:any)=>{
          setHistory(response.data.data)
         
    
        }).catch((error)=>{
          console.log(error);
          
        })
       }
       
    },[])

    const handleFullPayment = (docid:string,selectedService:any)=>{
             confirmPayment(docid,selectedService).then((Response:any)=>{
                window.location.href = Response.data.url
             })
    }
    const chatCreation = (providerId:string,userId:string)=>{
      getChatId(providerId,userId).then((Response:any)=>{
       navigate(`/profile/chat/${Response.data.id}/${providerId}`)
      
       
      }).catch((error)=>{
        console.log(error);
        
      })
    
}


    return (<>
        <div className="w-[80%] h-[700px]  flex flex-col ml-2 space-y-2">
            <div className="w-[100%] h-[40px] bg-banner-gray rounded-sm">
              <h1 className="text-white font-medium font-dm ml-2 mt-2">Service History</h1>
            </div>
            <div className="w-[100%]  h-[550px] space-y-1 overflow-y-scroll scrollbar-hide">
               {
                serviceHistory.map((item,index)=>(
                    <>
              <div
                key={index}
                className="w-[100%] h-[70px] bg-banner-gray rounded-md animate-fadeInDownBig text-white  flex space-x-1 "
              >
                <div className="w-[20%] h-[100%] flex flex-col justify-center items-center  ">
                  <h1 className="text-white">{item.provider.workshopName}</h1>
                </div>
                <div className="w-[30%] h-[100%] text-white flex justify-center items-center ">
                  <h1>{` Service ${item.servicename.serviceType}`}</h1>
                </div>
                <div className="w-[10%] h-[100%] text-white flex justify-center items-center ">
                  <h1 className={`text-sm ${statusColors[item.status as keyof StatusColors]}`}>{` ${item.status}`}</h1>
                </div>
                <div className="w-[15%] h-[100%] flex justify-center items-center  flex-col ">
                  <p>{`x${item.selectedService.length}`}</p>
                  <h1>{`Total: ${item.selectedService.reduce((acc,cuu)=>(acc+cuu.price),0)}`}</h1>
                </div>
                <div className="w-[20%] h-[100%] flex justify-center items-center ">
              <p>{new Date(item.bookeddate.date).toDateString()}</p>
            </div>
                <div className="w-[15%] h-[100%] flex cursor-pointer justify-evenly items-center  space-x-3 ">
                  <IoIosChatboxes onClick={()=>{
                   if (userInfo?.id) {
                    chatCreation(item.provider._id,userInfo?.id)
                   }
                  }}  className="text-orange text-2xl" />
                  <MdOutlineCall className="text-2xl text-blue-500" />
                </div>
                <div className="w-[10%] h-[100%] flex flex-col justify-center items-center ">
                  <FaCaretDown
                    className={`text-2xl text-orange cursor-pointer ${!upanddown &&
                      indext === index &&
                      "rotate-360 transition ease-linear"
                      } ${upanddown &&
                      indext === index &&
                      "rotate-180 transition ease-linear"
                      } `}
                    onClick={() => {
                      setupanddown(!upanddown);

                      if (upanddown) {
                        setindex(undefined);
                      } else {
                        setindex(index);
                      }
                    }}
                  />
                </div>
              </div>
              <div
                className={`w-full h-[200px] rounded-md bg-banner-gray flex ${upanddown && indext === index
                    ? "animate-fadeInDownBig transition ease-linear"
                    : "hidden"
                  }`}
              >
                {/* Left Section */}
                <div className="w-[40%] h-full p-4 text-white flex flex-col text-sm  space-y-2">
                  <h1>{`Vehicle Type: ${item.vechileType} `}</h1>
                  <h1>{`Fuel Type: ${item.vechileDetails.fueltype}`}</h1>
                  <h1>{`Kilometer: ${item.vechileDetails.kilometer}`}</h1>
                  {
              (  item.status==="completed"&&item.paymentStatus!=="paid") &&<div className="w-[60%] h-[100px] flex justify-center items-end">
                <button className="w-[100%] h-[40px] bg-blue-600 rounded-md" onClick={()=>{
                  handleFullPayment(item._id,item.selectedService)
                }}>{`pay ${Math.abs(item.selectedService.reduce((acc,cuu)=>acc+cuu.price,0)-item.advanceAmount)}`}</button>
                  </div>
              }
                </div>

                {/* Center Section */}
                <div className="w-[35%] h-full p-4 space-y-3 text-white">
                 {
                  item.status==="cancelled"&&<> <h1 className={`${item.advance===true && item.status=="cancelled"?"text-blue-400":"text-green-400"} text-sm flex items-center space-x-2 `}>
                  {`Advance Fee :  ${item.advance===true && item.status=="cancelled"?"Refunded":"paid"}`}
                    
                  </h1></>
                 }
                 {
                  item.status!=="cancelled"&&<h1 className={`${item.paymentStatus==="paid"?"text-green-500":"text-red"}`}>{`Full Payment Status: ${item.paymentStatus} `}</h1>

                 }
                  <h1 className={statusColors[item.status as keyof StatusColors]}>{`Service Status: ${item.status}`}</h1>
                </div>
                
                {/* Right Section */}
                <div className="w-[35%] h-full p-4 overflow-y-scroll scrollbar-hide">
                  <dl>
                    {item.selectedService.map((service, idx) => (
                      <li key={idx} className="text-white  text-sm">
                        {`${service.serviceName}: ${service.price} Rs`}
                      </li>
                    ))}
                  </dl>
                </div>
              </div>

            </>
                ))
               }
            </div>

        </div>

    </>)
}

