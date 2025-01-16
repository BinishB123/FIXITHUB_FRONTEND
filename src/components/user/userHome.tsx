import homeBanner from "../../assets/homepagebanner.png";
import secondbanner from "../../assets/secondbannerofhomepage.png";
import bikerepairimg from "../../assets/bikerepair.png";
import calendersetting from "../../assets/calendarsetting.png";
import tyre from "../../assets/tyre.png";
import tow from "../../assets/tow.png";
// import user from "../../assets/userico.png";
import { IoLocation } from "react-icons/io5";
import { IoCarSportSharp } from "react-icons/io5";
import { FaRunning } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import lastcarbanner from "../../assets/homelastbanner.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import {  axiosInstance } from "../../api/common";

function UserHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [brands, setBrands] = useState<{brand:string}[]|[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  const navigate = useNavigate();
  const handleScroll = () => {
    const scrollY = window.scrollY;

    setIsScrolled(scrollY > 100);
  };

  useEffect(() => {
     
    axiosInstance.get('/api/user/auth/getBrands').then((response)=>{
      setBrands(response.data.brands)
      
    })

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="h-auto  flex flex-col md:flex-row justify-center md:h-[70%] w-[100%] ml-5 md:ml-0">
        <div className="h-[300px] md:h-[600px] w-[95%] bg-gradient-to-b from-gray-950 rounded-md flex flex-col-reverse md:flex-col relative animate-fadeInDownBig">
          <div className="h-[20%]   w-[100%] flex flex-col items-center md:mt-[5rem] md:z-20 animate-flipInX">
            <h1 className="font-dm font-md font-semibold  text-white text-sm md:text-2xl">
              {" "}
              On-Spot and worshop booking
            </h1>
            <h1 className="font-dm font-md font-semibold  text-white text-sm md:text-4xl">
              {" "}
              Bike & Car Repair Service
            </h1>
            <h4 className="font-dm font-md font-semibold   text-sm text-gray-500">
              Anytime & Anywhere in
            </h4>
          </div>
          <div className=" md:h-[10%] h-[15%]   w-[100%] flex justify-center z-20">
            <button
              className="w-[40%] md:w-[10%]  md:h-[80%] bg-orange rounded-2xl md:text-sm font-semibold text-white hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 animate-bounce"
              onClick={() => {
                if (userInfo?.id) {
                  navigate("/services");
                  console.log("okk");
                } else {
                  navigate("/login");
                }
              }}
            >
              BOOK SERVICE
            </button>
          </div>
          <div className="h-[100%] w-[100%] overflow-hidden absolute md:-top-10">
            <img
              src={homeBanner}
              alt=""
              className="w-[160%] md:w-full animate-pulse  "
            />
          </div>
        </div>
      </div>
      <div className="w-[100%] mt-14 bg-black h-[5300px] md:h-[2800px] flex flex-col items-center">
        <div className="w-[95%] h-[70px] md:h-[90px] overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Duplicating the cards for continuous looping */}
            {brands&&brands.map((data, index) => (
                <div
                  key={index}
                  className="min-w-[300px] bg-banner-gray h-[90px] flex flex-col place-content-center mx-2"
                >
                  <h1 className="text-white text-center text-xl md:text-2xl font-dm font-semibold">
                    {data.brand}
                  </h1>
                </div>
              ))}
          </div>
        </div>

        <div className="w-[95%] h-[800px]  md:h-[750px] mt-10  bg-banner-gray rounded-md flex flex-col md:space-y-0 space-y-20 md:flex-row">
          <div className="w-[100%] md:w-[50%] h-[200px] flex flex-col">
            <div className="md:w-[70%] h-[100px]  md:h-[400px] mt-3 md:ml-28 ">
              <h1
                className={`text-orange text-center md:text-start text-md md:text-6xl font-dm mt-4 font-semibold ${
                  isScrolled ? "animate-flipInX" : ""
                } `}
              >
                Wide Range of Workshops for All Your Vehicle Needs
              </h1>
            </div>
            <div className="md:w-[70%] w-[90%] h-[100px] md:h-[400px] md:mt-3 md:ml-28 ml-5">
              <p
                className={`text-white text-sm md:text-lg text-start ${
                  isScrolled ? "animate-fadeInDownBig" : ""
                } `}
              >
                Our platform connects you with a wide variety of workshops,
                ensuring that no matter your vehicle’s needs, you’ll find the
                right service quickly and easily. From routine maintenance like
                oil changes and tyre repairs to specialized services like
                dashcam installation and vehicle upgrades, our network of
                registered workshops offers everything under one roof. Each
                workshop is carefully vetted to guarantee quality and
                reliability, so you can book with confidence. Whether you need
                urgent assistance or are planning regular upkeep, our platform
                provides a seamless experience, making it the ultimate solution
                for all your automotive needs.
              </p>
            </div>
          </div>
          <div className="w-[100%] h-[200px]  md:w-[50%] md:h-[750px] flex flex-col items-center">
            <img
              src={secondbanner}
              className={`mt-24 ${isScrolled ? "animate-flipInX" : ""}`}
            ></img>
          </div>
        </div>
        <div
          className={`${
            isScrolled ? "animate-fadeInDownBig" : ""
          } w-[95%] h-[700px] md:h-[500px] mt-20  bg-orange rounded-sm flex flex-col place-items-center`}
        >
          <div className="w-[100%] h-[100px]  flex flex-col place-items-center space-y-4 mt-6">
            <h1 className="text-white text-md md:text-4xl font-semibold">
              Find the Right Workshop for Your Needs
            </h1>
            <h1 className="text-sm md:text-2xl text-white font-medium">
              "Explore a Variety of Specialized Workshops – Routine Maintenance,
              Tire Services, Repairs, and More!"
            </h1>
          </div>
          <div className="h-[250px] mt-12  w-[90%] flex flex-row justify-between">
            <div className="w-[15%] h-[250px] ">
              <div className="h-[150px] w-[100%] place-items-center">
                <img src={bikerepairimg} alt="" className="ml-4  " />
                <p className="mt-2 text-sm font-dm font-bold text-white">
                  Specialty Workshops "Advanced services tailored to specific
                  vehicle needs and performance upgrades."
                </p>
              </div>
            </div>
            <div className="w-[15%] h-[250px] ">
              <div className="h-[150px] w-[100%] place-items-center">
                <img src={calendersetting} alt="" className="ml-4 " />
                <p className="mt-2 text-sm font-dm font-bold text-white animate-pulse">
                  Routine Maintenance Workshops "Keep your vehicle in top
                  condition with regular check-ups and essential services.""
                </p>
              </div>
            </div>
            <div className="w-[15%] h-[250px] ">
              <div className="h-[150px] w-[100%] place-items-center">
                <img
                  src={tyre}
                  alt=""
                  className="ml-4 overflow-hidden  h-[100px]"
                />
                <p className="mt-2 text-sm font-dm font-bold text-white animate-pulse">
                  "Explore a Variety of Specialized WorkshTire Specialists
                  "Expert care for your tires – from installation to repair."ops
                  – Routine Maintenance, Tire Services, Repairs, and More!"
                </p>
              </div>
            </div>
            <div className="w-[15%] h-[250px] ">
              <div className="h-[150px] w-[100%] place-items-center">
                <img src={tow} alt="" className="ml-4  " />
                <p className="mt-2 text-sm font-dm font-bold text-white animate-pulse">
                  Mobile & Roadside Assistance "Convenient services brought to
                  your location – anytime, anywhere."
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="h-[1200px] md:h-[450px] w-[100%] mt-20 flex flex-col place-items-center">
          <div className="h-[50px] w-[30%] ">
            <h1 className="text-center text-white text-4xl font-dm">
              Testimonials
            </h1>
          </div>
            
        </div> */}
        {/* users ,pincodes tec... section */}
        <div className="w-[100%] h-[200px] mt-20  flex place-content-center">
          <div className="w-[90%] h-[200px]  flex  flex-row justify-between">
            <div className="w-[20%] h-[100px] bg-orange flex flex-col items-center md:flex-row  md:place-content-center mt-6 rounded-lg ">
              <IoLocation className="text-sm md:text-6xl ml-2 mt-6" />
              <h1 className="md:mt-10 text-sm md:text-xl font-dm md:font-semibold">
                1000+ pincodes
              </h1>
            </div>
            <div className="w-[20%] h-[100px] bg-orange flex flex-col items-center md:flex-row  md:place-content-center mt-6 rounded-lg ">
              <IoCarSportSharp className="text-sm md:text-6xl ml-2 mt-6" />
              <h1 className="md:mt-10 text-sm md:text-xl font-dm md:font-semibold">
                1000+ vehicles served
              </h1>
            </div>
            <div className="w-[20%] h-[100px] bg-orange flex flex-col items-center md:flex-row  md:place-content-center mt-6 rounded-lg ">
              <FaRunning className="text-sm md:text-6xl ml-2 mt-6" />
              <h1 className="md:mt-10 text-sm md:text-xl font-dm md:font-semibold">
                1000+ providers
              </h1>
            </div>
            <div className="w-[20%] h-[100px] bg-orange flex flex-col items-center md:flex-row  md:place-content-center mt-6 rounded-lg ">
              <FaUsersLine className="text-sm md:text-6xl ml-2 mt-6" />
              <h1 className="md:mt-10 text-sm md:text-xl font-dm md:font-semibold">
                1000+ users
              </h1>
            </div>
          </div>
        </div>
        {/*end users ,pincodes tec... section */}
        <div className="w-[100%] h-[400px]  mt-5 flex place-content-center rounded-sm">
          <div className="w-[100%] md:w-[70%] h-[400px] bg-banner-gray flex  md:flex-row">
            <div className="w-[50%] h-[400px] md:ml-20 mt-9">
              <img
                src={lastcarbanner}
                className="w-[90%] md:w-[50%] h-[300px]"
              />
            </div>
            <div className="w-[50%] h-[400px]  flex flex-col place-content-center items-center space-y-6">
              <h1 className="w-[100%] md:text-xl text-white font-dm font-semibold tracking-widest ">
                "Explore a Variety of Specialized Workshops – Routine
                Maintenance, Tire Services, Repairs, and More!"
              </h1>
              <button className="bg-orange text-white md:w-[40%] h-[50px] rounded-md hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 animate-bounce ">
                BOOK A SERVICE
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHome;
