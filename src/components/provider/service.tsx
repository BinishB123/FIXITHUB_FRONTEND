import { MdCancel } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import { IoIosChatboxes } from "react-icons/io";
import { MdOutlineCall } from "react-icons/md";
import { useEffect, useState } from "react";
import sample from '../../assets/car-check (2).png'
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { getBookingStillTodaysDate, updateServiceBookingStatus } from "../../services/provider/providerBookings";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { ResponsegetBookingStillTodaysDate } from "../../interfaces/providerServiceBooking";
import { StatusColors, statusColors } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import { getChatId } from "../../services/provider/providerProfile";


function Services() {
  const { providerInfo } = useSelector((state: RootState) => state.provider);
  const [searchString, setSearchString] = useState<any>("");
  const [isModal, setModalState] = useState<boolean>(false);
  const navigate = useNavigate()
  const FilterWithServiceStatus = [
    "pending",
    "confirmed",
    "inprogress",
    "completed",
    "cancelled",
    "onhold",
    "failed",
    "GetAll Services",
  ];
  const updationStatusForService = [
    "pending",
    "confirmed",
    "inprogress",
    "completed",
    "cancelled",
    "onhold",
    "failed",
  ];
  const [serviceDatas, setServiceDatas] = useState<
    ResponsegetBookingStillTodaysDate[] | []
  >([]);
  const [dummyServiceDatas, setDummyServiceDatas] = useState<
    ResponsegetBookingStillTodaysDate[] | []
  >([]);
  const [modalData, setModalData] =
    useState<ResponsegetBookingStillTodaysDate | null>(null);
   useEffect(() => {
    if (providerInfo) {
      getBookingStillTodaysDate(providerInfo?.id).then((response: any) => {
        setDummyServiceDatas(response.data.data);
        setServiceDatas(response.data.data);
      });
    }
  }, []);

  const chatCreation = (providerId:string,userId:string)=>{``
         getChatId(providerId,userId).then((Response:any)=>{
          navigate(`/provider/profile/chat/${Response.data.id}/${userId}`)
         })
}

  const handleChangeStatus = (status: string) => {
    if (providerInfo) {
      getBookingStillTodaysDate(
        providerInfo.id,
        status === "GetAll Services" ? undefined : status
      )
        .then((response: any) => {
          setDummyServiceDatas(response.data.data);
          setServiceDatas(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const onChangeSearchName = () => {

    if (
      searchString.trim() === "" ||
      (typeof searchString === "string" && searchString === "") ||
      searchString.length === 0
    ) {
      setDummyServiceDatas(serviceDatas);
      return;
    }

    const FilteredData = serviceDatas.filter((item) => {
      if (item.user.name.toLowerCase().includes(searchString)) {
        return item;
      }
    });


    setDummyServiceDatas(FilteredData);
  };

 
  const handleServiceStatusUpdate = (status: string, id: string, amount: number) => {
    try {
      updateServiceBookingStatus(id, status, amount).then((response: any) => {
        if (response.data.success) {
          setModalData((prev) => {
            if (prev !== null) {
              return { ...prev, status: amount <= 1000 && status === "outfordelivery" ? "completed" : status as ResponsegetBookingStillTodaysDate["status"],paymentStatus: amount <= 1000 && status === "outfordelivery"?"paid": "pending" };
            }
            return null;
          });
          const updatedData = serviceDatas.map((item) => {
            if (id === item._id) {
              return { ...item, status: amount <= 1000 && status === "outfordelivery" ? "completed" : status as ResponsegetBookingStillTodaysDate["status"],paymentStatus: amount <= 1000 && status === "outfordelivery"?"paid": "pending"  }
            }
            return item
          })
          setDummyServiceDatas(updatedData)
          setServiceDatas(updatedData)
        }

      })
    } catch (error) { }
  };


  return (
    <>
      <div className="w-[80%] h-auto  mt-4">
        <div className="w-[100%] h-[600px]  flex ">
          <div className="w-[30%]  h-[600px]   flex flex-col ml-4 ">
            <div className="w-[100%] h-[50px]  flex items-center ">
              <input
                type="text"
                placeholder="Search with Username"
                value={searchString ? searchString : ""}
                onChange={(e) => {
                  setSearchString(e.target.value);
                  onChangeSearchName();
                }}
                className="text-center rounded-sm w-[100%] h-[40px] bg-banner-gray text-white outline-none"
              />
              {true ? (
                ""
              ) : (
                <MdCancel
                  className="text-4xl text-gray-50 cursor-pointer"
                  onClick={() => { }}
                />
              )}
            </div>
            <div className="w-[100%] h-[80px]  flex">
              <form className="w-[100%]  mx-auto">
                <label className="block mb-2 text-sm font-medium text-gray-400 text-center">
                  Filter According to Service Status
                </label>
                <select
                  id="status"
                  onChange={(e) => {
                    handleChangeStatus(e.target.value);
                  }}
                  className=" border   text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 bg-banner-gray dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                >
                  <option selected>Choose a service Status</option>
                  {FilterWithServiceStatus.map((item: string, key) => (
                    <option
                      key={key}
                      value={item}
                      className={
                        statusColors[item as keyof StatusColors] || "text-white"
                      }
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </form>
            </div>
            <div className="w-[100%] h-[300px] mt-20  flex items-center justify-center">
                           <img src={sample} width={200} alt="" />
                        </div>
          </div>
          <div className="w-[70%] h-[600px]   ml-2 space-y-2 overflow-y-scroll  scrollbar-hide ">
            {dummyServiceDatas.map((item, index) => (
              <div  className="w-[95%] animate-fadeInDownBig h-[70px]  bg-banner-gray flex rounded-md space-x-2 justify-between" key={index}>
                <div className="w-[15%] h-[70px]  text-white flex flex-col justify-center items-center">
                  <div>
                    <h1>{item.user.name}</h1>
                    <h1>{item.user.mobile}</h1>
                  </div>
                </div>
                <div className="w-[15%] h-[70px]  text-white flex flex-col justify-center items-center">
                  <div>
                    <h1 className="text-center">{`${new Date(
                      item.bookeddate.date
                    ).toDateString()}`}</h1>
                  </div>
                </div>
                <div className="w-[20%] h-[70px] text-white flex flex-col justify-center items-center">
                  <h1>{`${item.servicename.serviceType} x${item.selectedService.length}`}</h1>
                </div>
                <div className="w-[20%] h-[70px] text-white flex flex-col justify-center items-center">
                  <h1 className={`${statusColors[item.status]}`}>
                    {item.status}
                  </h1>
                </div>
                <div className="w-[20%] h-[70px]  flex space-x-6 justify-center items-center">
                  <IoIosChatboxes className="text-orange text-2xl cursor-pointer" onClick={()=>{
                     if (providerInfo?.id) {
                      chatCreation(providerInfo?.id,item.user._id)
                     }
                  }} />
                  <MdOutlineCall className="text-2xl text-blue-500" />
                </div>
                <div className="w-[10%] h-[70px] flex flex-col justify-center items-center group relative">
                  <FcViewDetails
                    className="text-2xl cursor-pointer"
                    onClick={() => {
                      setModalData(item);
                      setModalState(true);
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-10 w-[200%]  left-1/4 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg">
                    view detail or update
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModal && (
        <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center transition delay-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-banner-gray rounded-lg w-[95%] md:w-[60%] h-[80%] flex flex-col items-center">
          <div className="w-full h-[10%] mt-0 flex justify-end">
            <div className="w-[90%] mt-4">
              <h1 className="text-white text-center text-xl font-semibold">
                Service Details
              </h1>
            </div>
            <IoMdClose
              className="text-3xl text-red-600 bg-white rounded-sm cursor-pointer mr-2 mt-2"
              onClick={() => setModalState(false)}
            />
          </div>
  
          <div className="w-[95%] h-[450px] flex flex-col">
            <div className="w-full h-[350px] flex flex-col">
              <div className="w-full h-[200px] flex justify-between">
                <div className="w-[25%] h-[200px]">
                  <div className="w-[80%] h-full flex flex-col justify-center items-center text-white">
                    <div className="w-[75%] h-[130px] bg-rose-300 rounded-full overflow-hidden flex justify-center items-center">
                      <img
                        src={modalData?.user.logoUrl || "/placeholder.svg"}
                        alt="User Logo"
                        width={130}
                        height={130}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="text-md mt-2">{modalData?.user.name}</h1>
                    <h1 className="text-md">{modalData?.user.mobile}</h1>
                  </div>
                </div>
                <div className="w-[25%] h-[300px] flex flex-col space-y-2">
                  <form className="w-full mx-auto">
                    {modalData?.status !== "cancelled" && modalData?.status !== "completed" ? (
                      <>
                        <label className="block mb-2 text-sm font-medium text-gray-400 text-center">
                          Update Status
                        </label>
                        <select
                          value={modalData?.status || ""}
                          onChange={(e) => {
                            if (modalData) {
                              const totalPrice = modalData.selectedService.reduce(
                                (acc, curr) => acc + (curr?.price || 0),
                                0
                              )
                              handleServiceStatusUpdate(
                                e.target.value,
                                modalData._id,
                                totalPrice < 1000 ? Math.abs(1000 - totalPrice) : totalPrice
                              )
                            }
                          }}
                          className={`${
                            modalData
                              ? statusColors[modalData.status as keyof StatusColors]
                              : "text-white"
                          } border text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 bg-banner-gray dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500`}
                        >
                          {updationStatusForService.map((item: string) => (
                            <option
                              key={item}
                              value={item}
                              className={statusColors[item as keyof StatusColors] || "text-black"}
                            >
                              {item}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <h1
                        className={`text-center ${
                          modalData?.status === "cancelled" ? "text-red" : "text-green-500"
                        }`}
                      >
                        {`Service ${modalData?.status}`}
                      </h1>
                    )}
                  </form>
                  <div className="w-full justify-center flex space-x-2 text-white">
                  {modalData?.status==="cancelled"?
                   <>
                   <h1>Advance Payment</h1>
                   <h1>:</h1>
                   <h1
                     className={`
                      ${modalData?.advance&&"text-blue-400"}
                     `}
                   >
                     Refunded
                   </h1></>: <>
                   <h1>Payment Status</h1>
                   <h1>:</h1>
                   <h1
                     className={
                       modalData?.paymentStatus === "paid" ? "text-green-500" : "text-red"
                     }
                   >
                     {modalData?.paymentStatus}
                   </h1></>

                  }
                 
                  </div>
                </div>
                <div className="w-[45%] h-[350px] text-white overflow-y-scroll space-y-6 scrollbar-hide">
                  {modalData?.selectedService.map((item, key) => (
                    <div
                      key={key}
                      className="w-full h-[10px] flex space-x-2 justify-center"
                    >
                      <h1>{item.serviceName}</h1>
                      <h1>:</h1>
                      <h1>{`${item.price} Rs`}</h1>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[40%] h-[150px] text-white">
                <div className="w-[60%] h-[120px] ml-3 flex flex-col items-center justify-center space-y-3">
                  <div className="w-full flex space-x-3 ml-2">
                    <h1>Brand</h1>
                    <h1>:</h1>
                    <h1>{modalData?.brand.brand}</h1>
                  </div>
                  <div className="w-full flex space-x-3">
                    <h1>Model</h1>
                    <h1>:</h1>
                    <h1>{modalData?.vechileDetails.model}</h1>
                  </div>
                  <div className="w-full flex space-x-3">
                    <h1>Kilometer</h1>
                    <h1>:</h1>
                    <h1>{modalData?.vechileDetails.kilometer}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[100px] flex justify-between">
              <div className="w-[60%] h-[100px] flex flex-col mb-6">
                <div className="w-full mb-3 h-[20px]">
                  <h1 className="mb-8 text-lg font-semibold text-gray-300">
                     Suggestion
                  </h1>
                </div>
                <div className="w-full h-[80px] text-white">
                  <p className="text-sm">
                    {modalData && modalData.suggestions.trim() !== ""
                      ? modalData.suggestions
                      : "No suggestions"}
                  </p>
                </div>
              </div>
              <div className="w-[40%] h-[100px] flex justify-center items-center text-white space-x-4">
                <h1>Total Amount</h1>
                <h1>:</h1>
                <h1>{`${modalData?.selectedService.reduce(
                  (acc, curr) => acc + curr.price,
                  0
                )} Rs`}</h1>
              </div>
            </div>
          </div>
  
          {/* {modalData?.status !== "cancelled" &&
            modalData?.status !== "completed" &&
            modalData?.status !== "outfordelivery" && (
              <div className="w-[80%] h-[10%] bg-opacity-75 flex justify-between items-center mt-6 space-x-4">
                <input
                  value={extraWork}
                  type="text"
                  className="w-[45%] bg-slate-600 text-white h-[60%] rounded-sm text-sm text-center"
                  placeholder="Add if any extra service done"
                  maxLength={20}
                  onChange={(e) => setExtraWork(e.target.value)}
                />
                <input
                  type="text"
                  value={amount}
                  className="w-[15%] bg-slate-600 text-white h-[60%] rounded-sm text-sm text-center"
                  placeholder="Amount"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  className="w-[30%] bg-orange-500 h-[60%] rounded-md bg-orange text-white"
                  onClick={addExtraWork}
                >
                  ADD
                </button>
              </div>
            )} */}
        </div>
      </motion.div>
      )}
    </>
  );
}

export default Services;
