import { useEffect, useState } from "react"
import { editReport, getReport, getReportDeatils } from "../../services/admin/adminReports"
import { FaArrowDownLong, FaArrowRightLong } from "react-icons/fa6";
import users from '../../assets/user.png'
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { reportData, reportDetailsData } from "../../interfaces/admin";


function AdminReport() {
    const [reportData, setReportData] = useState<reportData[] | []>([])
    const [showReportData, setShowReportData] = useState<boolean>(false)
    const [reportDetails, setReportDetails] = useState<reportDetailsData | null>(null)
    const FilterWithServiceStatus = [
        "Pending", "In Progress", "Approved", "Rejected", "Completed"
      ];
    useEffect(() => {
        getReport().then((response: any) => {
            setReportData(response.data)


        })

    }, [])

    const onClickGetReportDetails = (id: string) => {
        getReportDeatils(id).then((response: any) => {
            console.log(response);

            setReportDetails(response.data)
            setShowReportData(true)

        })
    }

    const onChangeStatusOfReport = (id:string,value:string)=>{
        console.log(value);
        editReport(id,value).then((response)=>{
            if (reportDetails) {
                setReportDetails({...reportDetails,status:value})
            }
            const updateData = reportData.map((data)=>{
                if (data._id===id) {
                  return  {...data,status:value}
                }
                return data
            })||[]
            if (updateData) {
                setReportData(updateData as reportData[]); // Ensure type compatibility
            }
            
        })
        

    }



    return (<>
        <div className="w-[100%] h-auto">
            <div className="w-[100%] h-[670px] flex justify-center items-center bg-black ">
                <div className="w-[80%] h-full flex flex-col ">
                    <div className="w-[100%] h-[40px] ">
                        <h1 className="text-white text-md font-dm pl-16">REPORTS FROM USERS</h1>
                    </div>
                    <div className="w-[100%] h-[630px] flex flex-wrap justify-center space-y-2 space-x-2 overflow-y-scroll scrollbar-hide">
                        {reportData.map((data, index) => (
                            <>
                                <div className={`w-[33%] h-[200px] bg-banner-gray ${index === 0 && "mt-2 ml-2"} flex flex-col justify-center items-center rounded-sm`}>
                                    <div className="w-[100%] h-[50px] flex justify-between">
                                        <div className="w-[40%] h-full  flex space-x-1 items-center">
                                            <img src={data.user?.logoUrl ? data.user.logoUrl : users} alt="Image"
                                                className="w-12 h-12 mt-2 ml-2 rounded-full" />
                                            <h1 className="text-white truncate">{data.user?.name}</h1>
                                        </div>
                                        <div className="w-[15%] h-full  flex flex-col justify-center items-center ">
                                            <h1 className="text-sm text-white">{data.status}</h1>
                                            <FaArrowRightLong className="text-red text-xl" />

                                        </div>
                                        <div className="w-[45%] h-full flex space-x-1 items-center pr-1">
                                            <img src={data.provider?.logoUrl ? data.provider.logoUrl : users} alt="Image"
                                                className="w-12 h-12 mt-2  ml-2 rounded-full" />
                                            <h1 className="text-white truncate">{data.provider?.workshopName}</h1>
                                        </div>
                                    </div>
                                    <div className="w-[90%] h-[100px] flex justify-center items-center ">
                                        <p className="text-sm font-dm text-gray-300 ">{data.report}</p>
                                    </div>
                                    <div className="w-[90%] h-[50px]  flex justify-center">
                                        <button className="w-[50%] text-sm font-semibold h-[35px] text-white rounded-sm bg-orange" onClick={() => {
                                            onClickGetReportDetails(data._id + "")
                                        }}>
                                            View In Detail
                                        </button>

                                    </div>

                                </div>
                            </>
                        ))}

                    </div>

                </div>

            </div>

        </div>
        {showReportData && <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center transition delay-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-[60%] h-[30px]  flex justify-end">
             <IoMdClose className="text-4xl bg-red text-white cursor-pointer " onClick={()=>{
                setShowReportData(false)
             }}/>
            </div>
            <div className="w-[100%] h-auto flex justify-center items-center">

                <div className="w-[60%] h-[500px] bg-banner-gray flex flex-col  items-center">
                    <div className="w-[100%] h-[120px]  flex flex-col">
                        <div className="w-[100%] flex">
                            <div className="w-[40%] h-full  flex space-x-1 items-center">
                                <img src={reportDetails?.user.logoUrl} alt="Image"
                                    className="w-12 h-12 mt-2 ml-2 rounded-full" />
                                <h1 className="text-white truncate">{reportDetails?.user.name}</h1>
                            </div>
                        </div>


                        <div className="w-[100%] flex justify-end">
                            <div className="w-[50%] flex h-full">
                                <FaArrowDownLong className="text-red text-4xl" />
                                <FaArrowRightLong className="text-red text-4xl mt-5" />
                                <div className="w-[80%] pl-4 h-full">
                                    <h1 className="text-sm text-gray-300">{`${reportDetails?.user.name} reported ${reportDetails?.provider.workshopName} in  ${reportDetails?.servicename.serviceType} Related Service`}</h1>
                                    <h1 className="text-sm font-dm font-semibold text-gray-200">{`service status is ${reportDetails?.bookings.status}`}</h1>
                                </div>
                            </div>
                            <div className="w-[40%] h-full  flex space-x-1 items-center">
                                <img src={reportDetails?.provider.logoUrl} alt="Image"
                                    className="w-12 h-12 mt-2 ml-2 rounded-full" />
                                <h1 className="text-white truncate">{reportDetails?.provider.workshopName}</h1>
                            </div>
                        </div>


                    </div>

                    {/*  */}
                    <div className="w-[100%] h-[350px] flex justify-center">
                        <div className=" w-[65%] h-full flex flex-col space-y-4 ">
                            <h1 className="font-dm text-lg text-white">Reason</h1>
                            <p className="text-md font-semi bold text-start text-gray-400">{reportDetails?.report}</p>
                            <h1 className="text-white font-dm text-sm">Update Report status</h1>
                            <div className="w-[60%] h-[50px] bg-rose-50">
                             <select
                                               id="status"
                                               value={reportDetails?.status}
                                               onChange={(e) => {
                                                if (reportDetails){
                                                    onChangeStatusOfReport(reportDetails?._id,e.target.value);

                                                }
                                               }}
                                               className=" border   text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5 bg-banner-gray dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                                             >
                                               <option selected>Choose a service Status</option>
                                               {FilterWithServiceStatus.map((item: string, key) => (
                                                 <option
                                                   key={key}
                                                   value={item}
                                                   className={""
                                                    //  statusColors[item as keyof StatusColors] || "text-white"
                                                   }
                                                 >
                                                   {item}
                                                 </option>
                                               ))}
                                             </select>
                            </div>
                            <div className="w-[100%] h-[200px] border-2 ">
                                <textarea placeholder="Type an Enquiry Message  And send To Provider  " className="pl-3  text-sm font-dm w-full h-full bg-banner-gray text-gray-200" name="" id="" />
                            </div>
                            <div className="w-[100%] h-[80px]  flex justify-end ">
                                <button className="h-full w-[30%] bg-orange text-white rounded-sm">Send To Provider</button>
                            </div>

                        </div>
                        <div className="flex w-[30%] h-full   flex-col space-y-2 overflow-y-scroll ">
                            <h1 className="text-center text-white">Selected Services</h1>
                            {reportDetails?.bookings.selectedService.map((data, index) => (
                                <div className="w-[100%] h-[20px]  flex justify-center">
                                    <h1 className="text-gray-400">{`${data.serviceName} : ${data.price}`}</h1>
                                </div>
                            ))}
                            <h1 className="text-center text-white">{`Total Price : ${reportDetails?.bookings.selectedService.reduce((acc, cuu) => (
                                acc += cuu.price
                            ), 0)}`}</h1>

                        </div>

                    </div>
                </div>

            </div>

        </motion.div>}
    </>)
}

export default AdminReport