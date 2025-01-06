import workshop from "../../assets/workshops.png";
import roadassimg from "../../assets/road assistance.png";
import { GiAutoRepair } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function Services() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-[100%] h-auto bg-black">
        <div className="w-[100%]  h-[750px] md:h-[750px] flex flex-col justify-center items-center">
          <div className="w-[95%] h-[650px] md:h-[600px]  bg-gradient-to-b from-gray-950 md:mt-6 animate-fadeInDownBig flex ">
            <div className="w-[50%] flex flex-col place-items-end place-content-center">
              <div className="w-[80%]">
                <h1 className="text-sm md:text-xl text-center text-white font-dm font-medium tracking">
                  "Choose the service you need – whether it's quick roadside
                  assistance or a full repair, we've got you covered!"
                </h1>
              </div>
            </div>
            <div className="w-[50%]  h-[400px] place-content-center ">
              <img
                src={workshop}
                alt=""
                className=" md:h-[400px] animate-fadeInDownBig "
              />
            </div>
          </div>
          <div className="w-[100%] h-[400px]  flex items-end justify-center">
            <div className="w-[95%] h-[300px] flex md:flex-row flex-col md:justify-center md:space-x-24">
              <div className=" md:w-[100%] h-[170px]">
                <div
                  className="md:mt-6   w-[100%] h-[170px]  flex animate-fadeInDownBig cursor-pointer"
                  onClick={() => {
                    navigate("/services/selectGeneralservice");
                  }}
                >
                  <div className=" w-[10%]   flex justify-center items-center">
                    <div className=" h-[100px] md:h-[120px] rounded-md place-content-center items-center flex">
                      <GiAutoRepair className="text-7xl text-center text-orange  " />
                    </div>
                  </div>
                  <div className="w-[70%] ">
                    <div className="w-[80%] h-[150px]  flex  place-items-center">
                      <h1 className="text-white text-sm md:text-md font-semibold">
                        "Find Nearby Services Tailored to Your Vehicle – Explore
                        Local Repair Centers and Service Providers for Cars and
                        Bikes with Ease!"
                      </h1>
                    </div>
                  </div>
                  <div className="w-[20%]  flex items-center ">
                    <button className="text-white text-sm bg-orange w-[100%] h-[50px] rounded-md hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 animate-bounce  flex pl-3 justify-center items-center text-md font-semibold ">
                      click to view the services{" "}
                      <FaArrowRight className="text-md text-white ml-2 mt-1" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:w-[40%] h-[300px] hidden ">
                <div
                  className="md:mt-6  w-[100%]  md:h-[170px] bg-gradient-to-b from-gray-950 flex animate-fadeInDownBig cursor-pointer"
                  onClick={() => {
                    navigate("/services/selectRoadAssistance");
                  }}
                >
                  <div className=" w-[40%]  flex justify-center items-center">
                    <div className="w-[80%] h-[80px] md:h-[120px] bg-orange rounded-md">
                      <img src={roadassimg} alt="" className="mt-3 " />
                    </div>
                  </div>
                  <div className="w-[80%] ">
                    <div className="w-[80%] h-[150px]  flex place-content-center place-items-center">
                      <h1 className="text-white text-sm md:text-md">
                        Roadside Assistance – Quick Help for Your Car or Bike,
                        Anytime, Anywhere
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
