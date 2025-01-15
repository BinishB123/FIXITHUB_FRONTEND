import { useLocation, useNavigate } from 'react-router-dom';
import otpImage from '../../assets/otpimage.png'
import appLogo from '../../assets/Rectangle 168.png'
import { RiLoginCircleFill } from "react-icons/ri";
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { apiUrl } from '../../api/common';
import { Iusersignup } from '../../interfaces/userInterface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store/store';
import {  verfiyAndSignupThunk } from '../../Redux/slice/userSlice';
import { RootState } from '../../Redux/store/store';
import {  urgentreset } from '../../Redux/slice/userSlice';
import { useSelector } from 'react-redux';



function UserOtpPage() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>()
  const { formdata } = location.state || {};
  const [resend, setresend] = useState<boolean>(false)
  const [seconds, setseconds] = useState<number>(60)
  const [OtpNumber, setOtpNumbers] = useState(Array(4).fill(''))
  const inputRef = useRef<Array<HTMLInputElement | null>>([])
  const navigate = useNavigate()
  const { success, error, message ,errormessage} = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (error) {
      toast.error(errormessage);
      dispatch(urgentreset());
    }
    if (success) {
      toast.success(message)
      dispatch(urgentreset())
      navigate('/', { replace: true })
      localStorage.removeItem("usertimer")
    }
    if (success === false) {
      toast.error(message)
      dispatch(urgentreset())
    }
  }, [dispatch, success,error, message]);

  useEffect(() => {
    const storedSeconds = localStorage.getItem('usertimer');
    if (storedSeconds) {
      setseconds(Number(storedSeconds));
    }
  }, []);



  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {
        setseconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem('usertimer', newSeconds.toString());
          return newSeconds;
        });
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      localStorage.removeItem('usertimer');
    }
  }, [seconds, resend]);


  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (e.target.value.length === 1 && index < 4) {
      const newOtp = [...OtpNumber]
      newOtp[index] = value
      setOtpNumbers(newOtp)
      inputRef.current[index + 1]?.focus();
    }

  }

  const resendOnClick = async () => {
    if (formdata?.email) {
      try {  
        const response = await axios.post(apiUrl + '/api/user/auth/sendotp', formdata);
        if (response.data.success) {
          toast.success(response.data.message);
          setOtpNumbers(Array(4).fill(''))
          inputRef.current[0]?.focus()
          setresend(!resend);
          setseconds(60)
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {

        toast.error("An error occurred while sending the OTP.");
      }
    } else {
      toast.error("Email is missing. Cannot resend OTP.");

    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

    if (e.key === 'Backspace' && index >= 0) {
      const newOtp = [...OtpNumber]
      newOtp[index] = ''
      setOtpNumbers(newOtp)
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRef.current[index - 1]?.focus()
    }

  }



  const verfiyAndSignup = () => {
    const finalnumbers = OtpNumber.filter((number) => {
      return number !== '' && /^[0-9]$/.test(number);
    });

    if (finalnumbers.length !== 4) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    const userData: Iusersignup = {
      name: formdata.name,
      mobile: formdata.mobile,
      email: formdata.email,
      password: formdata.password
    };
    const finalotp = finalnumbers.join('');
    dispatch(verfiyAndSignupThunk({ userData, otp: finalotp }));
  };






  return (
    <div className='h-screen bg-black  md:h-screen flex-col'>
      <div className='h-[10%] w-[100%]  flex flex-row  justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
          <img src={appLogo} alt="" /><h1 className='font-dm font-bold text-white text-2xl'>FIXITHUB</h1>
        </div>
        <div className='h-[50%] w-[15%]  flex mt-6  space-x-3' onClick={() => {
          navigate('/login')
        }}>
          <h1 className='text-md font-dm text-white mt-2 cursor-pointer' >LOGIN </h1><RiLoginCircleFill className=' w-[20%] h-[100%] text-white cursor-pointer' />
        </div>

      </div>
      <div className='h-[90%]   flex flex-col md:flex-row'>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3  place-content-center items-center' >
          <div className=' md:h-[45%] w-[50%] md:w-[70%]  flex justify-center '>
            <img src={otpImage} className=' md:h-[100%] w-[65%] animate-fadeInDownBig'></img>
          </div>
          <div className='md:h-[40%] w-[50%] md:w-[70%] '>
            <h1 className=' text-xl md:text-4xl font-dm font-light tracking-widest text-white animate-fadeInUp '>"Your journey to seamless repairs starts here. Enter the OTP to confirm and proceed with confidence!"</h1>

          </div>
        </div>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col '>
          <div className='bg-gradient-to-b from-gray-950 w-[60%] h-[300px] rounded-md flex flex-col  items-center animate-fadeInDownBig  '>
            <h1 className='text-white mt-6'>ENTER OTP</h1>
            <p className='text-gray-200 text-sm font-thin'>4-DIGIT OTP SEND TO YOU EMAIL</p>
            <div className='flex flex-row w-[100%] mt-4 justify-evenly'>
              {
                OtpNumber.map((value, index) => (
                  <input
                    value={value}
                    ref={(el) => (inputRef.current[index] = el)}
                    key={index}
                    onKeyDown={(e) => { handleKeyDown(e, index) }}
                    onChange={(e) => { handleOnChange(e, index) }}
                    className='w-[17%] h-[70px] rounded-md bg-gray-400 text-center '
                    maxLength={1}
                  />
                ))
              }

            </div>
            <h1 className={seconds <= 10 ? 'mt-3 font-semibold text-sm text-red-500 h-[10px]' : 'mt-3 font-semibold text-sm h-[10px] text-white'}>
              {seconds > 0 ? `${seconds} seconds left` : "Time Out "}
            </h1>            {
              seconds > 0 ?
                (<button className='bg-orange mt-10 w-[50%] h-[50px] rounded-md text-white font-dm' onClick={verfiyAndSignup}>verify</button>) :
                (<button className='bg-orange mt-10 w-[50%] h-[50px] rounded-md text-white font-dm' onClick={resendOnClick}>RESEND OTP</button>)
            }

          </div>


        </div>


      </div>

    </div>
  )
}

export default UserOtpPage



