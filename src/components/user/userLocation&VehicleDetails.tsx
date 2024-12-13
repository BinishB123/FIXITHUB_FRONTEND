import { MdLocationPin } from "react-icons/md";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl";
import { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import {  motion } from "framer-motion";
import car from "../../assets/sedan.png"
import bike from '../../assets/motorbike (1).png'
import { FaCaretLeft } from "react-icons/fa";
import { AiFillCaretRight } from "react-icons/ai";

import axios from "axios";
import {
  getsuggetionResponse,
  SuggestionItem,
} from "../../interfaces/location";
import getCurrentLocation from "../../services/common/provider";
import { Coordinates } from "../../interfaces/common";
import { axiosInstance } from "../../api/common";
import { services } from "../../api/user";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

function UserlocationAndvehicleDetails() {
  const imagearr = [bike,car]
  const [index,setIndex] = useState<0|1>(0)
  const [isModal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setaddress] = useState<string | null>(null);
  const [focus, setFocus] = useState<boolean>(false);
  const [fuelState, setFuelState] = useState<{
    petrol: boolean;
    diesel: boolean;
  }>({ petrol: false, diesel: false });
  const [vehicleType, setvehicleType] = useState<{
    two: boolean;
    four: boolean;
  }>({ two: false, four: false });
  const [vehicleDetail, setvehicleDetails] = useState<{
    vehicleID: string | null;
    vehicleBrand: string | null;
    vehicleModel: string | null;
    Currentkilometer: string | null;
  }>({
    vehicleID: null,
    vehicleBrand: null,
    vehicleModel: null,
    Currentkilometer: null,
  });
  const [brands, setBrands] = useState<{ _id: string; brand: string }[] | null>(
    null
  );
  const [dummybrands, setDummyBrands] = useState<
    { _id: string; brand: string }[] | null | []
  >([]);
  const [locationText, setLocationText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 76.04514984399833,
    latitude: 11.42847873755188,
    zoom: 5,
  });
  const [lat, setlat] = useState<number>(viewState.latitude);
  const [long, setlong] = useState<number>(viewState.longitude);
  useEffect(() => {
    if (!location.state) {
      navigate('/services')
    } else {
      setModal(true)
      axiosInstance.get(services.getallbrands).then((Response) => {
        const { brandData } = Response.data;
        setBrands(brandData ? brandData : null);
        setDummyBrands(brandData ? brandData : null);
      });
    }
  }, []);

  const onClickDone = () => {
    if (!vehicleType.four && !vehicleType.two) {
      return toast.warning("Please select a vehicle type.");
    }
    const type = vehicleType.four ? "fourWheeler" : "twoWheeler";


    const idRegex = /^[A-Z]{2}:\d{2}\s[A-Z]:\d{3,4}$/;
    if (!idRegex.test(vehicleDetail.vehicleID || "")) {
      return toast.warning(
        "Please provide a valid Vehicle ID in the format 'XX :00 X:000'."
      );
    }

    if (!vehicleDetail.vehicleBrand) {
      return toast.warning("Please enter your Vehicle Brand.");
    }

    const brand = brands?.find(
      (item) => item.brand.trim() === vehicleDetail.vehicleBrand?.trim()
    );
    
    if (!brand) {
      return toast.warning(
        "Unsupported brand. Please enter a brand supported by us."
      );
    }

    const kilometerRegex = /^[0-9]/;
    if (!kilometerRegex.test(vehicleDetail.Currentkilometer || "")) {
      return toast.error("Please enter the current vehicle kilometer reading.");
    }

    const modelRegex = /^[a-zA-Z]/;
    if (!modelRegex.test(vehicleDetail.vehicleModel || "")) {
      return toast.warning("Please enter your Vehicle Model.");
    }

    if (!fuelState.diesel && !fuelState.petrol) {
      return toast.warning("please Select Your Vehicle Fuel Type");
    }
    if (!address) {
      return toast.warning(
        "Please Provided Your Location To Get Near By Shops"
      );
    }

    navigate("/services/shoplist", {
      state: {
        vehicleType: type,
        long: long,
        lat: lat,
        seviceId: location.state.serviceId,
        category: location.state.category,
        addres: address,
        fuel: fuelState.diesel?"Diesel":"Petrol",
        brand: brand,
        model: vehicleDetail.vehicleModel,
        kilometer: vehicleDetail.Currentkilometer,
        vehcileNumber: vehicleDetail.vehicleID,
      },
    });
  };

  const onClickToGetLocationSuggetion = () => {
    
    axios
      .get(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${locationText}&language=en&proximity=-73.990593,40.740121&session_token=03f24df3-6b20-43e1-892c-d9101e9090d0&access_token=pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdnJrdnAweWR4MnZzYWU4NWNsbTl3In0.mG2tob0Pv0o7QkdpiLQ82w`
      )
      .then((response) => {
        const { suggestions }: getsuggetionResponse | any = response.data;
        setSuggestions(suggestions || []);
      });
  };
  const selectAddress = () => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${viewState.longitude},${viewState.latitude}.json?access_token=pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdnJrdnAweWR4MnZzYWU4NWNsbTl3In0.mG2tob0Pv0o7QkdpiLQ82w`
      )
      .then((response) => {
        const { features } = response.data;
        const geometry = features[0].geometry.coordinates;
        const address = features[0].place_name;

        setaddress(address);
        setlong(geometry[0]);
        setlat(geometry[1]);
      })
      .catch((error) => {
        console.error("Error fetching address:", error.message);
      });
  };

  const getClickedCoordinateOfsuggestion = (mapid: string) => {
    axios
      .get(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapid}?session_token=0773f8f7-f377-4251-892c-e0c9ab80c5df&access_token=pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdnJrdnAweWR4MnZzYWU4NWNsbTl3In0.mG2tob0Pv0o7QkdpiLQ82w`
      )
      .then((response) => {
        const { features } = response.data;
        const [{ geometry, properties }] = features;

        setaddress(properties.full_address);

        setViewState({
          longitude: geometry?.coordinates[0],
          latitude: geometry?.coordinates[1],
          zoom: 10,
        });
        setlong(geometry?.coordinates[0]);
        setlat(geometry?.coordinates[1]);
        setSuggestions([]);
        setLocationText("");
      });
  };

  const handleCurrentLocation = () => {
    const coordinates: Coordinates = {
      latitude: null,
      longitude: null,
    };
    getCurrentLocation()
      .then((result) => {
        coordinates.latitude = result.latitude;
        coordinates.longitude = result.longitude;
       
        if (coordinates.latitude && coordinates.longitude) {
          axios
            .get(
              `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${coordinates.longitude}&latitude=${coordinates.latitude}&access_token=pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdnJrdnAweWR4MnZzYWU4NWNsbTl3In0.mG2tob0Pv0o7QkdpiLQ82w`
            )
            .then((response) => {
              const geometry = response.data.features[0].geometry.coordinates;
              const address = response.data.features[0].properties;
              setlong(geometry[0]);
              setlat(geometry[1]);
              setViewState({
                longitude: result.longitude,
                latitude: result.latitude,
                zoom: 12.5,
              });
              setaddress(address.full_address);
              // setLocationConfirm(true);
            })
            .catch((error) => {
              console.error("Error fetching address:", error.message);
            });
        } else {
          console.error("Unable to get current location");
        }
      })
      .catch((error) => {
        console.error("Error getting current location:", error);
      });
  };
 
  return (
    <>
      <div className="w-[100%] h-auto flex flex-col place-items-center bg-black ">
        <div className="h-[1200px] md:h-[680px] w-[90%]  flex md:flex-row  flex-col-reverse">
          <div className="h-[680px] w-[100%] md:w-[50%]  flex flex-col items-center space-y-2 animate-fadeInDownBig">
            <div className="w-[90%] h-[40px] ">
              <div className="w-[100%] h-[50px] flex space-x-3 items-center justify-stretch">
                <MdLocationPin className="text-md md:text-2xl text-orange" />
                <h1 className="text-center text-white text-sm font-dm font-semibold">
                  {" "}
                  {address
                    ? address
                    : "Add your location to find nearby services"}
                </h1>
              </div>
            </div>
            <div className="w-[90%] h-[480px]  flex flex-col space-y-3">
              
              <div className="w-[100%] h-[260px] bg-gradient-to-b from-gray-950 ">
                <div className="w-[100%] h-[250px] bg-banner-gray flex flex-col items-center">
                  <h1 className="text-center text-white text-md">
                    Add vehicle Details
                  </h1>
                  <div className="w-[90%] h-[250px] flex justify-between">
                    <div className="w-[45%] h-[250px] ">
                      <div className="w-[100%] h-[100px]">
                        <p className="text-md text-white font-semibold">
                          vehicle ID
                        </p>
                        <input
                          placeholder="Eg:KL :00 h:000"
                          type="text"
                          className="text-white h-[30px] md:h-[40px] w-[100%] rounded-sm bg-gray-500"
                          onChange={(e) => {
                            setvehicleDetails((prev) => {
                              return { ...prev, vehicleID: e.target.value };
                            });
                          }}
                        />
                      </div>
                      <div className="w-[100%] h-[100px]">
                        <p className="text-md text-white font-semibold">
                          vehicle Model
                        </p>
                        <input
                          onChange={(e) => {
                            setvehicleDetails((prev) => {
                              return { ...prev, vehicleModel: e.target.value };
                            });
                          }}
                          type="text"
                          className="text-white h-[30px] md:h-[40px] w-[100%] rounded-sm bg-gray-500"
                          name=""
                          id=""
                        />
                      </div>
                    </div>
                    <div className="w-[45%] h-[250px]  ">
                      <div className="w-[100%] h-[100px] relative">
                        <p className="text-md text-white font-semibold">
                          vehicle Brand
                        </p>
                        <input
                          onFocus={() => {
                            setFocus(true);
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setDummyBrands(brands);
                              setFocus(false);
                            }, 500);
                          }}
                          value={
                            vehicleDetail.vehicleBrand
                              ? vehicleDetail.vehicleBrand
                              : ""
                          }
                          onChange={(e) => {
                            setvehicleDetails((prev) => ({
                              ...prev,
                              vehicleBrand: e.target.value,
                            }));
                            const arr =
                              brands?.filter((item) => {
                                if (
                                  item.brand
                                    .toLowerCase()
                                    .includes(
                                      vehicleDetail.vehicleBrand
                                        ? vehicleDetail.vehicleBrand
                                        : ""
                                    )
                                ) {
                                  return item;
                                }
                              }) || [];
                            setDummyBrands(arr);
                          }}
                          type="text"
                          className="h-[35px] md:h-[40px] w-[100%] rounded-sm bg-gray-500 text-white"
                          name=""
                          id=""
                        />
                        {focus && (
                          <div className="w-full bg-white shadow-md mt-1 rounded-sm max-h-[160px] overflow-y-auto space-y-1 scrollbar-hide">
                            {dummybrands && dummybrands.length > 0 ? (
                              dummybrands.map((item, index) => (
                                <div
                                  onFocus={() => setFocus(true)}
                                  key={index}
                                  className="p-2 cursor-pointer hover:bg-gray-200"
                                  onClick={() => {
                                    setvehicleDetails((prev) => ({
                                      ...prev,
                                      vehicleBrand: item.brand,
                                    }));
                                    setFocus(false);
                                  }}
                                >
                                  {item.brand}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 cursor-pointer text-red hover:bg-gray-200">
                                <h1 className="text-sm font-semibold">
                                  Not supporting this brand
                                </h1>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-[100%] h-[100px]">
                        <p className="text-md text-white font-semibold">
                          Current kilometer
                        </p>
                        <input
                          onChange={(e) => {
                            setvehicleDetails((prev) => {
                              return {
                                ...prev,
                                Currentkilometer: e.target.value,
                              };
                            });
                          }}
                          type="text"
                          className="h-[30px] md:h-[40px] w-[100%] rounded-sm bg-gray-500 text-white"
                          name=""
                          id=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[100%] h-[70px] bg-gradient-to-b from-gray-950   rounded-sm">
                <h1 className="text-sm md:text-lg text-white ml-4 ">Select Fuel Type</h1>
                <div className="flex w-[100%] space-x-7 mt-4 ml-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      value=""
                      name="fuel"
                      className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onClick={() =>
                        setFuelState({ petrol: true, diesel: false })
                      }
                    />
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Petrol
                    </label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      value=""
                      name="fuel"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onClick={() =>
                        setFuelState({ petrol: false, diesel: true })
                      }
                    />
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Diesel
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[90%] h-[50px]  flex justify-center">
              <button
                className="w-[50%] h-[40px] bg-orange  rounded-md text-white"
                onClick={onClickDone}
              >
                Done
              </button>
            </div>
          </div>
          <div className="h-[680px] w-[100%] md:w-[50%]  flex flex-col items-center animate-fadeInDownBig">
            <div className="w-[100%] h-[80px] ">
              <h1 className="text-center text-white text-sm md:text-xl font-dm font-semibold">
                ADD LOCATION
              </h1>
              <div className="w-[100%] h-[30px]  flex justify-center">
                <button
                  className="text-md text-sm md:text-md font-dm font-semibold tracking-wider text-white bg-orange w-[100%] md:w-[70%] rounded-full"
                  onClick={handleCurrentLocation}
                >
                  Click To Add the Current Location
                </button>
              </div>
            </div>
            <div className="relative w-[100%] h-[500px] rounded-md">
              {/* Search input positioned inside the map */}
              <div className="absolute top-4 left-4 z-10 w-[90%] md:w-[50%] p-2 h-[40px] bg-red-500 rounded-md flex items-center">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={locationText}
                  className="h-[40px] w-[80%]  rounded-l-md bg-white shadow-md pl-3 focus:outline-none "
                  onChange={(e) => {
                    setLocationText(e.target.value);
                  }}
                />
                <button
                  className=" flex items-center justify-center p-2 bg-white h-[40px] rounded-r-md"
                  onClick={() => {
                    if (locationText?.trim() != "") {
                      onClickToGetLocationSuggetion();
                    }
                  }}
                >
                  <CiSearch className="text-black text-2xl font-bold" />
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className=" ml-3 absolute top-16 left-4 z-10 w-[80%] max-w-[300px] h-[250px] bg-white space-y-1 border rounded-md shadow-md overflow-y-scroll scrollbar-hide ">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-400 text-sm cursor-pointer hover:bg-gray-100 animate-fadeInDownBig"
                      onClick={() => {
                        getClickedCoordinateOfsuggestion(item.mapbox_id);
                      }}
                    >
                      {item.name + " , " + item.place_formatted}
                    </div>
                  ))}
                </div>
              )}

              {/* Map component */}
              <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_ID}
                {...viewState}
                onMove={(e) => setViewState(e.viewState)}
                onClick={selectAddress}
                style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                attributionControl={false}
                mapStyle="mapbox://styles/mapbox/streets-v9"
              >
                <Marker longitude={long} latitude={lat} anchor="bottom">
                  <FaLocationDot className="text-4xl text-orange" />
                </Marker>
              </Map>
            </div>
          </div>
        </div>
      </div>
      {isModal && (
        <motion.div
          className="fixed inset-0 h-auto bg-black bg-opacity-70 flex items-center justify-center transition delay-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-banner-gray rounded-lg w-[65%] md:w-[40%] h-[300px] md:h-[500px] flex flex-col items-center  space-y-3">
            <div className="w-[100%] h-[10%] mt-0  flex ">
              <div className=" w-[90%] mt-4 space-y-2">
                <h1 className="text-white text-center md:text-xl font-semibold">
                  Select Vehicle Type
                </h1>
              </div>


            </div>

            <div className="w-[95%] h-[300px] flex justify-center space-x-2  scrollbar-hide">
              <div className="w-[20%] h-[300px]  flex items-center justify-center">
               { index!=0? <FaCaretLeft className="text-6xl text-orange cursor-pointer"  onClick={()=>setIndex(0)}/>:""

               }
              </div>
              <div className={`w-[60%] h-[300px] flex justify-center items-center ${index==1&&"animate-fadeInDownBig"} ${index==0&&"animate-fadeInUp"}`}>
                <img src={imagearr[index]} alt="" className="w-[50%] h-auto" />
              </div>

              <div className="w-[20%] h-[300px]  flex items-center justify-center">
               {index!=1? <AiFillCaretRight className="text-6xl text-orange cursor-pointer" onClick={()=>setIndex(1)} />:""}
              </div>

            </div>
            <div className="w-[95%] h-[60px] flex flex-col items-center justify-center space-y-2 ">
              <button className="w-[30%] h-[40px] rounded-md text-white animate-bounce bg-orange" onClick={() => {setvehicleType({ two: index===0, four: index===1 })
              setModal(false)
            }}>Select</button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default UserlocationAndvehicleDetails;
