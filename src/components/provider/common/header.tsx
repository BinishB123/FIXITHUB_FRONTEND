import { RiDashboardHorizontalLine } from "react-icons/ri";
import { TbBrandBooking } from "react-icons/tb";
import { GiMechanicGarage } from "react-icons/gi";
import { MdAddCircle, MdOutlineReviews } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { notificationCounter } from "../../../services/provider/providerProfile";
import { useSocket } from "../../../context/socketioContext";
import { FaCoins } from "react-icons/fa";


function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const {socket} = useSocket()
    const {providerInfo} = useSelector((state:RootState)=>state.provider)
    const [notificationCount,setNotificationCount] = useState<number>(0)
    
    useEffect(()=>{
        if (providerInfo?.id) {
            notificationCounter(providerInfo.id).then((response:any)=>{
            setNotificationCount(response.data.count)
            })
        }
        socket?.on("notifictaionUpdated",(response:{count:number})=>{
            console.log("response",response);
            console.log(response);
            
            setNotificationCount(response.count)
         })

         return ()=>{
            socket?.off("notifictaionUpdated")
        }

    
    },[socket])
   

    return (<>
    
        <div className={` hidden bg-gradient-to-b from-gray-950 h-[95%] w-[95%]  md:flex place-content-center animate-fadeInDownBig rounded-md ${location.pathname === '/provide/profile/chat'&& "hidden"}`}>
            <div className='flex flex-col justify-evenly cursor-pointer'>
                <div className="flex space-x-3 w-[100%] items-center" onClick={() => navigate('/provider')}>
                    <RiDashboardHorizontalLine className="text-orange text-xl" />
                    <h1 className={`${location.pathname === "/provider" ? "text-orange border-b-2 border-orange-400" : "text-white"} font-dm font-semibold text-sm  hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>DASHBOARD</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center">
                    <TbBrandBooking className="text-orange text-3xl" />
                    <h1 className={`${location.pathname === "/provider/bookings" ? " text-orange border-b-2 border-orange-400" : "text-white"} font-dm font-semibold text-sm hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`} onClick={() => {
                        navigate('/provider/bookings')
                    }}>BOOKINGS</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center" onClick={()=>{
                    navigate('/provider/services')
                }}>
                    <GiMechanicGarage className="text-orange text-3xl" />
                    <h1 className={`${location.pathname === "/provider/services" ? " text-orange border-b-2 border-orange-400" : "text-white"} font-dm font-semibold text-sm hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>SERVICES</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center" onClick={() => navigate('/provider/addservice')}>
                    <MdAddCircle className="text-orange text-2xl" />
                    <h1 className={`${location.pathname === '/provider/addservice' ? "text-orange border-b-2 border-orange-400" : "text-white"} font-dm font-semibold text-sm  hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>ADD SERVICE</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center" onClick={() => navigate('/provider/addsupportingBrands')}>
                    <MdAddCircle className="text-orange text-2xl" />
                    <h1 className={`font-dm font-semibold text-sm ${location.pathname === '/provider/addsupportingBrands' ? "text-orange border-b-2 border-orange-400" : "text-white"} hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>ADD BRANDS</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center">
                    <RiProfileLine className="text-orange text-xl" />
                    <h1 className={`font-dm font-semibold text-sm ${location.pathname !== '/provider/profile'
                            ? "text-white"
                            : "text-orange border-b-2 border-orange-400"
                        } hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`} onClick={() => {
                            navigate('/provider/profile')
                        }}>VIEW PROFILE</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center" onClick={()=>{
                    navigate('/provider/notification')
                }}>
                <div className="relative" >
                                    <IoIosNotifications className="text-orange text-2xl" />
                                   
                                    <div className="absolute -top-3 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center bg-green-500"
                                    >
                                        {notificationCount}
                                    </div>
                                </div>
                    {/* <IoIosNotifications className="text-orange text-xl" /> */}
                    <h1 className={`font-dm font-semibold text-sm ${location.pathname !== '/provider/notification'
                            ? "text-white"
                            : "text-orange border-b-2 border-orange-400"
                        } hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>Notification</h1>
                </div>
                <div className="flex space-x-3 w-[100%] items-center" onClick={() => navigate('/provider/feedbacks')}>
                    <MdOutlineReviews className="text-orange text-2xl" />
                    <h1 className={`font-dm font-semibold text-sm ${location.pathname === '/provider/feedbacks' ? "text-orange border-b-2 border-orange-400" : "text-white"} hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>Feedbacks</h1>
                </div>

                <div className="flex space-x-3 w-[100%] items-center" onClick={() => navigate('/provider/salesReport')}>
                    <FaCoins className="text-orange text-2xl" />
                    <h1 className={`font-dm font-semibold text-sm ${location.pathname === '/provider/salesReport' ? "text-orange border-b-2 border-orange-400" : "text-white"} hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>Sales Report</h1>
                </div>
                
                
            
            </div>
        </div>

    </>)
}


export default Header