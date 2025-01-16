// import { FcGoogle } from "react-icons/fc";
import { GiAutoRepair } from 'react-icons/gi';
import providerSignupImage from "../../assets/providerSignup.png";
import { RiLoginCircleFill } from "react-icons/ri";
import { useState } from "react";
import { Ivalidation } from "../../interfaces/userInterface";
import { Iusersignup } from "../../interfaces/userInterface";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../../api/common';

function ProviderSignupComponent() {
  const navigate = useNavigate();
  const [preventClick,setPreventClick] = useState<boolean>(false)
  const [validation, setvalidation] = useState<Ivalidation>({
    field: "",
    message: "",
  });
  const [formdata, setFormData] = useState<Iusersignup>({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //name validation
    if (name === "name") {
      const isValidName: boolean = /^[A-Za-z]+$/.test(
        value.split(" ").join("")
      );
      if (!isValidName || value.trim() === "") {
        setvalidation({ field: name, message: "Please provide a valid name" });
      }
    }

    //mobile validation
    if (name === "mobile") {
      const isNumeric = /^[6-9]\d{9}$/.test(value.trim());
      const isValidLength = value.trim().length === 10;
      if (value.trim() === "" || !isNumeric || !isValidLength) {
        setvalidation({
          field: name,
          message: "please provide a valid mobile number",
        });
      }
    }

    //email
    if (name === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      if (!isValidEmail || value.trim() === "") {
        setvalidation({
          field: name,
          message: "please provide a valid emailid",
        });
      }
    }

    if (name === "password") {
      if (value.trim() === "") {
        setvalidation({
          field: name,
          message: "please provide a strong password",
        });
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setTimeout(() => {
      setvalidation({ field: "", message: "" });
    }, 5000);
  };

  const onClickToOtp = async () => {
    //click to otp page
    const isValidName: boolean = /^[A-Za-z]+$/.test(
      formdata.name.split(" ").join("")
    );
    if (!isValidName || formdata.name.trim() === "") {
      setvalidation({ field: "name", message: "Please provide a valid name" });
      setTimeout(() => {
        setvalidation({ field: "", message: "" });
      }, 5000);
      return;
    }

    const isNumeric = /^[6-9]\d{9}$/.test(formdata.mobile.trim());
    const isValidLength = formdata.mobile.trim().length === 10;
    if (formdata.mobile.trim() === "" || !isNumeric || !isValidLength) {
      setvalidation({
        field: "mobile",
        message: "please provide a valid mobile number",
      });
      setTimeout(() => {
        setvalidation({ field: "", message: "" });
      }, 5000);
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formdata.email.trim()
    );
    if (!isValidEmail || formdata.email.trim() === "") {
      setvalidation({
        field: "email",
        message: "please provide a valid emailid",
      });
      setTimeout(() => {
        setvalidation({ field: "", message: "" });
      }, 5000);
      return;
    }

    if (formdata.password.trim() === "") {
      setvalidation({
        field: "password",
        message: "please provide a strong password",
      });
      setTimeout(() => {
        setvalidation({ field: "", message: "" });
      }, 5000);
      return;
    }
    setPreventClick(true)
    axios
      .post(apiUrl+"/api/provider/auth/sendotp", formdata)
      .then((response) => {
        toast.success(response.data.message);
        navigate("/provider/otpverify", { state: { formdata } });
      })
      .catch((error) => {
        setPreventClick(false)
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      });
  };

  return (
    <div className="h-screen bg-black  md:h-screen flex-col">
      <div className="h-[10%] w-[100%]  flex flex-row  justify-between">
        <div className="h-[50%] w-[15%] space-x-2 flex mt-6 ml-6">
        <GiAutoRepair className="text-3xl text-center text-orange " />
          <h1 className="font-dm font-bold text-white text-2xl">FIXITHUB</h1>
        </div>
        <div className="h-[50%] w-[15%]  flex mt-6  space-x-3  cursor-pointer" onClick={()=>{
          navigate("/provider/signin")
        }} >
          <h1 className="text-md font-dm text-white mt-2">LOGIN </h1>
          <RiLoginCircleFill className=" w-[20%] h-[100%] text-white" />
        </div>
      </div>
      <div className="h-[90%]   flex flex-col md:flex-row">
        <div className="h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3  place-content-center items-center">
          <div className=" md:h-[45%] w-[50%] md:w-[70%]  flex justify-center ">
            <img
              src={providerSignupImage}
              className=" md:h-[100%] w-[65%] animate-fadeInDown"
            ></img>
          </div>
          <div className="md:h-[40%] w-[50%] md:w-[70%] ">
            <h1 className=" text-xl md:text-4xl font-dm font-light tracking-widest text-white animate-fadeInUp ">
              "Register Your Workshop and Expand Your Reach with Premium Auto
              Services!"
            </h1>
          </div>
        </div>
        <div className="h-[100%] w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col ">
          <div className="bg-gradient-to-b from-gray-950 w-[60%] h-[90%] rounded-md flex flex-col space-y-6 items-center animate-fadeInDownBig">
            <div className="w-[100%] h-[5%]">
              <h1 className="text-center mt-5 text-white font-dm  font-bold text-2xl tracking-wider">
                SIGN UP
              </h1>
            </div>
            <div className="w-[80%] h-[40%]   mt-6 flex-col place-content-evenly space-y-5">
              <input
                className="w-[100%] h-[15%] bg-gray-300 rounded-md text-center "
                placeholder="owner name"
                value={formdata.name}
                onChange={onchange}
                name="name"
                type="name"
              ></input>
              {validation.field === "name" ? (
                <p className="  text-red text-sm text-center font-semibold  ">
                  {validation.message}
                </p>
              ) : (
                ""
              )}
              <input
                className="w-[100%] h-[15%] bg-gray-300 rounded-md text-center "
                placeholder="mobile"
                name="mobile"
                value={formdata.mobile}
                onChange={onchange}
              ></input>
              {validation.field === "mobile" ? (
                <p className="  text-red text-sm text-center font-semibold  ">
                  {validation.message}
                </p>
              ) : (
                ""
              )}
              <input
                className="w-[100%] h-[15%] bg-gray-300 rounded-md text-center "
                placeholder="email"
                onChange={onchange}
                name="email"
                value={formdata.email}
              ></input>
              {validation.field === "email" ? (
                <p className="  text-red text-sm text-center font-semibold  ">
                  {validation.message}
                </p>
              ) : (
                ""
              )}
              <input
                className="w-[100%] h-[15%] bg-gray-300 rounded-md text-center "
                placeholder="password"
                name="password"
                value={formdata.password}
                onChange={onchange}
                type="password"
              ></input>
              {validation.field === "password" ? (
                <p
                  className="  text-red text-sm text-center font-semibold  "
                  onChange={onchange}
                >
                  {validation.message}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="w-[80%] h-[10%]  mt-0 space-y-3 ">
              <button
                className=" bg-orange w-[100%] h-[80%]  rounded-md text-2xl text-white "
                onClick={() => {
                  if(!preventClick){onClickToOtp();}
                  
                }}
              >
                SIGN UP
              </button>
              {/* <div className=" bg-black w-[100%] h-[80%] flex flex-row items-center rounded-md">
                <div className="w-[30%] h-[50%] ">
                  <FcGoogle className="mt-2 w-[100%]" />
                </div>
                <div className="w-[70%] h-[50%] ">
                  <p className="mt-1 text-white text-md tracking-widest">
                    SIGNUP WITH GOOGLE
                  </p>
                </div>
              </div> */}
              <p className="text-white text-center">
                if you already have an account ? SignIn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderSignupComponent;
