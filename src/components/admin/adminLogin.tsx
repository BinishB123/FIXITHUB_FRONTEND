import signInImage from '../../assets/adminSignup.png'
import appLogo from '../../assets/Rectangle 168.png'
import { AppDispatch, RootState } from '../../Redux/store/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInThunk } from '../../Redux/thunk/admin';
import { ImSpinner9 } from "react-icons/im";
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { resetError, resetSuccess } from '../../Redux/slice/adminSlice';
import { useNavigate } from 'react-router-dom';



function AdminLoginComponent() {
  const [formstate, setFormstate] = useState<{ email: string, password: string }>({ email: "", password: "" })
  const [validation, setvalidation] = useState<{ field: string, message: string }>({ field: "", message: "" })
  const { isLoading, success, message, error, errorMessage ,isAdmin } = useSelector((state: RootState) => state.admin)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
   useEffect(() => {
    if(isAdmin){
      navigate('/admin/dashboard')
    }
    if (success) {
      toast.success(message,{duration:1000})
      navigate('/admin/dashboard', { replace: true })
      dispatch( resetSuccess())
    }
    if (error) {
      
      toast.error(errorMessage)
      dispatch(resetError())
    }

  }, [success, message, error, errorMessage])




  const signIn = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formstate.email.trim());
    if (!isValidEmail || formstate.email.trim() === '') {
      setvalidation({ field: "email", message: "please provide a valid emailid" })
      setTimeout(() => {
        setvalidation({ field: '', message: "" })
      }, 5000)
      return
    }

    if (formstate.password.trim() === '') {
      setvalidation({ field: "password", message: "please provide a strong password" })
      setTimeout(() => {
        setvalidation({ field: '', message: "" })
      }, 5000)
      return
    }

    dispatch(signInThunk({ signin: formstate }));
  }


  const onChangeFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'password') {
      if (value.trim() === '') {
        setvalidation({ field: name, message: "please provide a strong password" })
      }
    }

    if (name === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      if (!isValidEmail || value.trim() === '') {
        setvalidation({ field: name, message: "please provide a valid emailid" })
      }
    }

    setFormstate((prevFormData) => ({ ...prevFormData, [name]: value }))

    setTimeout(() => {
      setvalidation({ field: '', message: "" })
    }, 5000)

  }



  return (
    <div className='h-lvh bg-black  md:h-screen flex-col'>
      <div className='h-[10%] w-[100%]  flex flex-row  justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
          <img src={appLogo} alt="" /><h1 className='font-dm font-bold text-white text-2xl'>FIXITHUB</h1>
        </div>


      </div>
      <div className='h-[90%]   flex flex-col md:flex-row'>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3  place-content-center items-center' >
          <div className=' md:h-[45%] w-[50%] md:w-[70%]  flex justify-center '>
            <img src={signInImage} className=' md:h-[100%] w-[65%] animate-fadeInDown'></img>
          </div>
          <div className='md:h-[40%] w-[50%] md:w-[70%] '>
            <h1 className=' text-xl md:text-4xl font-dm font-light tracking-widest text-white  animate-fadeInUp'>"Your Gateway to Complete Control and Oversight!"</h1>

          </div>
        </div>
        <div className='h-[100%] w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col  cursor-pointer'>
          <div className='bg-gradient-to-b from-gray-950 w-[60%] h-[450px] flex flex-col items-center space-y-4 shadow-2xl  rounded-lg animate-fadeInDownBig'>
            <h1 className='text-center text-white font-dm font-bold mt-6'>SIGN IN</h1>
            <div className='w-[80%] h-[30%] flex flex-col items-center space-y-4'>
              <input
                className='w-[100%] bg-gray-400 h-12 rounded-sm text-center text-black placeholder-black text-sm font-dm'
                placeholder='E-mail' name='email' value={formstate.email} onChange={onChangeFormData} type='email'>
              </input>
              {validation.field === "email" ? <p className='text-sm font-semibold text-red-600'>please Enter valid email</p> : ""}
              <input
                className='w-[100%] bg-gray-400 h-12 rounded-sm text-center text-black placeholder-black mt-4 text-sm font-dm'
                placeholder=' password' name='password' type='password' value={formstate.password} onChange={onChangeFormData}>
              </input>
              {validation.field === "password" ? <p className='text-sm font-semibold text-red-600'>please Enter password</p> : ""}

            </div>
            <div className='w-[80%] h-[20%]   space-y-3 '>
              <button className=' bg-orange w-[100%] h-[50%]  rounded-md text-2xl text-white flex place-content-center items-center' onClick={() => {
                if (!isLoading) {
                  signIn()
                }
              }}>{isLoading ? <ImSpinner9 className='animate-spin' /> : "SIGN IN"}</button>

              <p className='text-white text-center'> SignUp if You Don’t Have An Account</p>
            </div>

          </div>


        </div>


      </div>

    </div>
  )
}

export default AdminLoginComponent
