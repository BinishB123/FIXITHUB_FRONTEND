import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { FaLock } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { BsChatSquareDotsFill } from "react-icons/bs";

function UserProfile() {
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <>
            <div className="w-[100%] h-auto flex  bg-black items-center justify-center mt-10">
                <div className="w-[85%] h-auto flex flex-row  space-x-2 ">
                    <div className="hidden w-[20%] h-[700px]  md:flex">
                        <div className="w-full h-[600px] bg-gradient-to-b from-gray-950 animate-fadeInDownBig flex flex-col items-center rounded-md space-y-2">
                            {/* Overview Section */}
                            <div className={`w-[90%] h-[50px] flex items-center space-x-3 cursor-pointer  ${location.pathname==="/profile"&&"bg-gray-800 rounded-md transition duration-150"} px-4`} onClick={()=>{
                                navigate('/profile')
                            }}>
                                <GrOverview className="text-orange text-2xl" />
                                <h1 className="text-white hover:border-b-2 border-orange transition">Overview</h1>
                            </div>

                            {/* Notification Section */}
                            <div className={`w-[90%] h-[50px] flex items-center space-x-3 cursor-pointer ${location.pathname===""&&"bg-gray-800 rounded-md transition duration-150"} px-4`}>
                                <IoIosNotifications className="text-orange text-2xl" />
                                <h1 className="text-white hover:border-b-2 border-orange transition">Notification</h1>
                            </div>

                            {/* Password Section */}
                            <div className={`w-[90%] h-[50px] flex items-center space-x-3 cursor-pointer ${location.pathname===""&&"bg-gray-800 rounded-md transition duration-150"} px-4`}>
                                <FaLock className="text-orange text-2xl" />
                                <h1 className="text-white hover:border-b-2 border-orange transition">Password</h1>
                            </div>

                            {/* Service History Section */}
                            <div onClick={()=>navigate('/profile/serviceHistory')} className={`w-[90%] h-[50px] flex items-center space-x-3 cursor-pointer ${location.pathname==="/profile/serviceHistory"&&"bg-gray-800 rounded-md transition duration-150"} px-4`}>
                                <FaHistory className="text-orange text-2xl" />
                                <h1 className="text-white hover:border-b-2 border-orange transition">Service History</h1>
                            </div>

                            {/* Latest Bookings Section */}
                            <div onClick={()=>navigate('/profile/latestbooking')} className={`w-[90%] h-[50px] flex items-center space-x-3 cursor-pointer ${location.pathname==="/profile/latestbooking"&&"bg-gray-800 rounded-md transition duration-150"} px-4`}>
                                <TbBrandBooking className="text-orange text-2xl" />
                                <h1 className="text-white hover:border-b-2 border-orange transition">Latest Bookings</h1>
                            </div>
                            <div  onClick={()=>navigate('/profile/chat')}  className={`hidden w-[90%] h-[50px] flex items-center space-x-3 cursor-pointer ${location.pathname==="/profile/chat"&&"bg-gray-800 rounded-md transition duration-150"} px-4`}>
                                <BsChatSquareDotsFill className="text-orange text-2xl" />
                                <h1 className="text-white hover:border-b-2 border-orange transition">Chat</h1>
                            </div>
                        </div>

                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default UserProfile;
