import img from "../../../../src/assets/user.png";
import { RiImageEditFill } from "react-icons/ri";
import { IoIosDoneAll } from "react-icons/io";
import { motion } from "framer-motion";
import { CiEdit } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Redux/store/store";
import { useDispatch } from "react-redux";
import { resetErrorAndErrorMessage, resetSuccessAndMessage, updateOrAddImage, updateProfileDetail } from "../../../Redux/slice/userSlice";
import { toast } from "sonner";

function OverView() {
  const [editName, setEditName] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);
  const { userInfo, error, errormessage, success, message } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState("")
  const [imgfile, setimgfile] = useState<File | null>(null)
  const [mobile, setMobile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputref = useRef<HTMLInputElement | null>(null)
  const mobileInput = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isModal, setModalState] = useState<boolean>(false);


  useEffect(() => {
    if (error) {
      toast.error(errormessage)
      dispatch(resetErrorAndErrorMessage())
    }
    if (success) {
      toast.success(message)
      dispatch(resetSuccessAndMessage())

    }
    setEditName(false)
    setEditPhone(false)
  }, [success, error])

  useEffect(() => {
    setName(userInfo?.name ? userInfo.name : null);
    setMobile(userInfo?.mobile ? userInfo.mobile : "");
  }, [editName, editPhone]);

  const OnClickEdit = (whichIstoChange: string) => {
    if (whichIstoChange === "name") {
      if (name?.trim() === userInfo?.name) {
        setEditName(false);
        return
      }
      if (/\d/.test(name + "")) { // \d matches any digit (0-9)
        toast.warning("Name should not contain numbers!")
        return;
      }

      if (name) {
        dispatch(
          updateProfileDetail({
            newData: name,
            whichIstoChange: whichIstoChange,
            id: userInfo?.id || "",
          })
        );
      }


    }

    if (whichIstoChange === "mobile") {
      if (mobile?.trim() === userInfo?.mobile) {
        setEditPhone(false);
      }
      if (!/^\d{10}$/.test(mobile+"")) { // ^ ensures it starts with digits, \d{10} ensures exactly 10 digits, $ ensures it ends there
        toast.warning("Mobile number must be exactly 10 digits and contain only numbers!");
        return;
      }
      if (mobile) {
        dispatch(
          updateProfileDetail({
            newData: mobile,
            whichIstoChange: whichIstoChange,
            id: userInfo?.id || "",
          })
        );
      }
    }

  };


  const preview = (e: any) => {
    setimgfile(e.target.files[0])
    setImagePreview(URL.createObjectURL(e.target.files[0]))
    setModalState(true)

  }


  const changeOrAddLogo = (e: File) => {
    dispatch(
      updateOrAddImage({
        image: e,
        id: userInfo?.id || "",
        url: userInfo?.logoUrl || "",
      }));
    setModalState(false)


  }
  return (
    <>
      <div className="w-[70%] h-[700px] bg-black flex justify-center  ">
        <div className="w-[80%] h-[400px]  flex animate-fadeInUp ">
          <div className="w-[30%] h-[100%]  flex flex-col  items-start  ">
            <div className="relative w-[150px] h-[150px]  overflow-hidden">
              {
                userInfo?.logoUrl ? <img
                  src={userInfo.logoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                /> : <img
                  src={img}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              }

              {/* Icon positioned at the bottom-right inside the image */}

            </div>
            <div className="w-[100%] h-[50px] flex space-x-1 bg-banner-gray mt-4 items-center justify-center rounded-md cursor-pointer border-gray-500 border-dashed border-2" onClick={() => {
              imageInputref.current?.click()
            }}>
              <RiImageEditFill className="bottom-0 right-2 text-2xl  text-gray-500 cursor-pointer  " />
              <h1 className="text-md font-dm font-semibold text-gray-400">Change image</h1>
            </div>

            <input
              name="images"
              type="file"
              className="hidden"
              ref={imageInputref}
              accept="image/png, image/jpeg"
              onChange={(e) => {

                if (e.target.files?.[0]) {
                  preview(e);
                }

              }}
            />
          </div>
          IoIosDoneAll
          <div className="w-[70%] h-[100%] flex flex-col items-end ml-3 ">
            <div className="w-[100%] h-[60%]  flex flex-col   space-y-2 ">
              <div className="w-full h-[20%] flex items-center justify-between   px-4 space-x-2">
                {editName ? (
                  <input
                    ref={inputRef}
                    className={`text-md font-semibold text-white bg-black h-[80%] outline-none hover:border-b-2 ${editName && "border-b-2 border-gray-400"}`}
                    value={name ? name : ""}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                ) : (
                  <input
                    className={`text-md font-semibold text-white bg-black h-[80%] outline-none `}
                    readOnly
                    value={userInfo?.name}
                  />
                )}
                {!editName ? (
                  <CiEdit
                    className="text-blue-700 text-2xl cursor-pointer"
                    onClick={() => {
                      setEditName(true);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                  />
                ) : (
                  <IoIosDoneAll
                    className="text-green-600 text-2xl cursor-pointer"
                    onClick={() => {
                      OnClickEdit("name");
                    }}
                  />
                )}
              </div>
              <div className="w-full h-[20%] flex items-center justify-between px-4 space-x-2">
                <h1 className="text-md font-semibold text-white">
                  {userInfo?.email}
                </h1>
                {/* <CiEdit className="text-green-500 text-2xl" /> */}
              </div>
              <div className="w-full h-[20%] flex items-center justify-between   px-4 space-x-2">
                {editPhone ? (
                  <input
                    ref={mobileInput}
                    className={`text-md font-semibold text-white bg-black h-[80%] outline-none text-md font-semibold text-white bg-black h-[80%] outline-none hover:border-b-2 ${editPhone && "border-b-2 border-gray-400"}`}
                    value={mobile ? mobile : ""}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                ) : (
                  <input
                    className="text-md font-semibold text-white bg-black h-[80%] outline-none"
                    readOnly
                    value={userInfo?.mobile}
                  />
                )}
                {!editPhone ? (
                  <CiEdit
                    className="text-blue-700 text-2xl cursor-pointer"
                    onClick={() => {
                      setEditPhone(true);
                      setTimeout(() => mobileInput.current?.focus(), 0);
                    }}
                  />
                ) : (
                  <IoIosDoneAll
                    className="text-green-600 text-2xl cursor-pointer"
                    onClick={() => {
                      OnClickEdit("mobile");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition delay-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-transparent rounded-lg w-[95%] md:w-[30%] h-[80%] flex flex-col items-center ">
            <div className="w-[100%] h-[10%] mt-0  flex justify-end">
              <div className=" w-[90%] mt-4">

              </div>

            </div>
            <div className="w-[95%] h-[70%] flex-col space-y-2 scrollbar-hide  ">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover cursor-pointer overflow-x-scroll"
              />
            </div>


            <div className="w-[95%]  h-[10%] bg-opacity-75 flex justify-center items-center space-x-28 mt-6">
              <button className="w-[40%] h-[60%] bg-green-500 text-white rounded-md" onClick={() => {
                if (imgfile) {
                  changeOrAddLogo(imgfile)
                }
              }}>Done</button>
              <button className="w-[40%] h-[60%] bg-red text-white rounded-md" onClick={() => {
                setModalState(false);
                if (imageInputref.current?.value) {
                  imageInputref.current.value = ""
                }
              }}>Cancel</button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default OverView;
