import { MdPendingActions } from "react-icons/md";
import { GrWorkshop } from "react-icons/gr";
import { useNavigate } from "react-router-dom";


function TwocardsProviderView(){
    const navigate = useNavigate()
    return(<div className='w-[100%] h-[60%] flex place-content-center items-center'>
        <div className='w-[95%] h-[80%]  flex space-x-6 justify-center items-center'>
            <div className='w-[30%] h-[70%] bg-gradient-to-b from-gray-950 animate-fadeInDownBig flex flex-col justify-between items-center  rounded-md '>
                <GrWorkshop className='w-[30%] h-[25%] text-orange mt-1' />
                <h1 className='text-center font-semibold text-white'>Manage Service Providers</h1>
                <p className='w-[80%] text-sm text-gray-100 text-center tracking-widest'>"View and manage the list of service providers. Keep track of their status and manage access efficiently."</p>
                <button className='w-[30%] h-[40px] bg-orange rounded-2xl text-sm font-semibold text-white  transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  mb-3' onClick={()=>{
                    navigate('/admin/providers/providerslist')
                }}>view</button>

            </div>
            <div className='w-[30%] h-[70%] bg-gradient-to-b from-gray-950 animate-fadeInUp flex flex-col items-center justify-between rounded-md '>
                <MdPendingActions className='w-[30%] h-[30%] text-orange' />
                <h1 className='text-center font-semibold text-white'>New Provider Requests</h1>
                <p className='w-[80%] text-sm text-gray-100 text-center tracking-widest'>"Review and approve new service provider requests. Evaluate their applications and decide whether to onboard them, ensuring only trusted providers join the platform."</p>
                <button className='w-[30%] h-[40px] bg-orange rounded-2xl text-sm font-semibold text-white  transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  mb-3' onClick={()=>{
                    navigate("/admin/providers/pendinglist")
                }}>view</button>

            </div>
        </div>

    </div>)
}


export default TwocardsProviderView