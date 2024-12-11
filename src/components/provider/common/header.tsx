import { RiDashboardHorizontalLine } from "react-icons/ri";
import { TbBrandBooking } from "react-icons/tb";
import { GiMechanicGarage } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { FaRunning } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";


function Header() {
    const navigate = useNavigate()
    const location = useLocation()
   

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
                <div className="flex space-x-3 w-[100%] items-center">
                    <FaRunning className="text-orange text-xl" />
                    <h1 className={`font-dm font-semibold text-sm text-white hover:text-orange hover:scale-90 hover:text-md duration-200 ease-in animate-fadeInDownBig hover:border-b-2 hover:border-orange-400`}>Road Assistance</h1>
                </div>
            </div>
        </div>

    </>)
}


export default Header