import adminSettings from "../../assets/adminsetting.png";
import settings from "../../api/admin";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { axiosInstance } from "../../api/common";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Brand, FileDetails, generalServices, roadServices } from "../../interfaces/admin";
import { addBrandApi, addVehicleTypeApi, addServicesApi, addNewSubTypeApi, deleteSubTypeApi } from "../../services/admin/settings";



function AdminSettingsComponent() {
    const navigate = useNavigate();
    const inputref = useRef<HTMLInputElement | null>(null)
    const roadref = useRef<HTMLInputElement | null>(null)
    const [isModal, setModalState] = useState<boolean>(false);
    const [vehicletype, setType] = useState<number>(0);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [generalServices, setGeneralservices] = useState<generalServices[]>([]);
    const [roadServices, setroadServices] = useState<roadServices[]>([]);
    const [roadAssistance, setRoadAssistance] = useState<string>("");
    const [brand, setBrand] = useState<string>("");
    const [generalService, setService] = useState<string>("");
    const [file, setFile] = useState<string | File | any>("");
    const [subTypes, setSubTypes] = useState<{ id: string | null; subtype: { _id: string; type: string }[] | []; }>({ id: null, subtype: [] });
    const [newSubtype, setNewSubType] = useState<string>("");

    useEffect(() => {
        axiosInstance
            .get(settings.getSettingsDatas)
            .then((Response) => {
                setBrands(Response.data.brands);
                setGeneralservices(Response.data.generalservices);
                setroadServices(Response.data.roadAssistance);
            })
            .catch((error) => {
                const statusCode = error.response?.status;
                if (statusCode === 403) {
                    localStorage.removeItem("isAdmin");
                    toast.error("Session Expired please login");
                    navigate("/admin/signin", { replace: true });
                    return;
                }
            });
    }, []);

    const addBrand = async () => {
        const regex = /\d/;
        if (!brand.trim()) {
            toast.warning("Please Enter a Brand name");
            return;
        }
        if (regex.test(brand)) {
            toast.warning("Please add a proper Brand Name without numbers");
            return;
        }

        const { error, success, statusCode } = await addBrandApi(brand);
        if (success) {
            toast.success("Brand created");
            setBrands([{ brand }, ...brands]);
            setBrand("")
        } else {
            setBrand("")
            handleApiError(error, statusCode);
        }
    };

    const addvehicleType = async () => {
        if (!vehicletype) {
            toast.error("Please Enter the Type");
            return;
        }
        if (![2, 4].includes(vehicletype)) {
            toast.warning("Only 2 wheeler and 4 wheeler are allowed");
            return;
        }

        const { error, success, statusCode } = await addVehicleTypeApi(vehicletype);
        if (success) {
            toast.success("Vehicle Type created");
        } else {
            handleApiError(error, statusCode);
        }
    };

    const addServices = async (Category: string) => {
        const formData = new FormData();
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
           toast.error("Add Image Type Only")
            return 
        }

        if (!file) {
            toast.warning("Please add an icon image for user experience");
            return;
        }
        if (Category === "road") {
            const checker = roadServices.find((item) => {
                return item.serviceType.toLowerCase().trim() === roadAssistance.toLowerCase().trim()
            })
            if (checker) {
                setRoadAssistance("")
                setFile(null)
                if (inputref.current) {
                    inputref.current.value = "";
                }
                return toast.warning("Service already exist")
            }
        } else {
            const checker = generalServices.find((item) => {
                return item.serviceType.toLowerCase().trim() === generalService.toLowerCase().trim()
            })
            setService("")
            if (checker) {
                setFile("")
                if (inputref.current) {
                    inputref.current.value = "";
                }
                return toast.warning("Service already exist")
            }
        }
        const regex = /\d/;
        if (Category === "road" && regex.test(roadAssistance)) {
            toast.warning("Please add a proper service name for road assistances");
            return;
        } else if (regex.test(generalService)) {
            toast.warning("Please add a proper general service name");
            return;
        }

        formData.append("files", file);
        formData.append("category", Category);
        Category === "road"
            ? formData.append("servicetype", roadAssistance)
            : formData.append("servicetype", generalService);

        const { created, error, success, statusCode } = await addServicesApi(formData);


        if (success) {
            toast.success("Service Added");
            setFile("")
            setService("")
            setRoadAssistance("")
            if (inputref.current) {
                inputref.current.value = "";
            }
            if (roadref.current) {
                roadref.current.value = ""
            }
            if (Category === "general") {
                setRoadAssistance("")
                setGeneralservices([...(generalServices || []), created]);
            } else if (Category === "road") {
                setRoadAssistance("")
                setroadServices([...(roadServices || []), created]);
            }
        
        
        } else {
            handleApiError(error, statusCode);
        }
    };

    const addNewSubType = async () => {
        const newSubtypeTrimmed = newSubtype.trim();
        const checker = subTypes.subtype.some(sub => sub.type === newSubtypeTrimmed);
        if (checker) {
            return;
        }

        const { error, success, statusCode, updatedData } = await addNewSubTypeApi(subTypes.id + "", newSubtypeTrimmed);
        const _id: string = updatedData._id

        if (success) {
            toast.success("Subtype added");
            setSubTypes(prev => ({
                id: prev.id,
                subtype: [...prev.subtype, { _id: _id, type: newSubtypeTrimmed }],
            }));
            setNewSubType("");
            const updatedData = generalServices?.map(item => {
                if (item._id === subTypes.id) {
                    return {
                        ...item,
                        subTypes: [...item.subTypes, { _id, type: newSubtypeTrimmed }],
                    };
                }
                return item;
            }) || [];
            setGeneralservices([...updatedData]);
        } else {
            handleApiError(error, statusCode);
        }
    };

    const deleteSubtype = async (typeToDelete: string) => {
        const { error, success, statusCode } = await deleteSubTypeApi(subTypes.id + "", typeToDelete);
        if (success) {
            toast.success("Subtype deleted");

            const filteredData = subTypes.subtype.filter((item) => item._id !== typeToDelete);
            setSubTypes({ id: subTypes.id, subtype: [...filteredData] });

            const updatedData = generalServices?.map((item) => {
                if (item._id === subTypes.id) {
                    return { ...item, subTypes: filteredData };
                }
                return item;
            });
            setGeneralservices([...updatedData]);
        } else {
            handleApiError(error, statusCode);
        }
    };

    // Helper function to handle error and session expiration
    const handleApiError = (error: any, statusCode: number) => {
        if (statusCode === 403) {
            localStorage.removeItem("isAdmin");
            toast.error("Session Expired. Please log in again.");
            navigate("/admin/signin", { replace: true });
        } else if (error?.response) {
            toast.warning(error.response.data.message);
        }
    };


    return (
        <>
            <div className="h-[450%] w-[100%]  md:h-[200%] flex-col bg-black">
                <div className="h-[20%] md:h-[20%] w-[100%] flex place-content-center">
                    <div className="h-[100%] w-[95%] bg-gradient-to-b from-gray-900 rounded-md mt-3 flex  flex-col md:flex-row">
                        <div className="h-[50%] md:h-[100%]  w-[100%] md:w-[50%] flex place-content-center mt-6">
                            <img
                                src={adminSettings}
                                width={320}
                                className="animate-fadeInDownBig"
                            />
                        </div>
                        <div className="h-[50%] w-[100%]  md:h-[100%] mt-0 md:w-[50%] flex place-items-center place-content-center ">
                            <h1 className="text-white font-dm text-md  md:text-4xl font-semibold hover:scale-95 hover:duration-1000 hover:delay-1000 animate-fadeInUp">
                                "Shape the Future of Service – Add Brands, Categories, and
                                Types."
                            </h1>
                        </div>
                    </div>
                </div>
                {/* adding brand div start */}
                <div className="w-[100%] h-[15%]  flex flex-col items-center mt-28  ">
                    <div className="w-[95%] h-[50%] overflow-x-scroll scrollbar-hide relative">
                        <div className="flex animate-marquee whitespace-nowrap justify-start">
                            {/* Original content */}
                            {brands.map((items, index) => (
                                <div
                                    key={index}
                                    className="min-w-[300px] bg-banner-gray h-[90px] flex flex-col place-content-center mx-2"
                                >
                                    <h1 className="text-white text-center text-2xl font-dm font-semibold">
                                        {items.brand} {/* Access the brand property */}
                                    </h1>
                                </div>
                            ))}

                            {/* Duplicate content for seamless looping */}
                        </div>
                    </div>
                    <div className="w-[95%] h-[50%]   flex ">
                        <div className="w-[50%] h-[100%] ">
                            <div className="w-[100%] h-[50%] ">
                                <h1 className="text-xl font-dm font-semibold w-[80%] text-center border-gray-500  border-b-2 text-white">
                                    {" "}
                                    ADD SUPPORTED BRANDS
                                </h1>
                            </div>
                            <div className="w-[100%] h-[50%] flex space-x-5 ">
                                <div className=" w-[70%] md:w-[70%] h-[100%]">
                                    <input
                                        value={brand}
                                        className="bg-banner-gray h-[80%] w-[100%] text-center text-white rounded-md text-sm font-dm font-light tracking-wider"
                                        type="text"
                                        placeholder="BRAND NAME"
                                        onChange={(e) => {
                                            setBrand(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="w-[30%] md:w-[20%] h-[100%] flex ">
                                    <button
                                        className="hover:scale-150- w-[95%] md:w-[40%] h-[80%] bg-orange hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 rounded-md text-white font-semibold"
                                        onClick={() => {
                                            addBrand();
                                        }}
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-[50%] h-[100%] ">
                            <div className="w-[70%] h-[50%] ">
                                <h1 className="text-xl font-dm font-semibold text-white text-center border-gray-500  border-b-2">
                                    {" "}
                                    ADD vehicle TYPE SUPPORTED
                                </h1>
                            </div>
                            <div className="w-[100%] h-[50%] flex space-x-5 ">
                                <div className=" w-[70%] md:w-[30%] h-[100%]">
                                    <input
                                        className="bg-banner-gray h-[80%] w-[100%] text-center text-white rounded-md text-sm font-dm font-light tracking-wider"
                                        type="number"
                                        placeholder="vehicle TYPE"
                                        value={vehicletype}
                                        onChange={(e) => {
                                            setType(parseInt(e.target.value));
                                        }}
                                    />
                                </div>
                                <div className="w-[30%] md:w-[20%] h-[100%] flex ">
                                    <button
                                        className="hover:scale-150- w-[95%] md:w-[40%] h-[80%] bg-orange hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 rounded-md text-white font-semibold"
                                        onClick={() => {
                                            addvehicleType();
                                        }}
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* adding brand div end */}
                {/* General service start */}
                <div className="w-[100%] h-[50%]  flex flex-col items-center mt-11">
                    <div className="w-[95%] h-[10%]  ">
                        <h1 className="text-2xl font-dm font-semibold text-center border-gray-500  border-b-2 text-white ">
                            General Services
                        </h1>
                    </div>
                    <div className="w-[95%] h-[90%] grid grid-cols-2 md:grid-cols-3 gap-2 space-y-3 overflow-y-scroll rounded-md scrollbar-hide animate-fadeInDownBig">
                        {generalServices?.map((items, index) => (
                            <div
                                key={index}
                                className="w-[85%] h-[150px] bg-banner-gray flex  items-center justify-center text-white rounded-md  p-2  "
                            >
                                <div className=" w-[80%] h-[100%] flex justify-center items-center">
                                    <div className="w-[30%] h-[80%] ml-3 ">
                                        <img src={items.imageUrl} alt="" />
                                    </div>
                                    <div className="w-[70%] h-[50%] overflow-hidden">
                                        <h1 className="text-center font-bold text-sm ">
                                            {items.serviceType}
                                        </h1>
                                    </div>
                                    <div></div>
                                </div>
                                <div className=" w-[20%] h-[100%] flex flex-col items-baseline place-content-end">
                                    <button
                                        className="w-[94%] h-[20%] bg-orange mb-6 rounded-md mr-5"
                                        onClick={() => {
                                            setModalState(true);
                                            setSubTypes({
                                                id: items._id,
                                                subtype: [...items.subTypes],
                                            });
                                        }}
                                    >
                                        view
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-[14%] w-[100%]  mt-7 flex flex-col items-center space-y-2">
                        <div className="h-[40%] w-[95%]">
                            <h1 className="font-dm font-semibold text-lg text-white">
                                ADD MORE GENERAL SERVICES
                            </h1>
                        </div>
                        <div className="h-[60%] w-[95%]  flex justify-start space-x-4">
                            <input
                                className="w-[25%]  text-center text-white text-sm rounded-sm bg-banner-gray "
                                type="text"
                                value={generalService}
                                placeholder="ADD MORE GENERAL SERVICE"
                                onChange={(e) => {
                                    setService(e.target.value);
                                }}
                            />
                            <input
                                ref={inputref}
                                type="file"
                                accept="image/png, image/jpeg"
                                className="text-white mt-3 "
                                placeholder="add icon"
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] ? e.target.files[0] : "");
                                    
                                }}
                                name="images"
                            />
                            <button
                                className="w-[10%] bg-orange rounded-md text-white"
                                onClick={() => {
                                    addServices("general");
                                }}
                            >
                                ADD
                            </button>
                        </div>
                    </div>

                    <hr className="border-t-1 border-gray-600 w-[95%] mt-11"></hr>
                </div>
                {/* General service div end */}
                {/* road assistance start */}
                <div className="w-[100%] h-[50%]  flex flex-col items-center mt-11 bg-black">
                    <div className="w-[95%] h-[10%]  ">
                        <h1 className="text-2xl font-dm font-semibold text-white text-center border-gray-500  border-b-2 ">
                            Road Assistance
                        </h1>
                    </div>
                    <div className="w-[95%] h-[90%] grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-scroll rounded-md scrollbar-hide">
                        {roadServices.map((item, index) => (
                            <div
                                key={index}
                                className="w-[85%] h-[150px] bg-banner-gray flex  items-center justify-center text-white rounded-md  p-2 "
                            >
                                <div className=" w-[80%] h-[100%] flex justify-center items-center">
                                    <div className="w-[30%] h-[80%] ml-3 ">
                                        <img src={item.imageUrl} alt="" />
                                    </div>
                                    <div className="w-[70%] h-[50%] overflow-hidden">
                                        <h1 className="text-center font-bold text-sm ">
                                            {item.serviceType}
                                        </h1>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-[14%] w-[100%]  mt-7 flex flex-col items-center space-y-2">
                        <div className="h-[40%] w-[95%]">
                            <h1 className="font-dm font-semibold text-lg text-white">
                                ADD MORE ROAD ASSISTANCE
                            </h1>
                        </div>
                        <div className="h-[60%] w-[95%]  flex justify-start space-x-4">
                            <input
                                className="w-[25%]  text-center text-white rounded-sm bg-banner-gray"
                                type="text"
                                placeholder="ADD MORE  ROAD ASSISTANCE"
                                // roadAssistance,setRoadAssistance
                                value={roadAssistance}
                                onChange={(e) => {
                                    setRoadAssistance(e.target.value);
                                }}
                            />
                            <input
                                ref={roadref}
                                type="file"
                                accept="image/png, image/jpeg"
                                className="text-white mt-3 "
                                placeholder="add icon"
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] ? e.target.files[0] : "");
                                }}
                                name="images"
                            />
                            <button
                                className="w-[10%] bg-orange rounded-md text-white"
                                onClick={() => {
                                    addServices("road");
                                }}
                            >
                                ADD
                            </button>
                        </div>
                    </div>

                    <hr className="border-t-1 border-white w-[95%] mt-11"></hr>
                </div>
                {/* road assistance end */}
            </div>
            {isModal && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center transition delay-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-banner-gray rounded-lg w-[95%] md:w-[30%] h-[80%] flex flex-col items-center ">
                        <div className="w-[100%] h-[10%] mt-0  flex justify-end">
                            <div className=" w-[90%] mt-4">
                                <h1 className="text-white text-center text-xl font-semibold">
                                    Inspection
                                </h1>
                            </div>
                            <IoMdClose
                                className="text-3xl text-red-600 bg-white text-red rounded-sm cursor-pointer "
                                onClick={() => {
                                    setModalState(false);
                                }}
                            />
                        </div>

                        <div className="w-[95%] h-[70%] flex-col space-y-2 overflow-y-scroll scrollbar-hide">
                            {subTypes.subtype.length > 0 ? (
                                subTypes.subtype.map((item, index) => (
                                    <div
                                        key={index}
                                        className="w-[95%] h-[8%] flex justify-center  items-center space-x-30 animate-backInDown "
                                    >
                                        <div className="w-[70%] h-[20px] place-content-center">
                                            <h1 className="text-white text-sm font-semibold  ">
                                                {item.type}
                                            </h1>
                                        </div>
                                        <div className="" >
                                            <MdDelete
                                                className="text-orange text-xl cursor-pointer"
                                                onClick={() => {
                                                    deleteSubtype(item._id);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1 className="text-center text-orange text-xl font-semibold tracking-widest animate-bounce">
                                    No types added
                                </h1>
                            )}
                        </div>

                        <div className="w-[80%] h-[10%] bg-opacity-75 flex justify-between mt-6">
                            <input
                                type="text"
                                className="w-[65%] bg-slate-500 text-white h-[60%] rounded-sm text-sm text-center"
                                placeholder="ADD MORE SERVICE"
                                value={newSubtype}
                                onChange={(e) => {
                                    setNewSubType(e.target.value);
                                }}
                            />
                            <button
                                className="w-[30%] bg-orange h-[60%] rounded-md text-white"
                                onClick={addNewSubType}
                            >
                                ADD
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default AdminSettingsComponent;
