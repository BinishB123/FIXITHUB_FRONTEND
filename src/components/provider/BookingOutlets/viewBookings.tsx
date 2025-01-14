import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { IoIosChatboxes } from "react-icons/io";
import { MdOutlineCall } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { getBookingAccordingToDate } from "../../../services/provider/providerBookings";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { toast } from "sonner";
import { ResponseAccordingToDate } from "../../../interfaces/providerServiceBooking";
import { getChatId } from "../../../services/provider/providerProfile";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/socketioContext";

function ViewBookings() {
  const {socket} = useSocket()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { providerInfo } = useSelector((state: RootState) => state.provider);
  const navigate = useNavigate()
  const [dataAccordingToDate, setDataAccordingToDate] = useState<
    ResponseAccordingToDate[] | []
  >([]);
  const date = new Date();
  date.setDate(date.getDate() + 5);

  const [upanddown, setupanddown] = useState(false);
  const [index, setindex] = useState<number|undefined>(undefined);
  const useridRef = useRef<string|null>(null)
 
  
  useEffect(()=>{
    const d = new Date();
      d.setHours(0, 0, 0, 0);
      if (providerInfo?.id) {
        getBookingAccordingToDate(providerInfo?.id, d)
          .then((response: any) => {
            setDataAccordingToDate(response.data.data)
          }).catch((error) => {
            toast.warning("There is no Bookings Today")
            setDataAccordingToDate([])
          });
      }


  },[])


  useEffect(() => {
    socket?.on("checkedUserIsOnlineOrNot", (response) => {
      if (!response.success) {
        toast.warning("User is Offline");
      } else {
        navigate(`/provider/call/${useridRef.current}`);
      }
    });

    return () => {
      socket?.off("checkedUserIsOnlineOrNot");
    };
  }, [socket]);

  const handleOnChangeDate = (date: any) => {
    setSelectedDate(date);

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      console.log(d.toDateString());

      if (providerInfo?.id) {
        getBookingAccordingToDate(providerInfo?.id, d)
          .then((response: any) => {
            console.log(response);
            setDataAccordingToDate(response.data.data)
          }).catch((error) => {
            toast.error(error.response.data.error);
            setDataAccordingToDate([])
          });
      }
    }
  };


  const chatCreation = (providerId: string, userId: string) => {
      ``;
      getChatId(providerId, userId).then((Response: any) => {
        navigate(`/provider/profile/chat/${Response.data.id}/${userId}`);
      });
    };


    const checkUserisOnlinOrNotBeforeCalling = (userid: string) => {
      socket?.emit("checkOnlineorNot", {
        userid: userid,
        providerid: providerInfo?.id,
        checker: "provider",
      });
    };

  return (
    <>
      <div className="h-auto w-[95%]  flex ">
        <div className="w-[30%] h-[400px] flex  justify-center">
          <div className="w-[40%]  h-[250px] bg-orange rounded-md cursor-pointer">
            <DatePicker
              selected={selectedDate}
              onChange={(value) => {
                handleOnChangeDate(value);
              }}
              maxDate={date}
              className="text-gray-800   text-center"
              calendarClassName="h-full font-semibold bg-gradient-to-b from-orange-400 to-white rounded-md shadow-lg text-sm border border-gray-300"
              inline
            />
          </div>
        </div>
        <div className="w-[60%] h-[530px] b space-y-2 overflow-y-scroll scrollbar-hide">
          {dataAccordingToDate.map((item, key) => (
            <>
              <div
                key={key}
                className="w-[100%] h-[70px] bg-banner-gray rounded-md animate-fadeInDownBig text-white  flex space-x-1 "
              >
                <div className="w-[20%] h-[100%] flex flex-col justify-center items-center  ">
                  <h1 className="text-white">{item.user.name}</h1>
                </div>
                <div className="w-[30%] h-[100%] text-white flex justify-center items-center ">
                  <h1>{`${item.servicename.serviceType} Service`}</h1>
                </div>
                <div className="w-[15%] h-[100%] flex justify-center items-center  flex-col ">
                  <p>{`x${item.selectedService.length}`}</p>
                  <h1>{`Total:${item.selectedService.reduce((acc, cuu) => {
                    return acc + cuu.price
                  }, 0)}`}</h1>
                </div>
                <div className="w-[15%] h-[100%] flex justify-center items-center ">
                  <p>{ }</p>
                </div>
                <div className="w-[15%] h-[100%] flex justify-evenly items-center  space-x-3 ">
                  <IoIosChatboxes className="text-orange text-2xl cursor-pointer"  onClick={()=>{
                    
                    if (providerInfo) {
                      chatCreation(providerInfo.id,item.user._id)
                    }
                  }}/>
                  <MdOutlineCall className="text-2xl text-blue-500 cursor-pointer" onClick={()=>{
                    useridRef.current = item.user._id
                    checkUserisOnlinOrNotBeforeCalling (item.user._id)
                  }} />
                </div>
                <div className="w-[10%] h-[100%] flex flex-col justify-center items-center ">
                  <FaCaretDown
                    className={`text-2xl text-orange cursor-pointer ${!upanddown &&
                      index === key &&
                      "rotate-360 transition ease-linear"
                      } ${upanddown &&
                      index === key &&
                      "rotate-180 transition ease-linear"
                      } `}
                    onClick={() => {
                      setupanddown(!upanddown);

                      if (upanddown) {
                        setindex(undefined);
                      } else {
                        setindex(key);
                      }
                    }}
                  />
                </div>
              </div>
              <div
                className={`w-full h-[200px] rounded-md bg-banner-gray flex ${upanddown && index === key
                    ? "animate-fadeInDownBig transition ease-linear"
                    : "hidden"
                  }`}
              >
                {/* Left Section */}
                <div className="w-[40%] h-full p-4 text-white flex flex-col text-sm  space-y-2">
                  <h1>{`Mobile: ${item.user.mobile}`}</h1>
                  <h1>{`Vehicle Type: ${item.vechileDetails.model}`}</h1>
                  <h1>{`Fuel Type: ${item.vechileDetails.fueltype}`}</h1>
                  <h1>{`Kilometer: ${item.vechileDetails.kilometer}`}</h1>
                </div>

                {/* Center Section */}
                <div className="w-[35%] h-full p-4 space-y-3 text-white">
                  <h1 className="text-sm flex items-center space-x-2">
                    {`Advance Fee : ${item.advance ? " Paid ":""} `}
                    
                  </h1>
                  <h1 className="text-sm">{`Full Payment Status: ${item.paymentStatus}`}</h1>
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
          ))}
        </div>
      </div>
    </>
  );
}

export default ViewBookings;
``;
