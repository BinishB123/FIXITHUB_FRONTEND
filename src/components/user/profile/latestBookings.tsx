import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { MdOutlineCall } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { cancelBooking, getlatestBooking } from "../../../services/user/userServiceBooking";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { ResponsegetBookingGreaterThanTodaysDate } from "../../../interfaces/userInterface";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LatestBooking(){
    const navigate = useNavigate()
    const [latestBooking,setlatestBooking] = useState<ResponsegetBookingGreaterThanTodaysDate[]|[]>([])
    const {userInfo} = useSelector((state:RootState)=>state.user)
    const [upanddown, setupanddown] = useState(false);
    const [indext, setindex] = useState<number|undefined>(undefined);
    useEffect(()=>{
        if (userInfo?.id) {
          getlatestBooking(userInfo?.id).then((response:any)=>{
            
           setlatestBooking(response.data.data)
          }).catch((error)=>{
            console.log(error);
            
          })
        }
    },[])
  
    
    const handleCancel =  (id:string,amountToRefund:number,date:string)=>{
             cancelBooking(id,amountToRefund,date).then(()=>{
                const updateddata = latestBooking.map((item)=>{
                  if (item._id===id) {
                    return {...item,status:"cancelled"}
                  }
                  return item
                })
                setlatestBooking(updateddata)
                toast.success("Your booking has been canceled. The advance payment will be refunded within 5–7 business days.",{duration:10000})
             }).catch((error)=>{
              if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                if (statusCode === 403 || statusCode === 401) {
                    localStorage.removeItem("user")

                    toast.error("Your session has expired or your access is restricted. Please sign in again.");
                    navigate("/login", { replace: true })
                }
            } else {

                console.error('An error occurred:', error);
            }
             })
           
           
    }
    
    return(<><div className="w-[70%] h-[700px]  flex flex-col ml-2 space-y-2">
        <div className="w-[100%] h-[40px] bg-banner-gray rounded-sm">
          <h1 className="text-white font-medium font-dm ml-2 mt-2">LATEST BOOKINGS</h1>
        </div>
        <div className="w-[100%]  h-[550px] space-y-1 overflow-y-scroll scrollbar-hide">
           {
            latestBooking.map((item,index)=>(
                <>
          <div
            key={index}
            className="w-[100%] h-[70px] bg-banner-gray rounded-md animate-fadeInDownBig text-white  flex space-x-1 "
          >
            <div className="w-[20%] h-[100%] flex flex-col justify-center items-center  ">
              <h1 className="text-white">{item.provider.workshopName}</h1>
            </div>
            <div className="w-[30%] h-[100%] text-white flex justify-center items-center ">
              <h1>{` Service ${item.servicename.serviceType} `}</h1>
            </div>
            <div className="w-[15%] h-[100%] flex justify-center items-center  flex-col ">
              <p>{`x ${item.selectedService.length}`}</p>
              <h1>{`Total: ${item.selectedService.reduce((acc,cuu)=>(acc+cuu.price),0)} `}</h1>
            </div>
            <div className="w-[20%] h-[100%] flex justify-center items-center ">
              <p>{new Date(item.bookeddate.date).toDateString()}</p>
            </div>
            <div className="w-[15%] h-[100%] flex justify-evenly items-center  space-x-3 ">
              <IoIosChatboxes className="text-orange text-2xl" />
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
              <h1>{`Fuel Type:  ${item.vechileDetails.fueltype}`}</h1>
              <h1>{`Kilometer: ${item.vechileDetails.kilometer}`}</h1>
              {
                item.status!=="cancelled"&&<div className="w-[60%] h-[100px] flex justify-center items-end">
                <button className="w-[100%] h-[40px] bg-red rounded-md" onClick={()=>{
                  handleCancel(item._id,item.advanceAmount,item.date)
                }}>cancel</button>
             </div>
              }
            </div>

            {/* Center Section */}
            <div className="w-[35%] h-full p-4 space-y-3 text-white">
            <h1 className={`${item.advance===true && item.status=="cancelled"?"text-blue-400":"text-green-400"} text-sm flex items-center space-x-2 `}>
                  {`Advance Fee :  ${item.advance===true && item.status=="cancelled"?"Refunded":"paid"}`}
                    
                  </h1>
                  {
                    item.advance===true && item.status!=="cancelled"&&
                    <h1 className="text-sm">{`Full Payment Status: ${item.paymentStatus} `}</h1>
                  }
             
              <h1 className="text-sm">{`Service Status: ${item.status}`}</h1>
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

export default LatestBooking