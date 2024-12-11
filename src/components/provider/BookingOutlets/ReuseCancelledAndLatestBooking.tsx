import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { MdOutlineCall } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { getBookingStillTodaysDate, latestBooking } from "../../../services/provider/providerBookings";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { ResponseAccordingToDate } from "../../../interfaces/providerServiceBooking";
import { useLocation, useNavigate } from "react-router-dom";
import { getChatId } from "../../../services/provider/providerProfile";

function ReuseCancelledAndLatestBooking(props: { value: string }) {
  const { providerInfo } = useSelector((state: RootState) => state.provider)
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState<
    ResponseAccordingToDate[] | []
  >([]);
  const [upanddown, setupanddown] = useState(false);
  const [indext, setindex] = useState<number | undefined>(undefined);
  useEffect(() => {
   
    if (providerInfo) {
      if (props.value === "cancelled") {
        getBookingStillTodaysDate(providerInfo.id, props.value).then((response:any) => {
          setData(response.data.data)
        
        }).catch((error) => {
          console.log("cancelled",error);

        })

      } else {
         latestBooking(providerInfo.id).then((response:any)=>{
          setData(response.data.data)
          console.log(response);
         }).catch((error)=>{
          setData([])
          console.log("latest",error);
          
         })
      }

    }

  }, [location.pathname])
  const chatCreation = (providerId:string,userId:string)=>{

    getChatId(providerId,userId).then((Response:any)=>{
     navigate(`/provider/profile/${Response.data.id}`)
    })
  
}

  return (<><div className="w-[90%] h-[500px]  flex-col overflow-y-scroll scrollbar-hide space-y-1">
    {
      data ? data.map((item, index) => (
        <>
          <div
            key={item._id}
            className="w-[100%] h-[70px] bg-banner-gray rounded-md animate-fadeInDownBig text-white  flex space-x-1 "
          >
            <div className="w-[20%] h-[100%] flex flex-col justify-center items-center  ">
              <h1 className="text-white">{item.user.name}</h1>
            </div>
            <div className="w-[15%] h-[100%] flex justify-center items-center  flex-col ">
              <p>{new Date(item.bookeddate.date).toDateString()}</p>
              <h1>{`Total:${item.selectedService.reduce((acc,cuu)=>(acc+cuu.price),0)}`}</h1>
            </div>
            <div className="w-[30%] h-[100%] text-white flex justify-center items-center ">
              <h1>{`${item.servicename.serviceType} Service`}</h1>
            </div>
            <div className="w-[15%] h-[100%] flex justify-center items-center  flex-col ">
              <p>{`x${item.selectedService.length}`}</p>
              <h1>{`Total:${item.selectedService.reduce((acc,cuu)=>(acc+cuu.price),0)}`}</h1>
            </div>
           
            <div className="w-[15%] h-[100%] flex justify-center items-center ">
              <p>{ }</p>
            </div>
            <div className="w-[15%] h-[100%] flex justify-evenly items-center  space-x-3 ">
              <IoIosChatboxes className="text-orange text-2xl cursor-pointer" onClick={()=>{
                if (providerInfo) {
                  chatCreation(providerInfo?.id,item.user._id)
                }
              }} />
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
              <h1>{`Mobile: ${item.user.mobile} `}</h1>
              {/* <h1>{`Vehicle Type: ${item.vechileDetails.} `}</h1> */}
              <h1>{`Fuel Type: ${item.vechileDetails.fueltype}`}</h1>
              <h1>{`Kilometer: ${item.vechileDetails.kilometer} `}</h1>
            </div>

            {/* Center Section */}
            <div className="w-[35%] h-full p-4 space-y-3 text-white">
              <h1 className="text-sm flex items-center space-x-2">
                {`Advance Fee : ${item.advance?"paid":""}  `}

              </h1>
              <h1 className="text-sm">{`Full Payment Status: ${item.paymentStatus} `}</h1>
              <h1 className="text-sm">{`Service Status: ${item.status} `}</h1>
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
      )):<><h1 className="text-white text-center text-lg">{`There is no ${props.value} Bookings`}</h1></>
    }

  </div></>)
}

export default ReuseCancelledAndLatestBooking