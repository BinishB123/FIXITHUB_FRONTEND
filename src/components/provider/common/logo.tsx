import { useSelector } from 'react-redux'
import { GiAutoRepair } from 'react-icons/gi';
import { AppDispatch, RootState } from '../../../Redux/store/store'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutthunk } from '../../../Redux/thunk/provider'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { resetSuccess } from '../../../Redux/slice/providerSlice'

function Logo() {
    const { providerInfo, message, success } = useSelector((state: RootState) => state.provider)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
       if(!providerInfo){
        navigate('/provider/signin')
       }

    },[])
    useEffect(() => {
        if (success) {
            toast(message)
            dispatch(resetSuccess())
             if (!providerInfo) {
                navigate('/provider/signin',{replace:true})
             }

          
        }

    }, [message, success])
    return (<><div className='h-[10%] w-[100%]  flex flex-row   justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml- '>
        <GiAutoRepair className="text-3xl text-center text-orange " /><h1 className='font-dm font-bold text-white text-xl hover:text-orange-500'>FIXITHUB</h1>
        </div>

        <div className='w-[15%] flex  justify-center'>
            <div className='w-[85%] flex justify-evenly items-center'>
                {
                    providerInfo ? <h1 className='font-dm font-semibold text-md text-white hover:scale-90 hover:translate-x-3 hover:text-orange hover:text-lg duration-300  ease-in cursor-pointer' onClick={() => {
                        dispatch(logoutthunk())
                    }}  >LOGOUT</h1> :
                        <h1 className='font-dm font-semibold text-md text-white cursor-pointer' onClick={() => {
                            navigate("/provider/signin")
                        }}>LOGIN</h1>
                }

            </div>
        </div>
    </div>


    </>)
}

export default Logo