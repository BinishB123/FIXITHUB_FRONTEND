import signInImage from "../../assets/providerSignIn.png";
import { GiAutoRepair } from 'react-icons/gi';
import { TiUserAdd } from "react-icons/ti";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store/store";
import { signInThunk } from "../../Redux/thunk/provider";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { resetError, resetSuccess } from "../../Redux/slice/providerSlice";
import { AiOutlineEye } from "react-icons/ai";
import { IoEyeOffOutline } from "react-icons/io5";
function ProviderSignIn() {
  
    const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };
  
  const [formstate, setFormstate] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const [validation, setvalidation] = useState<{
    field: string;
    message: string;
  }>({ field: "", message: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { errorMessage, error, message, success, providerInfo } = useSelector(
    (state: RootState) => state.provider
  );
  useEffect(() => {
   
    
    if (providerInfo) {
      navigate("/provider");
    }
  }, []);
  useEffect(() => {
    if (error&&errorMessage) {
      toast.error(errorMessage);
      dispatch(resetError());
    }
    if (success && providerInfo) {
      toast.success(message);
      dispatch(resetSuccess());
      navigate("/provider", { replace: true });
    }
  }, [message, success, error, errorMessage]);

  const signIn = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formstate.email.trim()
    );
    if (!isValidEmail || formstate.email.trim() === "") {
      setvalidation({
        field: "email",
        message: "please provide a valid emailid",
      });
      setTimeout(() => {
        setvalidation({ field: "", message: "" });
      }, 5000);
      return;
    }

    if (formstate.password.trim() === "") {
      setvalidation({
        field: "password",
        message: "please provide a strong password",
      });
      setTimeout(() => {
        setvalidation({ field: "", message: "" });
      }, 5000);
      return;
    }

    dispatch(signInThunk({ signin: formstate }));
  };

  const onChangeFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      if (value.trim() === "") {
        setvalidation({
          field: name,
          message: "please provide a strong password",
        });
      }
    }

    if (name === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      if (!isValidEmail || value.trim() === "") {
        setvalidation({
          field: name,
          message: "please provide a valid emailid",
        });
      }
    }

    setFormstate((prevFormData) => ({ ...prevFormData, [name]: value }));

    setTimeout(() => {
      setvalidation({ field: "", message: "" });
    }, 5000);
  };

  return (
    <div className="h-lvh bg-black  md:h-screen flex-col">
      <div className="h-[10%] w-[100%]  flex flex-row  justify-between">
        <div className="h-[50%] w-[15%] space-x-2 flex mt-6 ml-6">
        <GiAutoRepair className="text-3xl text-center text-orange " />
          <h1 className="font-dm font-bold text-white text-2xl">FIXITHUB</h1>
        </div>
        <div className="h-[50%] w-[15%]  flex mt-6  space-x-3">
          <h1
            className="text-md font-dm text-white mt-2 cursor-pointer"
            onClick={() => {
              navigate("/provider/signup");
            }}
          >
            SIGNUP{" "}
          </h1>
          <TiUserAdd
            onClick={() => {
              navigate("/provider/signup");
            }}
            className=" w-[20%] h-[100%] text-white"
          />
        </div>
      </div>
      <div className="h-[90%]   flex flex-col md:flex-row">
        <div className="h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3  place-content-center items-center">
          <div className=" md:h-[45%] w-[50%] md:w-[70%]  flex justify-center ">
            <img
              src={signInImage}
              className=" md:h-[100%] w-[65%] animate-fadeInDownBig"
            ></img>
          </div>
          <div className="md:h-[40%] w-[50%] md:w-[70%] ">
            <h1 className=" text-xl md:text-4xl font-dm font-light tracking-widest text-white  animate-fadeInUp">
              "Sign In or Join Now to Experience Elite Auto Services!"
            </h1>
          </div>
        </div>
        <div className="h-[100%] w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col  cursor-pointer">
          <div className="bg-gradient-to-b from-gray-950 w-[60%] h-[450px] flex flex-col items-center space-y-4 shadow-2xl  rounded-md animate-fadeInDownBig">
            <h1 className="text-center text-white font-dm font-bold mt-6">
              SIGN IN
            </h1>
            <div className="w-[80%] h-[30%] flex flex-col items-center space-y-4">
              <input
                className="w-[100%] outline-none bg-gray-400 h-12 rounded-sm text-center text-black placeholder-black text-sm font-dm"
                placeholder="E-mail"
                name="email"
                value={formstate.email}
                onChange={onChangeFormData}
                type="email"
              ></input>
              {validation.field === "email" ? (
                <p className="text-sm font-semibold text-red">
                  please Enter valid email
                </p>
              ) : (
                ""
              )}
              <div className="w-[100%] h-[45px] flex  items-end">
                <input
                  className="w-[90%] outline-none bg-gray-400 h-[100%] rounded-sm rounded-l-md  text-center text-black placeholder-black mt-4 text-sm font-dm"
                  placeholder="password"
                  name="password"
                  type={showPassword ? "text" : "password"}  
                  value={formstate.password}
                  onChange={onChangeFormData}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="bg-gray-400 h-[100%] flex items-center justify-center px-3 rounded-r-md"
                >
                  {showPassword ? (
                    <IoEyeOffOutline  className="text-2xl text-black  "/> 
                  ) : (
                  <AiOutlineEye className="text-black text-2xl  " />  
        )}
                </button>
              </div>
              {validation.field === "password" ? (
                <p className="text-sm font-semibold text-red">
                  please Enter password
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="w-[80%] h-[20%]   space-y-3 ">
              <button
                className=" bg-orange w-[100%] h-[50%]  rounded-md text-2xl text-white hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] "
                onClick={signIn}
              >
                SIGN IN
              </button>
              {/* <div className=" bg-black w-[100%] h-[50%] flex flex-row items-center rounded-md  ">
                <div className="w-[30%] h-[50%] ">
                  <FcGoogle className="mt-2 w-[100%]" />
                </div>
                <div className="w-[70%] h-[50%] ">
                  <p className="mt-1 text-white text-sm tracking-widest ">
                    SIGNIN WITH GOOGLE
                  </p>
                </div>
              </div> */}
              <p className="text-white text-center">
                {" "}
                SignUp if You Don’t Have An Account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderSignIn;
