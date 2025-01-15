import { useEffect, useState } from "react";
import { apiUrl, axiosInstance } from "../../../api/common";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";





function ProviderPendingRequest() {
    const [providers, setProviders] = useState<Array<any>>([])
    const  [reason,setReason] = useState<string>("")
    const [ isModal,setIsModal] = useState<boolean>(false)
    const [ Details,setDetails] = useState<{id:string,state:boolean|null|undefined,email:string}>({id:"",state:undefined,email:""})
    useEffect(() => {
        axiosInstance.get(apiUrl + '/api/admin/providers/getpendingproviders').then((response) => {
            setProviders(response.data.providers)

        })
    }, [])
    const rejectProviderAndacceptProvider = (id:string,state:boolean|null,email?:string,accept?:boolean)=>{
        if (!accept) {
            if(reason.trim()===""){
                return
            }
        }
        axiosInstance.patch(apiUrl + '/api/admin/providers/acceptorreject',{id,state,reason,email,accept}).then(() => {
            
            
            const updated = providers.filter((provider)=>{
                if (provider._id!=id) {
                    return provider
                }
                
            })
            setIsModal(false)
            setProviders(updated)
        })
        
         
    }

    return (<><div className='w-full h-[1050px] flex flex-col mt-20 items-center scrollbar-hide overflow-y-scroll bg-black'>
        <div className='w-[90%] '>
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-white">Workshop Name</th>
                        <th className="px-4 py-2 text-left text-white">Owner Name</th>
                        <th className="px-4 py-2 text-left text-white">Email</th>
                        <th className="px-4 py-2 text-left text-white">Mobile</th>
                        <th className="px-4 py-2 text-left text-white">Workshop Details</th>
                        <th className="px-4 py-2 text-left text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.length > 0 ? providers.map((provider) => (
                        <tr key={provider._id} className="border-b-2 border-b-gray-500 animate-fadeInUp hover:bg-banner-gray">
                            <td className="px-4 py-2 text-white">{provider.workshopName}</td>
                            <td className="px-4 py-2 text-white">{provider.ownerName}</td>
                            <td className="px-4 py-2 text-white">{provider.email}</td>

                            <td className="px-4 py-2 text-white">{provider.mobile}</td>
                            <td className="px-4 py-2 text-white">{provider.workshopDetails.address}</td>

                            <td className="px-4 py-2 text-white space-y-5">
                                <button
                                    className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 mr-2 font-semibold"
                                    onClick={() => {
                                        
                                        rejectProviderAndacceptProvider(provider._id,true,"",true);
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded hover:bg-red-600 bg-red"
                                    onClick={() => {
                                        setIsModal(true)
                                        setDetails({id:provider._id,state:null,email:provider.email})
                                        
                                    }}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    )) : <p className="text-center text-white text-md font-semibold">No new Request</p>}
                </tbody>
            </table>



        </div>
    </div>{isModal && (
    <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center transition delay-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
    >
        <div className="bg-banner-gray rounded-lg w-[95%] md:w-[35%] h-[40%] flex flex-col items-center justify-between">
            <div className="w-[100%] h-[15%] mt-0   flex justify-end">
                <div className=" w-[90%]  mt-4">
                    <h1 className="text-white text-center text-xl font-semibold">
                       Add Reason
                    </h1>
                </div>
                <IoMdClose
                    className="text-3xl text-red-600 bg-white text-red rounded-sm cursor-pointer "
                    onClick={() => {
                        setIsModal(false);
                    }}
                />
            </div>

            <div className="w-[95%] h-[70%] mt-4 flex items-end flex-col space-y-2 overflow-y-scroll  scrollbar-hide">
                <textarea  className="w-[100%] h-[70%] bg-gray-100  text-black rounded-md outline-none"                
                maxLength={620}
                value={reason}
                onChange={(e)=>{
                    setReason(e.target.value)
                }}
                >

                </textarea>
                <button className="w-[30%] rounded-md h-[20%] bg-orange text-white" onClick={()=>{
                    rejectProviderAndacceptProvider(Details.id,Details.state!==undefined&&Details.state,Details.email)
                }}>Done</button>
                
            </div>

            <div className="w-[80%] h-[10%] bg-opacity-75 flex justify-between mt-6">
                
            </div>
        </div>
    </motion.div>
)}</>)
}


export default ProviderPendingRequest
