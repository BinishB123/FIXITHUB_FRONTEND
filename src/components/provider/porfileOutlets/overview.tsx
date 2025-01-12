import { LuUpload } from "react-icons/lu";
import { FaPersonShelter } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { useContext, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../../api/common";
import { providerProfile } from "../../../api/provider";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { IoMdDoneAll } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { profileContext } from "../providerProfile";
import { TiTick } from "react-icons/ti";
import loadingImg from '../../../assets/rotation.png'
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OverView() {
  const imageInputref = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate()
  const { providerInfo } = useSelector((state: RootState) => state.provider);
  const profile = useContext(profileContext)
  const [file, setFile] = useState<null | Blob>(null);
  const [loading, setloading] = useState<boolean>(false)
  const [brands, setBrands] = useState<{ providerbrands: { _id: string, brand: string } }[] | null>(null)
  useEffect(() => {
    axiosInstance.get(providerProfile.getallBrand + `?id=${providerInfo?.id}`).then((response) => {
      const { brandData } = response.data
      setBrands(brandData)
    })
  }, [])

  const addLogo = (selectedFile: File) => {
    if (!selectedFile) {
      console.log("No selectedFile selected");
      return;
    }

    if (!providerInfo?.id) {
      console.log("No provider ID found");
      return;
    }

    const formData = new FormData();
    formData.append("id", providerInfo.id);
    formData.append("files", selectedFile)
    setloading(true)
    axiosInstance
      .patch(providerProfile.addLogo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      .then((response) => {
        const { url } = response.data

        profile?.setProfile((prevState) => {
          if (prevState) {

            return {
              ...prevState,
              logoUrl: url || undefined,
            };
          }

          return null;
        });
        setloading(false)
        setFile(null)
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
      }).finally(() => {
        setloading(false)
      });
  };

  const editAbout = () => {
    const data = {
      id: providerInfo?.id,
      about: profile?.editaboutSt,
    };
    if (profile?.editaboutSt === profile?.profile?.about) {

      return
    }
    axiosInstance
      .patch(providerProfile.editabout, { data })
      .then((response) => {
        profile?.setProfile((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              about: profile?.editaboutSt || "",
            };
          }

          return null;
        });
        profile?.seteditAbout(null);
      });
  };

  return (
    <>
      <div className="w-[95%] h-[500px]  mt-6 flex flex-col space-y-5 ">
        <div className="w-[100%]  h-[200px] flex justify-between">
          <div className="w-[20%] h-[100%] bg-banner-gray rounded-md animate-fadeInDownBig flex  flex-col justify-center items-center space-y-4">
            {profile?.profile?.logoUrl ? (
               loading ? (
                <img src={loadingImg} width={50} className="animate-spinslow"></img>
              ) : (
                <img src={profile?.profile.logoUrl} alt="Profile Logo" width={100} />
              )
            ) : (
              <>
                {loading && <AiOutlineLoading3Quarters className="text-center text-4xl font-light text-gray-200 animate-spinslow" />}
                {
                  !loading && <LuUpload
                    className="text-center text-8xl font-light text-gray-600"
                    onClick={() => {
                      if (!file) {
                        imageInputref.current?.click();
                      }
                    }}
                  />
                }
                <h1 className="text-gray-200 text-lg tracking-wider">
                  {!loading && "Add Logo"}
                </h1>
                <input

                  name="images"
                  type="file"
                  className="hidden"
                  ref={imageInputref}
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    if (!file) {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        addLogo(e.target.files[0]);
                      }
                    }
                  }}
                />
              </>
            )}
          </div>

          <div className="w-[77%] h-[100%] bg-banner-gray rounded-md animate-fadeInDownBig flex flex-col items-center">
            <div className="w-[100%] bg-grey h-[30px] rounded-tl-md rounded-tr-md flex justify-between">
              <h1 className="ml-5 text-gray-950 font-bold tracking-wide">
                ABOUT
              </h1>
              {profile?.editaboutSt !== null ? (
                <div className="w-[10%] h-[30px] flex justify-evenly">
                  <IoMdDoneAll
                    className="mr-6 mt-1 text-2xl font-bold text-green-900 cursor-pointer "
                    onClick={editAbout}
                  />{" "}
                  <IoClose
                    className="mr-6 mt-1 text-2xl font-bold text-red cursor-pointer "
                    onClick={() => {
                      profile?.seteditAbout(null);
                    }}
                  />
                </div>
              ) : (
                <FaRegEdit
                  className="mr-6 mt-1 text-xl text-blue-950 cursor-pointer"
                  onClick={() => {
                    profile?.seteditAbout(profile?.profile?.about ? profile?.profile.about : "");
                  }}
                />
              )}
            </div>
            <div className="w-[95%] h-[150px] mt-4">
              {profile?.editaboutSt == null ? (
                <p className="text-gray-200 text-start text-sm tracking-wide">
                  {profile?.profile?.about
                    ? profile?.profile?.about
                    : "Add an about................."}
                </p>
              ) : (
                <textarea
                  className="w-[100%] h-[130px] rounded-md  bg-black text-white tex-sm text-start scrollbar-hide"
                  maxLength={620}
                  value={profile?.editaboutSt}
                  onChange={(e) => {
                    profile?.seteditAbout(e.target.value);
                  }}
                  placeholder="  Text About......"
                ></textarea>
              )}
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[300px]  rounded-md flex justify-between ">
          <div className="w-[40%] h-[100%] bg-banner-gray rounded-md flex justify-center items-center">
            <div className="w-[85%] h-[250px]  flex justify-between flex-col space-y-3 ">
              <div className="w-[100%] h-[50px]  place-items-center">
                <h1 className="flex  text-3xl text-center tracking-widest font-dm font-bold text-white">
                  {profile?.profile?.workshopName}
                </h1>
              </div>
              <div className="w-[100%] h-[600px] ">
                <div className="flex justify-between w-[33%] h-[40px] space-x-2   ">
                  <FaPersonShelter className=" text-2xl text-yellow-500" />
                  <h1 className="text-emerald-50 text-md">owner</h1>
                  <h1 className="text-lg text-white">:</h1>
                  <h1 className="text-md tracking-wide font-medium text-white">
                    {profile?.profile?.ownerName}
                  </h1>
                </div>
                <hr className="mb-2 bg-slate-950" />
                <div className="flex justify-between w-[50%] h-[40px] space-x-2">
                  <MdEmail className="text-xl text-red" />
                  <h1 className="text-emerald-50 ">Email</h1>

                  <h1 className="text-sm text-white">:</h1>
                  <h1 className="text-sm tracking-wider font-medium text-white ">
                    {profile?.profile?.email}
                  </h1>
                </div>
                <hr className="mb-2 bg-gray-950" />
                <div className="flex justify-between w-[40%] h-[40px] space-x-2">
                  <FaPhone className="text-xl text-blue-500" />
                  <h1 className="text-emerald-50 ">Phone</h1>

                  <h1 className="text-sm text-white">:</h1>
                  <h1 className="text-sm  font-medium text-white ">
                    {profile?.profile?.mobile}
                  </h1>
                </div>
                <hr className="mb-2 bg-gray-950" />
                <div className="flex  w-[100%] h-[60px]  space-x-2">
                  <div className="w-[10%] h-[100%] ">
                    <FaMapLocationDot className="text-2xl text-end text-orange" />
                  </div>
                  <div className="w-[21%] h-[100%]  ">
                    <h1 className="text-md  text-white">Location</h1>
                  </div>
                  <div className="w-[1%] h-[100%] ">
                    <h1 className="text-md text-white">:</h1>
                  </div>
                  <div className="w-[160%]   flex flex-wrap ">
                    <h1 className="text-sm w-[160%]  tracking-wide text-white ">
                      {profile?.profile?.workshopDetails.address}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[58%] rounded-md h-[100%] bg-banner-gray flex justify-center items-center ">
            <div className="w-[105%] h-[90%]  flex space-x-2 flex-wrap justify-center overflow-y-scroll scrollbar-hide space-y-2 ">
              {
                brands?.map((data, index) => (
                  <div className={`w-[20%] h-[15%] ${index === 0 && "ml-2 mt-2"} flex space-y-2 bg-black justify-center `} key={index}>
                    <h1 className="text-center text-white font-medium text-md   rounded-sm ">{data.providerbrands.brand} </h1>
                    <TiTick className="text-sm text-right text-green-500 " />
                  </div>
                ))
              }

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default OverView;
