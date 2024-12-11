import { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { axiosInstance } from "../../api/common";
import { services } from "../../api/user";
import { TbImageInPicture } from "react-icons/tb";
import { FaRegSadTear } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
function ShopList() {
  const location = useLocation();
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const [loading, setLoading] = useState(navigationType==="POP"?false:true);
  const [shops, setshops] = useState<
    | { _id: string; workshopName: string; distance: number; logoUrl: null }[]
    | null
  >(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/services')
    } else {
     
      localStorage.removeItem("servicesSelected")
      axiosInstance
        .get(
          services.getShops +
          `?long=${location.state.long}&lat=${location.state.lat}&vehicleType=${location.state.vehicleType}&serviceId=${location.state.seviceId}&category=${location.state.category}&brand=${location.state.brand._id}`
        )
        .then((response) => {
          const { shops } = response.data;
          console.log(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 1500)
          setshops(shops);
        });
    }
  }, []);
  if (loading) {
    return <div className="w-[100%] h-[700px]  flex flex-col justify-center items-center">
      <AiOutlineLoading3Quarters className="text-4xl text-orange animate-spinslow" />
      <p className="text-sm font-semibold text-orange animate-pulse">Please wait a moment while we locate the best shops around you!</p>
    </div>;
  }

  return (
    <>
      <div className="w-[100%] h-auto  flex flex-col items-center bg-black">
        <div className="h-[700px]  w-[95%] flex flex-col items-center justify-center space-y-2">
          <div className="h-[80px] md:w-[50%] flex flex-col space-y-2 items-center   text-center font-dm font-semibold text-xl text-white  tracking-wider  rounded-md " >
            {shops && shops.length > 0 ? (
              <h1 className="text-sm md:text-md tracking-tight ">  Here are some shops close to you that match your service needs!</h1>
            ) : (
              <h1 className=" text-sm md:text-lg font-semibold text-gray-300 tracking-wider">
                No nearby shops found for your selected service or vehicle Type <FaRegSadTear className="inline-block text-4xl text-orange" /> .
                Try exploring other options or expanding your search area.
              </h1>
            )}
             {/* <input type="text" placeholder="Search Shop" 
            //  value={!searchwords?"":searchwords} onChange={(e)=>{
            //     setSearchWords(e.target.value)
            //     onClickSearch()
            // }}
             className="text-center text-sm rounded-md w-[60%] h-[40px] bg-banner-gray text-white" /> */}
          </div>
          <div
            className={`h-[600px] w-[95%] space-y-2 flex overflow-y-scroll scrollbar-hide space-x-3 flex-wrap justify-center `}
          >
            {shops?.map((item, index) => (
              <div
                key={index}
                className={` md:w-[20%] h-[250px]   ${index === 0 && "mt-2 ml-2"
                  } flex flex-col items-center  border-orange-500  animate-fadeInDownBig cursor-pointer `}
                onClick={() => {
                  navigate('/services/shopProfile', { state: { data: location.state, providerId: item._id } })
                }}
              >

                <div
                  className="relative w-full h-[250px] bg-cover bg-center  rounded-lg shadow-lg overflow-hidden  bg-white "
                  style={{ backgroundImage: `url(${item.logoUrl ? item.logoUrl : TbImageInPicture})` }}
                >

                  <div className="absolute inset-0 bg-gradient-to-t from-black   bg-opacity-70"></div>


                  <div className="relative z-10 flex flex-col justify-center items-center h-full text-center space-y-2 px-4">
                    <h1 className="text-lg font-bold text-white drop-shadow-lg">
                      {item.workshopName}
                    </h1>
                    <p className="text-white text-sm drop-shadow-md font-semibold">
                      {(item.distance / 1000).toFixed(2)} km away
                    </p>
                  </div>

                  {/* Button Container */}
                  <div className="absolute bottom-0 left-0 w-full bg-orange py-2 flex justify-center">
                    <button className="text-white font-semibold" onClick={() => {
                      console.log("okk");

                      navigate('services/shopProfile', { state: location.state })
                    }}>
                      View to Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShopList;
