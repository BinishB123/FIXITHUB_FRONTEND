import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { FaSquarePhone } from "react-icons/fa6";
import { TbPasswordUser } from "react-icons/tb";
import { profileContext } from "../providerProfile";
import { axiosInstance } from "../../../api/common";
import { providerProfile } from "../../../api/provider";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AccountSettings() {
  const imageInputref = useRef<HTMLInputElement | null>(null);
  // const [file, setFile] = useState<null | Blob>(null);

  const [editSelector, setEditSelector] = useState<{
    ownerName: boolean;
    passowrd: boolean;
    workshopname: boolean;
    mobile: boolean;
  }>({ ownerName: false, passowrd: false, workshopname: false, mobile: false });

  const navigate = useNavigate();
  const [workshopname, setworkshopName] = useState<string | null>(null);

  const [newPhone, setNewPhone] = useState<string | null>(null);
  const [newOwnerName, setNewOwnerName] = useState<string | null>(null);
  const [password, setPassoword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{
    old: boolean;
    new: boolean;
  }>({ old: false, new: false });
  const [newPassword, setNewPassoword] = useState<string | null>(null);

  const profile = useContext(profileContext);

  const changeLogo = (selectedFile: File) => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    if (!profile?.profile?._id) {
      console.log("No provider ID found");
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("id", profile.profile._id);
    formData.append("url", profile.profile.logoUrl);

    console.log("Selected file:", selectedFile);

    axiosInstance
      .patch(providerProfile.changelogo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        profile?.setProfile((prev: any) => {
          if (!prev) return null;

          return {
            ...prev,
            logoUrl: response.data.url,
          };
        });
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log("confritm");

          const statusCode = error.response?.status;
          console.log("Status Code:", statusCode);

          if (statusCode === 403) {
            localStorage.removeItem("provider");
            navigate("/provider/signin", { replace: true });
            toast.error(
              "Your session has expired or your access is restricted. Please sign in again."
            );
          }
        } else {
          console.error("An unexpected error occurred:", error);
        }

        console.error("Error fetching brands:", error);
      });
  };

  const OnClickChangePassword = () => {
    axiosInstance
      .patch(providerProfile.changePassword, {
        id: profile?.profile?._id,
        currentpassowrd: password,
        newpassowrd: newPassword,
      })
      .then(() => {
        toast.success("password changed");
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log("confritm");

          const statusCode = error.response?.status;
          console.log("Status Code:", statusCode);

          if (statusCode === 403) {
            localStorage.removeItem("provider");
            navigate("/provider/signin", { replace: true });
            toast.error(
              "Your session has expired or your access is restricted. Please sign in again."
            );
          }
        } else {
          console.error("An unexpected error occurred:", error);
        }

        console.error("Error fetching brands:", error);
      });
  };

  const OnClickUpdateData = (whichisTotChange: string, newOne: string) => {
    axiosInstance
      .patch(providerProfile.updateData, {
        id: profile?.profile?._id,
        whichisTotChange: whichisTotChange,
        newOne: newOne,
      })
      .then((response) => {
        console.log(response);

        profile?.setProfile((prev: any) => {
          if (!prev) return null;

          return {
            ...prev,
            [whichisTotChange]: newOne,
          };
        });
        setNewOwnerName(null);
        setNewPhone(null);
        setworkshopName(null);
        toast.success("changed");

        setEditSelector({
          ownerName: false,
          passowrd: false,
          workshopname: false,
          mobile: false,
        });
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;
          console.log("Status Code:", statusCode);

          localStorage.removeItem("provider");
          navigate("/provider/signin", { replace: true });
          toast.error(
            "Your session has expired or your access is restricted. Please sign in again."
          );
        } else {
          console.error("An unexpected error occurred:", error);
        }

        console.error("Error fetching brands:", error);
      });
  };

  return (
    <>
      <div className="w-[95%] h-[500px] bg-red-500 mt-4   flex  animate-fadeInDownBig">
        <div className="w-[30%] h-[100%] flex flex-col">
          <div className="w-[65%] h-[200px] bg-banner-gray flex items-center justify-center relative rounded-md">
            <img
              src={profile?.profile?.logoUrl}
              alt="Profile Logo"
              width={100}
              className="absolute top-0 left-0 right-0 bottom-0 m-auto"
            />
            <div className="w-full h-full relative"></div>
            <div className="w-[40%] h-[40%] absolute -bottom-11 flex justify-end items-center left-40">
              <FaCamera
                className="text-4xl text-gray-100 cursor-pointer"
                onClick={() => {
                  console.log("clcked");

                  imageInputref.current?.click();
                }}
              />
            </div>
          </div>

          <h1 className="text-white ml-16 text-md font-dm font-semibold tracking-widest">
            Change Logo
          </h1>
          <input
            name="images"
            type="file"
            className="hidden"
            ref={imageInputref}
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                // setFile(e.target.files[0]);
                changeLogo(e.target.files[0]);
                console.log(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="w-[70%] h-[100%]  flex-col justify-between">
          <div className="h-[50%] w-[100%] flex justify-between ">
            <div
              className={`w-[48%] h-[90%]  flex flex-col items-center place-content-center ${
                editSelector.workshopname
                  ? "animate-flipInX bg-banner-gray "
                  : "bg-gradient-to-b from-gray-900"
              }`}
            >
              <div className="w-[95%] h-[95%] flex flex-col space-y-2">
                {editSelector.workshopname ? (
                  <>
                    <h1 className="text-blue-700 text-lg">
                      Change WorkShop Name
                    </h1>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Current WorkShopName
                      </p>
                      <input
                        type="text"
                        className="w-[95%] text-white h-[50%] bg-transparent border-b-2 border-gray-600"
                        value={profile?.profile?.workshopName}
                        readOnly
                      />
                    </div>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Enter New WorkShopName
                      </p>
                      <input
                        type="text"
                        className="w-[95%] text-white h-[50%] bg-transparent border-b-2 border-gray-600"
                        value={workshopname ? workshopname : ""}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setworkshopName(null);
                          }
                          setworkshopName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[95%] h-[15%] space-y-2 flex justify-end">
                      {workshopname && (
                        <button
                          className="h-[90%] w-[30%] bg-green-500 rounded-sm text-white"
                          onClick={() => {
                            OnClickUpdateData("workshopName", workshopname);
                          }}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-[100%]  h-[100%] flex flex-col items-center justify-center">
                    <div className="w-[70%] h-[30%]  flex space-x-2 ml-15  place-content-center">
                      <FaShop className="text-2xl text-white" />
                      <h1 className="text-gray-300 text-dm text-md font-semibold">
                        Change WorskshopName
                      </h1>
                      <MdDriveFileRenameOutline className="text-2xl text-orange" />
                    </div>
                    <button
                      className="w-[30%] h-[15%] bg-orange rounded-md text-white"
                      onClick={() => {
                        setEditSelector({
                          ownerName: false,
                          passowrd: false,
                          workshopname: true,
                          mobile: false,
                        });
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`w-[48%] h-[90%]  flex flex-col items-center place-content-center ${
                editSelector.ownerName
                  ? "animate-flipInX bg-banner-gray "
                  : "bg-gradient-to-b from-gray-900"
              }`}
            >
              <div className="w-[95%] h-[95%] flex flex-col space-y-2">
                {editSelector.ownerName ? (
                  <>
                    {" "}
                    <h1 className="text-blue-700 text-lg">Change Owner Name</h1>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Current OwnerName
                      </p>
                      <input
                        type="text"
                        className="w-[95%] text-white h-[50%] bg-transparent border-b-2 border-gray-600"
                        value={profile?.profile?.ownerName}
                        readOnly
                      />
                    </div>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Enter New OwnerName
                      </p>
                      <input
                        type="text"
                        className="w-[95%] text-white h-[50%] bg-transparent border-b-2 border-gray-600"
                        value={newOwnerName ? newOwnerName : ""}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setNewOwnerName(null);
                          }
                          setNewOwnerName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[95%] h-[15%] space-y-2 flex justify-end">
                      {newOwnerName && (
                        <button
                          className="h-[90%] w-[30%] bg-green-500 rounded-sm text-white"
                          onClick={() => {
                            OnClickUpdateData("ownerName", newOwnerName);
                          }}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-[100%]  h-[100%] flex flex-col items-center justify-center">
                    <div className="w-[70%] h-[30%]  flex space-x-2 ml-15  place-content-center">
                      <FaUserCog className="text-2xl text-white" />
                      <h1 className="text-gray-300 text-dm text-md font-semibold">
                        Change OwnerName
                      </h1>
                      <MdDriveFileRenameOutline className="text-2xl text-orange" />
                    </div>
                    <button
                      className="w-[30%] h-[15%] bg-orange rounded-md text-white"
                      onClick={() => {
                        setEditSelector({
                          ownerName: true,
                          passowrd: false,
                          workshopname: false,
                          mobile: false,
                        });
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-[50%] w-[100%]  flex justify-between ">
            <div
              className={`w-[48%] h-[90%]   flex flex-col items-center place-content-center ${
                editSelector.mobile
                  ? "animate-flipInX bg-banner-gray "
                  : "bg-gradient-to-b from-gray-900"
              } `}
            >
              <div className="w-[95%] h-[95%] flex flex-col space-y-2">
                {editSelector.mobile ? (
                  <>
                    <h1 className="text-blue-700 text-lg">
                      Change Mobile Number
                    </h1>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Current Mobile Number
                      </p>
                      <input
                        type="text"
                        className="w-[95%] text-white h-[50%] bg-transparent border-b-2 border-gray-600"
                        value={profile?.profile?.mobile}
                        readOnly
                      />
                    </div>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Enter New Mobile Number
                      </p>
                      <input
                        type="text"
                        className="w-[95%] text-white h-[50%] bg-transparent border-b-2 border-gray-600"
                        value={newPhone ? newPhone : ""}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setNewPhone(null);
                          }
                          setNewPhone(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[95%] h-[15%] space-y-2 flex justify-end">
                      {newPhone && (
                        <button
                          className="h-[90%] w-[30%] bg-green-500 rounded-sm text-white"
                          onClick={() => {
                            OnClickUpdateData("mobile", newPhone);
                          }}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-[100%]  h-[100%] flex flex-col items-center justify-center">
                    <div className="w-[70%] h-[30%]  flex space-x-2 ml-15  place-content-center">
                      <FaSquarePhone className="text-2xl text-white" />
                      <h1 className="text-gray-300 text-dm text-md font-semibold">
                        Change Mobile Number
                      </h1>
                      <MdDriveFileRenameOutline className="text-2xl text-orange" />
                    </div>
                    <button
                      className="w-[30%] h-[15%] bg-orange rounded-md text-white"
                      onClick={() => {
                        setEditSelector({
                          ownerName: false,
                          passowrd: false,
                          workshopname: false,
                          mobile: true,
                        });
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`w-[48%] h-[90%]  flex flex-col items-center place-content-center ${
                editSelector.passowrd
                  ? "animate-flipInX bg-banner-gray "
                  : "bg-gradient-to-b from-gray-900"
              }`}
            >
              <div className="w-[95%] h-[95%] flex flex-col space-y-2">
                {editSelector.passowrd ? (
                  <>
                    <h1 className="text-blue-700 text-lg">Change password</h1>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Enter Current Password
                      </p>
                      <div className="relative w-[95%]  h-[50%]">
                        <input
                          type={showPassword.old ? "text" : "password"}
                          className="w-full text-white h-[100%] bg-transparent border-b-2 border-gray-600 pr-10"
                          value={password ? password : ""}
                          onChange={(e) => setPassoword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                          onClick={() =>
                            setShowPassword({ old: true, new: false })
                          }
                        >
                          {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="w-[100%] h-[30%] space-y-2">
                      <p className="text-sm tracking-wide text-white ">
                        Enter New Passowrd
                      </p>
                      <div className="relative w-[95%]  h-[50%]">
                        <input
                          type={showPassword.new ? "text" : "password"}
                          className="w-full text-white h-[100%] bg-transparent border-b-2 border-gray-600 pr-10"
                          value={newPassword ? newPassword : ""}
                          onChange={(e) => setNewPassoword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                          onClick={() =>
                            setShowPassword({ old: false, new: true })
                          }
                        >
                          {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="w-[95%] h-[15%] space-y-2 flex justify-end">
                      <button
                        className="h-[90%] w-[30%] bg-green-500 rounded-sm text-white"
                        onClick={OnClickChangePassword}
                      >
                        Done
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-[100%]  h-[100%] flex flex-col items-center justify-center">
                    <div className="w-[70%] h-[30%]  flex space-x-2 ml-15  place-content-center">
                      <TbPasswordUser className="text-2xl text-white" />
                      <h1 className="text-gray-300 text-dm text-md font-semibold">
                        Change Password
                      </h1>
                      <MdDriveFileRenameOutline className="text-2xl text-orange" />
                    </div>
                    <button
                      className="w-[30%] h-[15%] bg-orange rounded-md text-white"
                      onClick={() => {
                        setEditSelector({
                          ownerName: false,
                          passowrd: true,
                          workshopname: false,
                          mobile: false,
                        });
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
