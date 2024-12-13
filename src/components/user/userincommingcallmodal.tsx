import {  motion } from "framer-motion";
import img from "../../assets/workshops.png";
import { FaPhone } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
function UserInCommigCallModal(){
    return(<><motion.div
        className="fixed inset-0 h-[730px] bg-black bg-opacity-60 flex items-center justify-center transition delay-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-banner-gray rounded-md w-[65%] md:w-[30%] h-[300px] md:h-[400px] flex flex-col items-center  space-y-3">
        <div className=" w-[80px] h-[100px] md:w-[130px] md:h-[150px] mt-6  flex justify-center items-center rounded-full overflow-hidden">
              <img
                src={img}
                alt=""
                className="object-cover rounded-full w-full h-full"
              />
            </div>
            <div className="w-[60%] h-[100px]  space-y-2">
              <h5 className="text-center text-white font-dm text-md pt-1">
                jesson Ok
              </h5>
              <h5 className="text-center text-gray-400 animate-pulse flex justify-center gap-2 font-dm font-medium">
                Incoming audio call...
              </h5>
            </div>
            <div className="w-[100%] flex justify-center space-x-5 cursor-pointer">
             <div className="w-[12%] h-[40px]  md:h-[55px] rounded-full animate-fadeInDown bg-red flex justify-center items-center  ">
              <IoCloseSharp  className="text-white text-5xl" />
              </div>
              <div className="w-[12%] h-[40px]  md:h-[55px] rounded-full animate-fadeInDownBig bg-green-500 flex justify-center items-center  ">
              <FaPhone className="text-white  text-xl " />
              </div>
             
            </div>
         
        </div>
      </motion.div></>)
}

export default UserInCommigCallModal