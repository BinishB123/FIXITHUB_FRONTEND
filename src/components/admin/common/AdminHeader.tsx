import { useNavigate } from 'react-router-dom'
import appLogo from '../../../assets/Rectangle 168.png'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../Redux/store/store'
import { useEffect } from 'react'
import { toast } from "sonner"
import { useDispatch } from 'react-redux'
import { resetError, resetSuccess } from '../../../Redux/slice/adminSlice'
import { logoutThunk } from '../../../Redux/thunk/admin'
function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { isAdmin, error, errorMessage, success, message } = useSelector((state: RootState) => state.admin)
    useEffect(() => {
        if (error) {
            toast.error(errorMessage)
            dispatch(resetError())
           
        }
        if (success) {
            toast(message)
            dispatch(resetSuccess())
            navigate('/admin/signin',{replace:true})

        }

    }, [error,errorMessage,success,message])

    return (<div className='h-[10%] w-[100%]  flex flex-row   justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6 animate-flipInX '>
            <img src={appLogo} alt=""  /><h1 className='font-dm font-bold text-white text-2xl hover:text-orange-500 '>FIXITHUB</h1>
        </div>
        <div className='hidden md:w-[70%] md:flex  justify-center animate-fadeInDownBig'>   
            <div className='w-[85%] flex justify-evenly items-center cursor-pointer '>
                <h1 className='font-dm font-semibold text-sm text-white hover:scale-90 hover:-translate-x-3 hover:text-orange hover:text-lg duration-200  ease-in' onClick={() => {
                    navigate('/admin/dashboard')
                }}>DASHBOARD</h1>
                <h1 className='font-dm font-semibold text-sm text-white hover:scale-90 hover:-translate-x-3 hover:text-orange hover:text-lg duration-200  ease-in' onClick={() => {
                 navigate('/admin/userlist')
                }}>USERS</h1>
                <h1 className='font-dm font-semibold text-sm text-white hover:scale-90 hover:translate-x-3 hover:text-orange hover:text-lg duration-200  ease-in'
                onClick={()=>{navigate('/admin/providers')}}
                >PROVIDERS</h1>
                <h1 className='font-dm font-semibold text-sm text-white hover:scale-90 hover:translate-x-3 hover:text-orange hover:text-lg duration-200  ease-in' onClick={() => {
                    navigate('/admin/settings')
                }}>OUR SERVICES</h1>

            </div>

        </div>
        <div className='w-[15%] flex  justify-center'>
            <div className='w-[85%] flex justify-evenly items-center'>
                {
                    isAdmin ? <h1 className='font-dm font-semibold text-md text-white hover:scale-90 hover:translate-x-3 hover:text-orange hover:text-lg duration-300  ease-in cursor-pointer' onClick={()=>{
                        dispatch(logoutThunk())
                    }}  >LOGOUT</h1> :
                        <h1 className='font-dm font-semibold text-md text-white cursor-pointer' onClick={() => {
                            navigate('/admin/signin')
                        }}>LOGIN</h1>
                }

            </div>
        </div>
    </div>)
}

export default Header