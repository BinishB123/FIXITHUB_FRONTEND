import cancel from "../../assets/cancelledbooking.png";
import viewbooking from "../../assets/viewbooking.png";
import latestBooking from "../../assets/latest.png";
import adddate from "../../assets/adddate.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Bookings() {
const location = useLocation()
const navigate = useNavigate()
  return (
    <>
      <div className="w-[80%] h-auto  flex flex-col items-center  ">
        <div className="w-[90%] h-[120px]  flex justify-evenly cursor-pointer" >
          <div className=" w-[15%] h-[100px] space-y-2   flex flex-col items-center" onClick={()=>{
           navigate("/provider/bookings")
        }}>
            <div className={`w-[40%] ${location.pathname==="/provider/bookings" &&"shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)]"}  bg-orange h-[100px] animate-fadeInDownBig hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300  rounded-full flex items-center justify-center`}>
              <img
                src={adddate}
                alt=""
                className="h-[60%] w-auto object-contain"
              />
            </div>

            <div className="w-[95%] h-[100px] ">
              <h1 className={`text-center text-sm font-dm font-semibold ${location.pathname==="/provider/bookings"?"text-orange":"text-white"}`}>
                Add Booking Dates
              </h1>
            </div>
          </div>
          <div className="w-[15%] h-[100px] space-y-2   flex flex-col items-center cursor-pointer  " onClick={()=>navigate('/provider/bookings/cancelledBookings')}>
            <div className={`w-[40%] bg-orange h-[100px] animate-fadeInDownBig  rounded-full flex items-center justify-center ${location.pathname==="/provider/bookings/cancelledBookings"&&"shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)]"} transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300`}>
              <img
                src={cancel}
                alt=""
                className="h-[60%] w-auto object-contain"
              />
            </div>

            <div className="w-[95%] h-[100px] ">
              <h1 className={`text-center text-sm font-dm font-semibold  ${location.pathname==="/provider/bookings/cancelledBookings"?"text-orange":"text-white"} `}>
                Cancelled Bookings
              </h1>
            </div>
          </div>
          <div className="w-[15%] h-[100px] space-y-2    flex flex-col items-center " onClick={()=>{
            navigate("/provider/bookings/viewbookings")
          }}>
            <div className={`w-[40%] bg-orange h-[100px] animate-fadeInDownBig rounded-full flex items-center justify-center ${location.pathname==="/provider/bookings/viewbookings"&&"shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)]"} transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300`}>
              <img
                src={viewbooking}
                alt=""
                className="h-[60%] w-auto object-contain"
               
              />
            </div>

            <div className="w-[95%] h-[100px] ">
              <h1 className={`text-center text-sm font-dm font-semibold ${location.pathname==="/provider/bookings/viewbookings"?"text-orange":"text-white"}`}>
                View Bookings
              </h1>
            </div>
          </div>
          <div className=" w-[15%] h-[100px] space-y-2   flex flex-col items-center" onClick={()=>navigate('/provider/bookings/latestBookings')}>
            <div className={`w-[40%] bg-orange h-[100px] animate-fadeInDownBig  rounded-full flex items-center justify-center ${location.pathname==="/provider/bookings/latestBookings"&&"shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)]"} transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300`}>
              <img
                src={latestBooking}
                alt=""
                className="h-[60%] w-auto object-contain"
              />
            </div>

            <div className="w-[95%] h-[100px] " >
              <h1 className={`text-center text-sm font-dm font-semibold ${location.pathname==="/provider/bookings/latestBookings"?"text-orange":"text-white"}`}>
                Latest Bookings
              </h1>
            </div>
          </div>
        </div>
        <Outlet/>
      </div>
    </>
  );
}

export default Bookings;
