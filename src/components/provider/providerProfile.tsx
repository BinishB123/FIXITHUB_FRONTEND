import { createContext,  useEffect,  useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { IproviderReponseData } from "../../interfaces/provider";
import { ProfileContext } from "../../interfaces/providerProfileContext";
import { axiosInstance } from "../../api/common";
import { providerProfile } from "../../api/provider";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";

export const profileContext = createContext<ProfileContext|undefined>(undefined)

function ProviderProfile() {
  const location = useLocation()
  const [editaboutSt, seteditAbout] = useState<string | null>(null);
  const [profile, setProfile] = useState<IproviderReponseData | null>(null);
  const { providerInfo } = useSelector((state: RootState) => state.provider);
  const params = useParams()
  const navigate = useNavigate();
  useEffect(() => {
    axiosInstance
      .get(providerProfile.getproviderProfileData + `?id=${providerInfo?.id}`)
      .then((response) => {
        const { providerData } = response.data;
        setProfile(providerData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
 
  
  return (
   <profileContext.Provider value={{editaboutSt,seteditAbout,profile,setProfile}}>
     <>
      <div className="w-[100%] md:w-[80%] h-auto  flex flex-col items-center animate-fadeInDownBig">
     
        <div className={`w-[95%] h-[50px] bg-banner-gray rounded-md flex justify-evenly  ${location.pathname===`/provider/profile/chat/${params.chatid}`&& "hidden"}`}>
          <div className="w-[12%] h-[60px] place-content-center text-blue-100 cursor-pointer ">
            <h1
              className={`hover:text-orange text-sm font-dm font-medium tracking-wider ${
                 location.pathname==='/provider/profile' && "text-orange"
              }`}
              onClick={() => {
               
                navigate("/provider/profile");
              }}
            >
              OverView
            </h1>
          </div>
          <div className="w-[12%] h-[60px] place-content-center text-blue-100 cursor-pointer ">
            <h1
              className={`hover:text-orange text-sm font-dm font-medium tracking-wider ${
                 location.pathname==="/provider/profile/accountsettings" && "text-orange"
              }`}
              onClick={() => {
               
                navigate("/provider/profile/accountsettings");
              }}
            >
              Account Settings
            </h1>
          </div>
          <div className={`w-[12%] ${location.pathname!=="/provider/profile/chat"&& "hidden"} h-[60px] place-content-center text-blue-100 cursor-pointer`}>
            <h1
              className={`hover:text-orange text-sm font-dm font-medium tracking-wider ${
                 location.pathname==="/provider/profile/chat" ? "text-orange":"text-white"
              }`}
              onClick={() => {
               
                navigate('/provider/profile/chat')
              }}
            
            >
              Chat
            </h1>
          </div>
          {/* <div className="w-[12%] h-[60px] text-sm text-blue-100 place-content-center cursor-pointer ">
            <h1
              className={`hover:text-orange text-md font-dm font-medium tracking-wid`}
              onClick={() => {
               
              }}
            >
              FeedBacks
            </h1>
          </div> */}
        </div>
        <Outlet />
      </div>
    </>
   </profileContext.Provider>
  );
}

export default ProviderProfile;
