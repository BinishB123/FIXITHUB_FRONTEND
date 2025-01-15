import { useDispatch } from "react-redux";
// import appLogo from "../../../assets/Rectangle 168.png";
import { GiAutoRepair } from "react-icons/gi";
import { AppDispatch, RootState } from "../../../Redux/store/store";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { logoutthunk, urgentreset } from "../../../Redux/slice/userSlice";
import { toast } from "sonner";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useSocket } from "../../../context/socketioContext";

function Header() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {socket} = useSocket()
  const [mobileMenuOpen, setMobileMenu] = useState<boolean>(false);
  // const loaction = useLocation()

  const handleLogoutOnClick = () => {
   
    dispatch(logoutthunk()).then(() => {
     
      toast("Logout successful");
      dispatch(urgentreset());
      socket?.emit("disconnect")
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenuOpen);
  };

  return (
    <header className="h-[10%] w-full flex justify-between items-center px-4 py-2 ">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
                            

        {/* <img src={appLogo} alt="App Logo" className=" md:h-12 h-6 w-6 md:w-12" /> */}
        <GiAutoRepair className="text-3xl text-center text-orange " /> 
        <h1 className="font-dm font-bold text-white text-sm md:text-xl hover:text-orange-500">
          FIXITHUB
        </h1>
      </div>

      <div className="hidden md:flex space-x-8 ">
        <nav className="flex items-center space-x-6 cursor-pointer">
          <h1
            className={`font-dm font-semibold text-sm  hover:scale-105 ${location.pathname==='/'?"text-orange transition" : "text-white"}`}
            onClick={() => navigate("/")}
          >
            HOME
          </h1>
          <h1
            className={`font-dm font-semibold text-sm  hover:scale-105 ${location.pathname==='/services'?"text-orange transition" : "text-white"}`}
            onClick={() => navigate("/services")}
          >
            SERVICES
          </h1>
          <h1
            className={`font-dm font-semibold text-sm  hover:scale-105 ${location.pathname==='/profile'?"text-orange transition" : "text-white"}`}
            onClick={() => navigate("/profile")}
          >
            PROFILE
          </h1>
          <h1
            className="font-dm font-semibold text-sm text-white hover:scale-105 hover:text-orange transition"
            onClick={() => navigate("/provider/signin")}
          >
            ADD WORKSHOP
          </h1>
        </nav>
      </div>

     
      <div className="flex items-center space-x-4">
        {userInfo?.id ? (
          <h1
            className="hidden md:block font-dm font-semibold text-md text-white cursor-pointer hover:text-orange"
            onClick={handleLogoutOnClick}
          >
            LOGOUT
          </h1>
        ) : (
          <h1
            className="hidden md:block font-dm font-semibold text-md text-white cursor-pointer hover:text-orange"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </h1>
        )}

       
       {
        !mobileMenuOpen? <IoReorderThreeOutline
        className="md:hidden text-white text-xl cursor-pointer"
        onClick={toggleMobileMenu}
      />:<RxCross1 className="md:hidden  text-white text-xl cursor-pointer"
      onClick={toggleMobileMenu} />
       }
      </div>

    
      {mobileMenuOpen && (
        <div className={` ${mobileMenuOpen&&"animate-fadeInDownBig"} mt-1 absolute top-[10%] left-0 w-full  bg-black shadow-lg z-10`}>
          <nav className="flex flex-col ml-3 space-y-6 py-6">
            <h1
              className="font-dm font-semibold text-sm text-white  hover:text-orange transition"
              onClick={() => {
                toggleMobileMenu();
                navigate("/");
              }}
            >
              HOME
            </h1>
            <h1
              className="font-dm font-semibold text-sm text-white hover:text-orange transition"
              onClick={() => {
                toggleMobileMenu();
                navigate("/services");
              }}
            >
              SERVICES
            </h1>
            <h1
              className="font-dm font-semibold text-sm text-white hover:text-orange transition"
              onClick={() => {
                toggleMobileMenu();
                navigate("/profile");
              }}
            >
              PROFILE
            </h1>
            <h1
              
              className="font-dm font-semibold   text-sm text-white hover:text-orange transition"
              onClick={() => {
                toggleMobileMenu();
                navigate("/provider/signin");
              }}
            >
              ADD WORKSHOP
            </h1>
            {userInfo?.id ? (
              <h1
                className="font-dm font-semibold text-sm text-white hover:text-orange transition"
                onClick={() => {
                  toggleMobileMenu();
                  handleLogoutOnClick();
                }}
              >
                LOGOUT
              </h1>
            ) : (
              <h1
                className="font-dm font-semibold text-sm text-white hover:text-orange transition"
                onClick={() => {
                  toggleMobileMenu();
                  navigate("/login");
                }}
              >
                LOGIN
              </h1>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
