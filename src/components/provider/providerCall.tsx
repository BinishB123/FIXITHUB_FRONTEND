import img from "../../assets/workshops.png";
import { BsFillMicMuteFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
import { AiFillAudio } from "react-icons/ai";

function ProviderCallComponent() {
  return (
    <>
      <div className="w-[100%] h-[742px] bg-black flex justify-center items-center">
        <div className=" w-[100%] md:w-[60%] h-full md:h-[520px] bg-banner-gray flex flex-col justify-between rounded-sm">
          <div className="w-[100%] h-[300px]  flex flex-col justify-center items-center mt-4">
            <div className="w-[130px] h-[150px]  flex justify-center items-center rounded-full overflow-hidden">
              <img
                src={img}
                alt=""
                className="object-cover rounded-full w-full h-full"
              />
            </div>
            <div className="w-[30%] h-[100px]  space-y-2">
              <h5 className="text-center text-white font-dm text-md pt-1">
                jesson Ok
              </h5>
              <h5 className="text-center text-gray-400 animate-pulse flex justify-center gap-2 font-dm font-semibold">
                Calling...
              </h5>
            </div>
          </div>
          <div className="w-[100%] h-[100px] flex justify-center items-center cursor-pointer">
            <div className=" w-[100%] md:w-[50%] h-[100px]   flex justify-center space-x-4">
              <div className="w-[20%] md:w-[10%] h-[50px] bg-gray-600 rounded-full flex justify-center items-center">
                <BsFillMicMuteFill className="text-xl" />
                <AiFillAudio className="text-2xl hidden" />
              </div>
              <div className="w-[20%] md:w-[10%] h-[50px] shadow-md hover:shadow-[0_10px_20px_rgba(255,_0,_0,_0.7)] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  bg-red rounded-full flex justify-center items-center animate-fadeInDownBig">
                {" "}
                <MdCallEnd className="text-2xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderCallComponent;
