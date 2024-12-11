import { RiLoginCircleFill } from "react-icons/ri";
import provideradaddres from '../../assets/provideraaddadress.png'
import { GiAutoRepair } from 'react-icons/gi';
import { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import Map from 'react-map-gl';
import { MdOutlineMyLocation } from "react-icons/md";
import getCurrentLocation from "../../services/common/provider";
import { Coordinates } from "../../interfaces/common";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'sonner'
 import 'mapbox-gl/dist/mapbox-gl.css';
import { ProviderModel } from "../../interfaces/provider";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store/store";
import { providerRegisterThunk } from "../../Redux/thunk/provider";
import { useSelector } from "react-redux";
import { resetError, resetSuccess } from "../../Redux/slice/providerSlice";



type ViewState = {
    longitude: number;
    latitude: number;
    zoom: number;
};

function ProvideAddAddressPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { formdata } = location.state || null
    const { error, errorMessage, success, message } = useSelector((state: RootState) => state.provider)
    const [name, setName] = useState<string>("")
    const [locationConfirm, setLocationConfirm] = useState<boolean>(false)
    const [addressState, setAddress] = useState<string>('')
    const [viewState, setViewState] = useState<ViewState>({
        longitude: 76.04514984399833,
        latitude: 11.42847873755188,
        zoom: 5
    })

    const [lat, setlat] = useState<number>(viewState.latitude)//for passing map when user selected take loaction when clicking new lat will add
    const [long, setlong] = useState<number>(viewState.longitude)//for passing map when user selected take loaction when clicking new long will add
    const OnClickCancel = () => {
        setLocationConfirm(false)
        setViewState({
            longitude: 76.04514984399833,
            latitude: 11.42847873755188,
            zoom: 5
        })

    }

    useEffect(() => {
        if (error && errorMessage) {
            toast.error(errorMessage)
            dispatch(resetError())
            navigate('/provider/signup',{replace:true})
            
        }
        if (success&&message) {
            toast.success(message,{duration:10000})
            dispatch(resetSuccess())
            navigate('/provider/signin',{replace:true})
        }

    }, [error, errorMessage, success, message])



    const handleCurrentLocation = () => {
        const coordinates: Coordinates = {
            latitude: null,
            longitude: null
        };
        getCurrentLocation().then((result) => {
            coordinates.latitude = result.latitude;
            coordinates.longitude = result.longitude;
            if (coordinates.latitude && coordinates.longitude) {
                axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${coordinates.longitude}&latitude=${coordinates.latitude}&access_token=pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdnJrdnAweWR4MnZzYWU4NWNsbTl3In0.mG2tob0Pv0o7QkdpiLQ82w`)
                    .then((response) => {
                        const geometry = response.data.features[0].geometry.coordinates;
                        const address = response.data.features[0].properties;
                        setlong(geometry[0])
                        setlat(geometry[1])
                        setViewState({ longitude: result.longitude, latitude: result.latitude, zoom: 12.5 })
                        setAddress(address.full_address)
                        setLocationConfirm(true);
                    })
                    .catch((error) => {
                        console.error('Error fetching address:', error.message);
                    });
            } else {
                console.error('Unable to get current location');
            }
        }).catch((error) => {
            console.error('Error getting current location:', error);
        });
    };

    const selectAddress = () => {
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${viewState.longitude},${viewState.latitude}.json?access_token=pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdnJrdnAweWR4MnZzYWU4NWNsbTl3In0.mG2tob0Pv0o7QkdpiLQ82w`)
            .then((response) => {
                const { features } = response.data
                const geometry = features[0].geometry.coordinates;
                const address = features[0].place_name


                setlong(geometry[0])
                setlat(geometry[1])
                setAddress(address)
                setLocationConfirm(true);
            })
            .catch((error) => {
                console.error('Error fetching address:', error.message);
            });



    }

    const register = () => {


        const isValidName: boolean = /^[A-Za-z]+$/.test(name.split(" ").join(""));
      
        if (!isValidName || name.trim() === '') {
            toast.error("Enter your WorkShop Name")
            return
        }

        const registerData: ProviderModel = {
            workshopName: name,
            ownerName: formdata.name,
            mobile: formdata.mobile,
            email: formdata.email,
            password: formdata.password,
            workshopDetails: {
                address: addressState,
                coordinates: {
                    lat: lat,
                    long: long
                }
            }
        }

        dispatch(providerRegisterThunk({ registerData }))


    }

    return (
        <div className="w-[100%] h-[100vh] bg-black flex flex-col  ">
            <div className='h-[10%] w-[100%]  flex flex-row  justify-between'>
                <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
                <GiAutoRepair className="text-3xl text-center text-orange " /><h1 className='font-dm font-bold text-white text-2xl'>FIXITHUB</h1>
                </div>
                <div className='h-[50%] w-[15%]  flex mt-6  space-x-3' onClick={() => {

                }}>
                    <h1 className='text-md font-dm text-white mt-2 cursor-pointer' >LOGIN </h1><RiLoginCircleFill className=' w-[20%] h-[100%] text-white cursor-pointer' />
                </div>

            </div>
            <div className="h-[90%] w-[100%] flex flex-col md:flex-row">
                <div className=" w-[100%] h-[30%]  md:w-[50%] md:h-[100%] flex flex-row md:flex-col justify-center place-items-center ">
                    <div className=" w-[50%] h-[70%] md:w-[70%] md:h-[40%] flex place-content-center">
                        <img src={provideradaddres} className="w-[50%] h-[100%] animate-fadeInDown  " alt="" />
                    </div>
                    <div className="  w-[50%] h-[100%]     md:w-[70%] md:h-[40%] flex place-content-center">
                        <h1 className="text-center mt-20 font-dm text-lg md:text-4xl text-white  font-semibold animate-fadeInUp">"Register Your Workshop and Expand Your Reach with Premium Auto Services!"</h1>
                    </div>
                </div>
                <div className=" w-[100%] h-[70%]  md:w-[50%]  md:h-[100%] flex place-items-center justify-center">
                    <div className="bg-gradient-to-b from-gray-950 h-[90%] w-[80%] rounded-md flex flex-col items-center animate-fadeInDownBig">
                        <div className="w-[100%] h-[10%] flex justify-center">
                            <h1 className="text-center text-white mt-5">WORKSHOP DETAILS</h1>

                        </div>
                        <div className="w-[100%] h-[10%]  flex justify-center">
                            <input className="bg-slate-600 h-[80%] rounded-md w-[60%] text-black text-center" placeholder="NAME OF YOUR WORKSHOP" value={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                        {
                            !locationConfirm ? <div className=" w-[60%] h-[6%] bg-orange rounded-md flex justify-center items-center space-x-2 mt-1 mb-2 ml-1 cursor-pointer"
                                onClick={handleCurrentLocation}
                            >
                                <p className="text-white text-sm">click to Add the location</p>
                                <MdOutlineMyLocation className="text-lg mt-0 text-white" />
                            </div> :
                                // -----------------------------------else--------------------
                                <p className="text-sm font-bold text-gray-100 my-4">YOUR WORKSHOP LOCATION</p>
                        }
                        {!locationConfirm && <p className="text-sm font-bold text-gray-400 my-4">select your workshop location Map</p>}
                        {
                            !locationConfirm ? <div className="w-[90%] h-[60%] bg-green-600 rounded-md overflow-hidden">
                                <Map
                                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_ID}
                                    {...viewState}
                                    onMove={(e) => {
                                        setViewState(e.viewState)
                                        setlong(viewState.longitude)
                                        setlat(viewState.latitude)
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                    attributionControl={false}
                                    onClick={selectAddress}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"

                                >
                                    <Marker longitude={long} latitude={lat} anchor="bottom" >
                                        <FaLocationDot className="text-4xl text-orange" />
                                    </Marker>
                                </Map>



                            </div>
                                :
                                //--------------------------------------else-------------->//////
                                <div className="w-[90%]  h-[40%] overflow-hidden bg-green-600 rounded-md relative  ">
                                    <Map
                                        mapboxAccessToken="pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdzE1OHcwcGdqMnJxbDUxdDN5cnExIn0.TYM92lLjTLoETRIJEiJWPw"
                                        {...viewState}
                                        onMove={(e) => setViewState(e.viewState)}
                                        style={{ width: '100%', height: '100%' }}
                                        attributionControl={false}

                                        mapStyle="mapbox://styles/mapbox/streets-v9"

                                    >
                                        <Marker longitude={long} latitude={lat} anchor="bottom" >
                                            <FaLocationDot className="text-4xl text-orange" />
                                        </Marker>
                                    </Map>
                                    <div className="absolute w-[40%] h-[12%] bg-orange rounded-md flex justify-center items-center space-x-2 mt-4 ml-4 cursor-pointer" >
                                        <p className="text-white text-sm">your workshop location</p>
                                    </div>
                                </div>
                        }
                        {
                            locationConfirm ? <div className="w-[100%] h-[18%]  mt-3 flex place-content-center">
                                <div className="w-[90%] h-[100%]  flex flex-col">
                                    <div className="w-[70%] h-[100%] flex ml-4 space-x-6">
                                        <h2 className="font-dm text-lg mt-1 font-bold text-white ">Location: </h2>
                                        <h3 className="mt-1 text-white text-sm md:text-md font-semibold">{addressState ? addressState : "no addres found"}</h3>

                                    </div>



                                </div>

                            </div> : null
                        }
                        {!locationConfirm ?
                            null
                            :
                            <div className="w-[100%] h-[12%] mt-10 flex place-content-center">
                                <div className="w-[60%] h-[100%] flex justify-between place-items-center">
                                    <button className="w-[30%] h-[50%] bg-orange rounded-md text-center text-white" onClick={register}>Done</button>
                                    <button className="w-[30%] h-[50%] bg-red rounded-md text-white" onClick={OnClickCancel}>Cancel</button>

                                </div>
                            </div>
                        }

                    </div>


                </div>
            </div>

        </div>
    )

}


export default ProvideAddAddressPage