import { IoCarSportSharp } from "react-icons/io5";
import { RiMotorbikeFill } from "react-icons/ri";




function AddServiceFirstUi(){
 
    return(<>
         <div className="mb-11 h-[60px] ">
          <h1 className="text-center text-white text-2xl font-light tracking-widest">
            Select the Type of Services You Are Providing
          </h1>
        </div>
        <div className="w-[85%] h-[350px]  flex justify-evenly">
          <div className="w-[30%] h-[400px] bg-banner-gray animate-fadeInDownBig flex flex-col place-items-center rounded-md ">
            <div className="w-[50%] h-[100px]  mt-8 flex  rounded-sm place-content-center place-items-center  bg-black">
              <RiMotorbikeFill className="text-6xl text-gray-300" />
            </div>
            <div className="w-[90%] h-[120px] mt-6">
              <h1 className="text-center text-xl tracking-wider text-white ">
                Two Wheeler
              </h1>
              <p className="text-sm text-white font-light text-center">
                "Add services for two-wheelers: maintenance, repairs, and
                modifications offered."
              </p>
            </div>
            <div className="w-[90%] h-[40px]  mt-4 flex flex-col place-content-center place-items-center">
              <button className="bg-orange w-[70%] h-[50px] rounded-md text-lg text-white">
                ADD
              </button>
            </div>
          </div>
          <div className="w-[30%] h-[400px] bg-banner-gray animate-fadeInDownBig flex flex-col place-items-center rounded-md ">
            <div className="w-[50%] h-[100px]  mt-14 flex  rounded-sm place-content-center place-items-center  bg-black">
              <IoCarSportSharp className="text-6xl text-gray-300" />
            </div>
            <div className="w-[90%] h-[120px] mt-6">
              <h1 className="text-center text-xl tracking-wider text-white ">
                Four wheeler
              </h1>
              <p className="text-sm text-white font-light text-center">
                "List services for four-wheelers: maintenance, repairs, and
                upgrades provided."
              </p>
            </div>
            <div className="w-[90%] h-[40px]  mt-4 flex flex-col place-content-center place-items-center">
              <button className="bg-orange w-[70%] h-[50px] rounded-md text-lg text-white">
                ADD
              </button>
            </div>
          </div>
          
        </div>
    </>)
}


export default AddServiceFirstUi