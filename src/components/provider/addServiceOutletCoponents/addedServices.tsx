import { useContext, useEffect } from "react";
import { AddServiceContext } from "../addService";
import { axiosInstance, apiUrl } from "../../../api/common";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import { toast } from "sonner";
import { SiTicktick } from "react-icons/si";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosRemoveCircle } from "react-icons/io";

function AddedServices(prop: { value: number }) {
  const service = useContext(AddServiceContext);
  const navigate = useNavigate()
  const { providerInfo } = useSelector((state: RootState) => state.provider);

  service?.setvehicleType(prop.value == 2 ? "2" : "4");
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get(
          apiUrl +
          `/api/provider/addservice/getallorganisedServices?id=${providerInfo?.id}&type=${prop.value}`
        );

        const { providerGeneralServiceData, providerRoadServiceData } =
          response.data;

        service?.setGeneralservices(providerGeneralServiceData);

        service?.setRoadServices(providerRoadServiceData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const AddGeneralOrRoadService = (typeid: string, category: string) => {
    axiosInstance
      .post(apiUrl + "/api/provider/addservice/addgeneralorroadservice", {
        vehicleType:
          prop.value == 2
            ? "67078684512a1f85729f54bf"
            : "6707878b512a1f85729f54c5",
        id: providerInfo?.id,
        typeid: typeid,
        category: category,
      })
      .then(() => {
        if (category === "road") {
          if (service?.roadServices) {
            const updatedData = service.roadServices.map((item) => {
              if (item.typeid === typeid) {
                return { ...item, isAdded: true };
              }
              return item;
            });

            service.setRoadServices(updatedData);
          } else {
            return toast.error("Adding failed try again");
          }
        }

        if (service?.generalService) {
          const updatedData = service.generalService.map((item) => {
            if (item.typeid === typeid) {
              return { ...item, isAdded: true };
            }
            return item;
          });

          if (updatedData) {
            service.setGeneralservices(updatedData);
          } else {
            return toast.error("Adding failed try again");
          }
        } else {
          console.error("generalService is not available.");
        }
      })
      .catch((error) => {
      

        if (axios.isAxiosError(error)) {
          console.log("confritm");

          const statusCode = error.response?.status;
          console.log("Status Code:", statusCode);

          if (statusCode === 403) {
            localStorage.removeItem("provider");
            navigate('/provider/signin', { replace: true });
            toast.error("Your session has expired or your access is restricted. Please sign in again.");
          }
        } else {
          console.error("An unexpected error occurred:", error);
        }

        console.error("Error fetching brands:", error);
      });
  };

  const removeService = (typeid:string,workshopId:string,category:string)=>{
    axiosInstance.patch(apiUrl + `/api/provider/addservice/removerservice/${typeid}/${workshopId}/${prop.value == 2?"twoWheeler":"fourWheeler"}`).then((response)=>{
      if (category === "road") {
        if (service?.roadServices) {
          const updatedData = service.roadServices.map((item) => {
            if (item.typeid === typeid) {
              return { ...item, isAdded: false };
            }
            return item;
          });

          service.setRoadServices(updatedData);
        } else {
          return toast.error("Adding failed try again");
        }
      }

      if (service?.generalService) {
        const updatedData = service.generalService.map((item) => {
          if (item.typeid === typeid) {
            return { ...item, isAdded: false  };
          }
          return item;
        });

        if (updatedData) {
          service.setGeneralservices(updatedData);
        } else {
          return toast.error("Adding failed try again");
        }
      } else {
        console.error("generalService is not available.");
      }
      
    }).catch((error)=>{
      console.log();
      
    })
  }

  return (
    <>
      <div className="w-[95%] h-[550px]  flex flex-col">
        <div className="w-[100%] h-[650px]  flex-col">
          <div className="w-[100%] h-[50px] hidden ">
            <h1 className=" text-xl text-white border-b-2 border-gray-600 w-[50%] font-semibold">
              {prop.value === 2 ? "Add General Services Offered for Two-Wheelers in Your Workshop" : "Add General Services Offered for Four-Wheelers in Your Workshop"}
            </h1>
          </div>
          <div className="w-[100%] h-[600px]   grid grid-cols-2 md:grid-cols-3 gap-x-2 space-y-3 overflow-y-scroll rounded-md scrollbar-hide animate-fadeInDownBig mt-4 ">
            {service?.generalService?.map((item, index) => (
              <div
                key={index}
                className="relative w-[85%] h-[150px] bg-banner-gray flex flex-col text-white rounded-md p-2"
              >
                {/* Remove Icon */}
                <div className="absolute top-2 right-2">
                 {
                  item.isAdded&& <IoIosRemoveCircle className="w-6 h-6 bg-red-600 cursor-pointer text-red flex items-center justify-center rounded-full" onClick={() => {
                    if (providerInfo?.id) {
                      removeService(item.typeid,providerInfo?.id,"general")
                    }
                  }} />
                 }
                  {/* <button
                  className="w-6 h-6 bg-red-600 text-white flex items-center justify-center rounded-full"
                  onClick={() => {
                    // // Handle the remove action
                    // (item.typeid);
                  }}
                >
                  ✖
                </button> */}
                </div>

                {/* Main Content */}
                <div className="w-[100%] h-[100px] flex justify-end">
                  <div className="w-[30%] h-[100px] overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="w-[70%] flex place-content-start place-items-center">
                    <h1 className="text-md font-semibold text-start">
                      {item.typename}
                    </h1>
                  </div>
                </div>

                <div className="w-[100%] h-[50px] flex place-content-end pb-6 pr-2">
                  {!item.isAdded ? (
                    <button
                      className="w-[40%] bg-orange h-[30px] mt-1 rounded-md font-semibold"
                      onClick={() => {
                        AddGeneralOrRoadService(item.typeid, item.category);
                      }}
                    >
                      ADD
                    </button>
                  ) : (
                    <button
                      className="w-[40%] bg-orange h-[30px] mt-1 rounded-md font-semibold"
                      onClick={() => {
                        service.setHeading(item.typename);
                        service?.setModal(true);
                        service?.setSubTypes(item.subType);
                        service?.setServiceId(item.typeid);
                      }}
                    >
                      view
                    </button>
                  )}
                </div>
              </div>

            ))}
          </div>
        </div>
        {/* ZXVBCVVCBC */}
        <div className="w-[100%] h-[550px] hidden ">
          <div className="w-[100%] h-[50px]">
            <h1 className="text-start  text-xl text-white border-b-2 border-gray-600 w-[55%] font-semibold">
              {prop.value === 2 ? "Add RoadAssistance Services Offered for Two-Wheelers in Your Workshop" : "Add RoadAssistance Services Offered for Four-Wheelers in Your Workshop"}


            </h1>
          </div>
          <div className="w-[100%] h-[600px]   grid grid-cols-2 md:grid-cols-3 gap-2 space-y-3 overflow-y-scroll rounded-md scrollbar-hide animate-fadeInDownBig mt-4">
            {service?.roadServices?.map((item, index) => (
              <div
              key={index}
              className={`w-[85%] h-[150px] bg-banner-gray flex flex-col text-white rounded-md p-2 ${index === 0 && ""}`}
            >
              <div className="relative w-[100%] h-[100px] flex justify-end">
                {/* Image Container */}
                <div className="w-[30%] h-[100px] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
            
                {/* Title Section */}
                <div className="w-[70%] flex place-content-center place-items-center">
                  <h1 className="text-md font-semibold">{item.typename}</h1>
                </div>
            
                {/* Remove Icon - Positioned top-right */}
                <div className="absolute top-0 right-0 p-2">
                   {
                    item.isAdded&& <IoIosRemoveCircle  className="cursor-pointer w-6 h-6 bg-red-600 text-red flex items-center justify-center rounded-full" onClick={() => {
                      if (providerInfo?.id) {
                        removeService(item.typeid,providerInfo?.id,"road")
                      }
                    }}/>
                   }

                </div>
              </div>
            
              {/* Bottom Section */}
              <div className="w-[100%] h-[50px] flex place-content-end pb-6 pr-2">
                {!item.isAdded ? (
                  <button
                    className="w-[40%] bg-orange h-[30px] mt-1 rounded-md font-semibold"
                    onClick={() => {
                      AddGeneralOrRoadService(item.typeid, item.category);
                    }}
                  >
                    ADD
                  </button>
                ) : (
                  <SiTicktick className="text-2xl text-green-500" />
                )}
              </div>
            </div>
            
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddedServices;
