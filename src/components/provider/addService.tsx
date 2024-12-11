import { Outlet, useNavigate } from "react-router-dom";
import React, { createContext, useState } from "react";
import { apiUrl, axiosInstance } from "../../api/common";
import { motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import {
  providerGeneralServices,
  providerRoadServices,
  providerServicesSubtype,
} from "../../interfaces/provider";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import { IoIosRemoveCircle } from "react-icons/io";
import { toast } from "sonner";
import { LiaEdit } from "react-icons/lia";
import axios from "axios";

interface AddServiceContextType {
  generalService: providerGeneralServices[] | undefined;
  setGeneralservices: React.Dispatch<
    React.SetStateAction<providerGeneralServices[] | undefined>
  >;
  roadServices: providerRoadServices[] | undefined;
  setRoadServices: React.Dispatch<
    React.SetStateAction<providerRoadServices[] | undefined>
  >;
  isModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  subtype: providerServicesSubtype[] | undefined;
  setSubTypes: React.Dispatch<
    React.SetStateAction<providerServicesSubtype[] | undefined>
  >;
  setServiceId: React.Dispatch<React.SetStateAction<string | null>>;
  vehicleType: string | undefined;
  setvehicleType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
}

export const AddServiceContext = createContext<
  AddServiceContextType | undefined
>(undefined);

function AddService() {
  const navigate = useNavigate();
  const [heading, setHeading] = useState<string>("");
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const [hoveredRemove, setHoveredRemove] = useState<string | undefined>(
    undefined
  );
  const [hoveredCancel, setHoveredCancel] = useState<string | undefined>(
    undefined
  );
  const [hoveredEditAdd, setHoveredEditAdd] = useState<string | undefined>(
    undefined
  );
  const { providerInfo } = useSelector((state: RootState) => state.provider);
  const [generalService, setGeneralservices] = useState<
    providerGeneralServices[] | undefined
  >(undefined);
  const [roadServices, setRoadServices] = useState<
    providerRoadServices[] | undefined
  >(undefined);
  const [isModal, setModal] = useState<boolean>(false);
  const [pricerange, setPriceRange] = useState<{ [key: number]: string }>({});
  const [ServiceId, setServiceId] = useState<string | null>(null);
  const [vehicleType, setvehicleType] = useState<string | undefined>(undefined);
  const [subtype, setSubTypes] = useState<
    providerServicesSubtype[] | undefined
  >(undefined);
  const [editIndex, setdEditIndex] = useState<number | undefined>(undefined);

  const removeSubtype = (type: any) => {
    axiosInstance
      .delete(`${apiUrl}/api/provider/addservice/deletesubtype`, {
        params: {
          serviceid: ServiceId,
          providerId: providerInfo?.id,
          type: vehicleType,
          servicetype: type,
        },
      })
      .then(() => {
        const updatedData = subtype?.map((data) => {
          console.log("data", data, "type", type);
          if (data._id === type) {
            return { ...data, priceRange: undefined, isAdded: false };
          }

          return data;
        });

        const updatedGeneralService = generalService?.map((item) => {
          if (item.typeid === ServiceId) {
            return {
              ...item,
              subType: updatedData,
            } as providerGeneralServices;
          }
          return item;
        });

        setSubTypes(updatedData);
        setGeneralservices(updatedGeneralService);
        setdEditIndex(undefined);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log("confritm");

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

  // THIS FUNCTION EDITING THE SUBTYPE
  const editSubtype = (index: any, type: string) => {
    const regex = /^\d+$/;
    if (!regex.test(pricerange[index])) {
      return toast.warning("Enter a proper price range");
    }
    const newsubtype = {
      type: type,
      startingprice: parseInt(pricerange[index]),
      vehicleType: vehicleType,
    };

    axiosInstance
      .patch(apiUrl + "/api/provider/addservice/editsubtype", {
        serviceid: ServiceId,
        providerId: providerInfo?.id,
        newSubtype: newsubtype,
      })
      .then((response) => {
        console.log(response);

        const updatedData = subtype?.map((data) => {
          if (data._id === type)
            return {
              ...data,
              priceRange: parseInt(pricerange[index]),
              isAdded: true,
            };
          return data;
        });

        const updatedGeneralService = generalService?.map((item) => {
          if (item.typeid === ServiceId) {
            return {
              ...item,
              subType: updatedData,
            } as providerGeneralServices;
          }
          return item;
        });

      
        setPriceRange({});
        setSubTypes(updatedData);
        setGeneralservices(updatedGeneralService);
        setdEditIndex(undefined);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log("confritm");

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

  // THIS FUNCTION ID FOR ADDING THE SUBTYPE
  const addSubtype = (index: any, type: string) => {
    const regex = /^\d+$/;
    if (!regex.test(pricerange[index])) {
      return toast.warning("Enter a proper price range");
    }
    const newsubtype = {
      type: type,
      startingprice: parseInt(pricerange[index]),
      vehicleType: vehicleType,
    };

    axiosInstance
      .post(apiUrl + "/api/provider/addservice/addsubtype", {
        serviceid: ServiceId,
        providerId: providerInfo?.id,
        newSubtype: newsubtype,
      })
      .then(() => {
        const updatedData = subtype?.map((data) => {
          if (data._id === type)
            return {
              ...data,
              priceRange: parseInt(pricerange[index]),
              isAdded: true,
            };
          return data;
        });

        // Update general service state
        const updatedGeneralService = generalService?.map((item) => {
          if (item.typeid === ServiceId) {
            return {
              ...item,
              subType: updatedData,
            } as providerGeneralServices;
          }
          return item;
        });

        // Set updated states
        setPriceRange({});
        setSubTypes(updatedData);
        setGeneralservices(updatedGeneralService);

        // Log to verify the update
        console.log("Updated General Services:", updatedData);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log("confritm");

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
      <AddServiceContext.Provider
        value={{
          generalService,
          setGeneralservices,
          roadServices,
          setRoadServices,
          isModal,
          setModal,
          subtype,
          setSubTypes,
          setServiceId,
          vehicleType,
          setvehicleType,
          setHeading,
        }}
      >
        <div className="w-[80%]  h-auto flex flex-col space-y-5 place-items-center overflow-y-scroll scrollbar-hide">
          <div className="w-[95%] h-[80px]  flex flex-shrink-0 animate-fadeInDownBig justify-center place-items-center ">
            <div className="w-[90%] text-center border-b-2 border-gray-800 mb-10 ">
              <h1 className="text-xl tracking-wider text-white">
                "Manage Your Services Effortlessly – Add, Edit, and Showcase All
                That You Offer!"
              </h1>
            </div>
          </div>
          <Outlet />
        </div>
      </AddServiceContext.Provider>
      {isModal && (
        <motion.div
          className="fixed inset-0 h-auto bg-black bg-opacity-70 flex items-center justify-center transition delay-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-banner-gray rounded-lg w-[95%] md:w-[40%] h-[600px] flex flex-col items-center ">
            <div className="w-[100%] h-[10%] mt-0  flex justify-end">
              <div className=" w-[90%] mt-4 space-y-2">
                <h1 className="text-white text-center text-xl font-semibold">
                  {heading}
                </h1>
              </div>
              <IoMdClose
                className="text-3xl text-red-600 bg-white text-red rounded-sm cursor-pointer "
                onClick={() => {
                  setModal(false);
                }}
              />
            </div>

            <div className="w-[95%] h-[500px] flex-col space-y-2 overflow-y-scroll scrollbar-hide">
              {subtype ? (
                subtype.map((item, index) => (
                  <div
                    key={index}
                    className="w-[95%] h-[40px]  flex justify-center place-content-center items-center  animate-backInDown "
                  >
                    <div className="w-[30%] place-content-center   ">
                      <h1 className="text-white text-sm font-semibold w-[100%] ">
                        {item.type}
                      </h1>
                    </div>
                    {item.priceRange ? (
                      (editIndex !== null || editIndex !== undefined) &&
                      editIndex == index ? (
                        <input
                          className="w-[30%] bg-black text-white text-sm font-dm font-medium text-center h-[25px] rounded-md "
                          placeholder="starting price "
                          key={index}
                          type="text"
                          value={pricerange[index] || ""}
                          onChange={(e) => {
                            setPriceRange((prevState) => ({
                              ...prevState,
                              [index]: e.target.value,
                            }));
                          }}
                        />
                      ) : (
                        <h1 className="w-[30%] text-green-400  text-sm ">
                          {" "}
                          Starting Range : {item.priceRange}{" "}
                        </h1>
                      )
                    ) : (
                      <input
                        key={index}
                        type="text"
                        value={pricerange[index] || ""}
                        onChange={(e) => {
                          setPriceRange((prevState) => ({
                            ...prevState,
                            [index]: e.target.value,
                          }));
                        }}
                        className="w-[30%] bg-black text-white text-sm font-dm font-medium text-center h-[25px] rounded-md "
                        placeholder="starting price "
                      />
                    )}
                    {item.isAdded ? (
                      <>
                        <div
                          className={
                            editIndex === index
                              ? "hidden"
                              : "w-[20%] flex justify-center "
                          }
                        >
                          <div className="relative flex items-center space-x-6">
                            <LiaEdit
                              onClick={() => {
                                setPriceRange({
                                  [index]: item.priceRange + "",
                                });
                                setdEditIndex(index);
                              }}
                              onMouseEnter={() => setHovered(index)} // Show label on hover
                              onMouseLeave={() => setHovered(undefined)} // Hide label when not hovering
                              className="text-2xl text-blue-500 cursor-pointer"
                            />

                            {hovered === index && (
                              <div className=" absolute bottom-8  transform -translate-x-1/2 w-[70px] bg-white font-bold  text-black text-xs rounded py-1 px-2 z-10">
                                Edit Price
                              </div>
                            )}
                            <div className="relative">
                              <IoIosRemoveCircle
                                className="text-2xl font-bold text-red cursor-pointer"
                                onMouseEnter={() =>
                                  setHoveredRemove(index + "remove")
                                }
                                onMouseLeave={() => setHoveredRemove(undefined)} // Hide Remove
                                onClick={() => {
                                  removeSubtype(item._id);
                                }}
                              />

                              {hoveredRemove === index + "remove" && (
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 font-semibold text-white text-xs rounded py-1 px-2 z-10">
                                  Remove
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            editIndex !== index
                              ? "hidden"
                              : "w-[20%] flex justify-center space-x-6 relative"
                          }
                        >
                          {/* IoAdd Icon with Tooltip */}
                          {/* icon for edit added subtype */}
                          <div className="relative">
                            <IoAdd
                              className="text-orange text-2xl font-bold cursor-pointer"
                              onClick={() => {
                                editSubtype(index, item._id);
                              }}
                              onMouseEnter={() =>
                                setHoveredEditAdd(index + "add")
                              }
                              onMouseLeave={() => setHoveredEditAdd(undefined)}
                            />

                            {hoveredEditAdd === index + "add" && (
                              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[130px]  bg-green-500 text-white text-xs rounded py-1 px-2 z-10">
                                click To Edit subtype
                              </div>
                            )}
                          </div>

                          {/* MdCancel Icon with Tooltip */}
                          <div className="relative">
                            <MdCancel
                              className="text-2xl font-bold text-red cursor-pointer"
                              onClick={() => {
                                setdEditIndex(undefined);
                                setPriceRange({});
                              }}
                              onMouseEnter={() =>
                                setHoveredCancel(index + "cancel")
                              }
                              onMouseLeave={() => setHoveredCancel(undefined)}
                            />

                            {hoveredCancel === index + "cancel" && (
                              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                                Cancel
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-[20%]  flex justify-center space-x-2">
                        <IoAdd
                          className="text-orange text-2xl font-bold cursor-pointer "
                          onClick={() => {
                            addSubtype(index, item._id);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <h1 className="text-center text-orange text-xl font-semibold tracking-widest animate-bounce">
                  No types added
                </h1>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default AddService;
