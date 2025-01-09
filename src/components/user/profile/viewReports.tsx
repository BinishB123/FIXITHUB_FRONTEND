import { useEffect, useState } from "react"
import { getreport } from "../../../services/user/userProfile"
import { useSelector } from "react-redux"
import { RootState } from "../../../Redux/store/store"
import { reportData } from "../../../interfaces/userInterface"



function ViewReports(){

   const {userInfo} = useSelector((state:RootState)=>state.user)
   const [reports,setReport] = useState<reportData[]|[]>([])
    useEffect(()=>{
       if (userInfo) {
        getreport(userInfo.id).then((response:any)=>{
            setReport(response.data)
            console.log(response);
            
        })
       }

    },[])
   
    return (<>
    <div className="w-[80%] h-[600px] ">
        <div className="w-[100%] h-[50px] ">
            <h1 className="text-md font-dm text-white">Your Report status</h1>
        </div>
        <div className="w-[100%] h-[550px] overflow-y-scroll scrollbar-hide space-y-3">
            {
                reports.map((data,key)=>(<>
                <div className="w-[80%] h-[60px] bg-banner-gray rounded-sm flex flex-col">
                    <div className="h-[30px] w-[100%] text-white pl-4 flex justify-between">
                      <h1>{`Reported ${data.provider?.workshopName} `}</h1>
                      <h1 className="pr-4 pt-3">{data.status}</h1>
                    </div>
                    <div className="h-[30px] w-[100%] flex pl-4">
                        <div className="w-[70%] h-full flex overflow-hidden text-sm text-gray-400 space-x-5">
                         <h1>Reason</h1>
                         <h2>:</h2>
                         <h3 className="truncate">{data.report}</h3>

                        </div>

                    </div>

                </div>
                </>))
            }

        </div>

    </div>
    </>)
}

export default ViewReports