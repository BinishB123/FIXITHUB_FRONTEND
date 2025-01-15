import { FaMapLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { BsChatRightDotsFill } from "react-icons/bs";
import { GiConfirmed } from "react-icons/gi";
import user from "../../assets/userico.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/common";
import { services } from "../../api/user";
import { reviewDatas, Workshop } from "../../interfaces/userInterface";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import { getChatId } from "../../services/user/userProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { AiFillCaretRight } from "react-icons/ai";
import { FaCaretLeft } from "react-icons/fa";
import { getFeedBacks } from "../../services/user/userServiceBooking";

function ShopProfile() {
    const location = useLocation();
    const [reviewUpdater, setReviewUpdater] = useState<number>(3);
    const [animationClass, setAnimationClass] = useState("");
    const [reviews,setreviews] = useState<reviewDatas[]|[]>([])
    const [workshopDetails, setWorkshopDetails] = useState<Workshop | null>(null);
    const [isModal, setIsModal] = useState<boolean>(false);
    const { userInfo } = useSelector((state: RootState) => state.user);
    const [selectService, setselectedService] = useState<
        | {
            typeid: string;
            typename: string;
            startingprice: number;
            isAdded: boolean;
        }[]
        | []
    >([]);

    const navigate = useNavigate();



    useEffect(() => {
        
        getFeedBacks(location.state.data.seviceId,reviewUpdater).then((response:any)=>{
            setreviews(response.data.feedBacks)
            console.log(response);
            
        })
       
        setAnimationClass("animate-fadeInDownBig");

        const timeout = setTimeout(() => {
            setAnimationClass("");
        }, 1000);

        return () => clearTimeout(timeout);
    }, [reviewUpdater]);

    useEffect(() => {
        setAnimationClass("animate-fadeInDownBig");
        if (!location.state) {
            navigate("/services");
        } else {
            const storedService = localStorage.getItem("servicesSelected");
            let data:
                | {
                    typeid: string;
                    typename: string;
                    startingprice: number;
                    isAdded: boolean;
                }[]
                | undefined;

            if (storedService) {
                data = JSON.parse(storedService) as {
                    typeid: string;
                    typename: string;
                    startingprice: number;
                    isAdded: boolean;
                }[];
                setselectedService(data);
            }

            axiosInstance
                .get(
                    `${services.getshopdetail}?serviceId=${location.state.data.seviceId}&vehicleType=${location.state.data.vehicleType}&providerId=${location.state.providerId}`
                )
                .then((response) => {
                    const { shopDetail } = response.data;
                    setWorkshopDetails(() => {
                        const updatedServices = shopDetail.services.map((service: any) => {
                            const matchedService = data?.find(
                                (stored: {
                                    typeid: string;
                                    typename: string;
                                    startingprice: number;
                                    isAdded: boolean;
                                }) => stored.typeid === service.typeid
                            );
                            return matchedService
                                ? { ...service, ...matchedService }
                                : service;
                        });
                        return {
                            ...shopDetail,
                            services: updatedServices,
                        };
                    });
                })
                .catch((error) => {
                    console.error("Error fetching services:", error);
                });
        }
    }, []);

    const add = (id: string) => {
        const updated =
            workshopDetails?.services.map((item) => {
                if (item.typeid === id) {
                    return { ...item, isAdded: true };
                }
                return item;
            }) || [];

        if (updated.length > 0) {
            setWorkshopDetails((prev) => {
                if (!prev) return null;

                const newWorkshopDetails = {
                    ...prev,
                    services: updated,
                };

                localStorage.setItem("servicesSelected", JSON.stringify(updated));
                const filtered = updated.filter((item) => item.isAdded === true);
                setselectedService(filtered);
                return newWorkshopDetails;
            });
        }
    };

    const remove = (id: string) => {
        const updated =
            workshopDetails?.services.map((item) => {
                if (item.typeid === id) {
                    return { ...item, isAdded: false };
                }
                return item;
            }) || [];

        if (updated?.length > 0) {
            setWorkshopDetails((prev) => {
                if (!prev) return null;

                return {
                    ...prev,
                    services: updated,
                };
            });
            localStorage.setItem("servicesSelected", JSON.stringify(updated));
            const filtered = updated.filter((item) => item.isAdded === true);
            setselectedService(filtered);
        }
    };

    const chatCreation = (providerId: string, userId: string) => {
        getChatId(providerId, userId)
            .then((Response: any) => {
                navigate(`/profile/chat/${Response.data.id}/${providerId}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };



    

    return (
        <>
            <div className="bg-black h-auto w-[100%] flex flex-col items-center">
                <div className="rounded-md bg-gradient-to-b from-gray-950 h-[600px] md:h-[250px] w-[95%] flex flex-col md:space-y-0 animate-fadeInDownBig">
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row md:space-x-1 h-[100px] md:h-[200px]">
                        {/* Logo Section */}
                        <div className="h-[100px] md:h-full w-full md:w-[20%] flex md:flex-row flex-col items-center justify-center">
                            <img
                                src={workshopDetails?.logoUrl}
                                alt=""
                                className="h-[100px] w-[100px] md:h-[80%] md:w-[80%] object-contain rounded-full"
                            />
                        </div>

                        {/* Workshop Details */}
                        <div className="h-[100px] md:h-full w-full md:w-[80%] flex flex-col justify-evenly px-4 md:px-2">
                            <h1 className="text-lg md:text-xl font-semibold text-white">
                                {workshopDetails?.workshopName}
                            </h1>
                            {/* Desktop Description */}
                            <div className="hidden md:flex h-[160px] text-md text-gray-500">
                                Welcome to [Workshop Name], your trusted partner for all
                                automotive care and repair needs. We take pride in providing
                                high-quality service for all vehicle types. From diagnostics and
                                repairs to custom modifications, we ensure your car's longevity
                                and safety on the road. Welcome to [Workshop Name], your trusted
                                partner for all automotive care and repair needs. We take pride
                                in providing high-quality service for all vehicle types. From
                                diagnostics and repairs to custom modifications, we ensure your
                                car's longevity and safety on the road. Welcome to [Workshop
                                Name], your trusted partner for all automotive care and repair
                                needs. We take pride in providing high-quality service for all
                                vehicle types. From diagnostics and repairs to custom
                                modifications, we ensure your car's longevity and safety on the
                                road.
                            </div>
                        </div>
                    </div>

                    {/* Mobile Description */}
                    <div className="h-[200p] mt-8 block md:hidden px-4 text-sm text-gray-500">
                        Welcome to [Workshop Name], your trusted partner for all automotive
                        care and repair needs. We take pride in providing high-quality
                        service for all vehicle types. From diagnostics and repairs to
                        custom modifications, we ensure your car's longevity and safety on
                        the road. Welcome to [Workshop Name], your trusted partner for all
                        automotive care and repair needs. We take pride in providing
                        high-quality service for all vehicle types. From diagnostics and
                        repairs to custom modifications, we ensure your car's longevity and
                        safety on the road. Welcome to [Workshop Name], your trusted partner
                        for all automotive care and repair needs. We take pride in providing
                        high-quality service for all vehicle types. From diagnostics and
                        repairs to custom modifications, we ensure your car's longevity and
                        safety on the road.
                    </div>

                    {/* Contact and Action Buttons */}
                    <div className="w-full h-[200px] md:h-[40px] flex flex-col md:flex-row md:justify-between mt-4">
                        {/* Contact Details */}
                        <div className="w-full md:w-[70%] flex flex-col md:flex-row md:space-x-2">
                            {/* Email */}
                            <div className="flex items-center space-x-1 px-2">
                                <MdEmail className="text-2xl text-red" />
                                <h1 className="text-gray-300">Email:</h1>
                                <h1 className="text-white">{workshopDetails?.email}</h1>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center space-x-1 px-2">
                                <IoCallOutline className="text-2xl text-blue-500" />
                                <h1 className="text-gray-300">Phone:</h1>
                                <h1 className="text-white">{workshopDetails?.mobile}</h1>
                            </div>

                            <div className="flex w-[60%]  items-center space-x-1 px-2">
                                <FaMapLocationDot className="text-2xl text-orange" />
                                <h1 className="text-gray-300">Location:</h1>
                                <h1 className="text-white text-sm truncate">
                                    {workshopDetails?.workshopDetails?.address}
                                </h1>
                            </div>
                        </div>

                        <div className="w-full md:w-[30%] flex justify-around md:justify-end space-x-2 mt-4 md:mt-0">
                            <button
                                className="w-[40%] h- bg-orange text-white text-md font-semibold rounded-md flex items-center justify-center space-x-1"
                                onClick={() => {
                                    if (userInfo) {
                                        chatCreation(location.state.providerId, userInfo?.id);
                                    }
                                }}
                            >
                                <span>Chat</span>
                                <BsChatRightDotsFill className="text-xl" />
                            </button>
                            <button
                                className="w-[40%] bg-orange text-white text-md font-semibold rounded-md flex items-center justify-center space-x-1"
                                onClick={() => {
                                    if (selectService.length > 0) {
                                        setIsModal(true);
                                    } else {
                                        toast.warning("Select Services");
                                    }
                                }}
                            >
                                <span>Book</span>
                                <GiConfirmed />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-[100%] h-auto  flex flex-col justify-center items-center">
                    <div className="w-[95%] h-[700px]  flex flex-col">
                        <div className="w-[100%] h-[50px] ">
                            <h1 className="text-center text-white text-2xl font-dm font-semibold">
                                {`Our ${workshopDetails?.selectedService.type} Related Services`}
                            </h1>
                        </div>
                        <div className="w-[100%] h-auto flex flex-wrap space-x-4 justify-center ">
                            {workshopDetails?.services.map((item, index) => (
                                <div
                                    key={index}
                                    className={`w-[40%] md:w-[25%] h-[140px] bg-banner-gray flex flex-col justify-center items-center space-x-1 rounded-md ${index === 0 ? "ml-4" : ""
                                        } animate-fadeInDownBig`}
                                >
                                    <div className="w-[95%] h-[90%] flex flex-col items-center justify-center ">
                                        <div className="h-[70%] w-[95%] flex flex-col  items-center justify-center  ">
                                            <h1 className="text-center text-sm font-semibold text-white break-words w-[100%]  overflow-hidden ">
                                                {item.typename}
                                            </h1>
                                            <h1 className="text-center text-sm font-semibold text-white">{`Starting Price : ${item.startingprice}`}</h1>
                                        </div>
                                    </div>
                                    <div className="h-[30%] w-[100%] flex justify-center items-center">
                                        {item.isAdded ? (
                                            <button
                                                className="w-[50%] md:w-[30%]  h-[80%] rounded-sm text-white bg-red mb-3 "
                                                onClick={() => {
                                                    remove(item.typeid);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                className="w-[40%] md:w-[30%] h-[80%] rounded-sm text-white bg-orange mb-3 "
                                                onClick={() => {
                                                    add(item.typeid);
                                                }}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-[100%] h-[800px] md:h-[500px]  flex flex-col items-center space-y-2 ">
                    <div className="w-[96%] md:w-[55%] h-[40px] md:h-[40px] bg-banner-gray ">
                        <h1 className="text-lg  md:text-2xl font-semibold text-center text-orange">
                            What Our Customers Says
                        </h1>
                    </div>
                    <div className="w-[95%] h-[400px] flex   space-x-2 justify-center items-center">
                        <div className="w-[10%] h-full flex justify-center items-center ">
                            <FaCaretLeft
                                onClick={() => {
                                    setReviewUpdater(reviewUpdater <= 3 ? 3 : reviewUpdater - 3);
                                }}
                                className="text-6xl text-orange cursor-pointer hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 animate-bounce"
                            />
                        </div>
                        {reviews.map(
                            (reviewData, index) =>
                                index <= 2 && (
                                    <div
                                        className={`${animationClass} w-[30%] h-[300px] rounded-md space-x-2 bg-banner-gray    ${index === 0 ? "" : ""
                                            } flex `}
                                    >
                                        <div className="w-[15%] h-full  flex   ">
                                            <img
                                                src={
                                                    reviewData.user.logoUrl ? reviewData.user.logoUrl :
                                                    user
                                                }
                                                alt="Image"
                                                className="w-12 h-12 mt-2 ml-2 rounded-full"
                                            />
                                        </div>

                                        <div className="w-[70%] h-full  flex flex-col">
                                            <div className="w-[100%] h-[50px] flex  items-center justify-between">
                                                <h1 className="text-white">{reviewData.userId===userInfo?.id?"You":reviewData.user.name}</h1>
                                                {/* {!reviewData.like?<FaRegHeart className="text-white cursor-pointer" onClick={()=>{
                                            onClickLike(reviewData._id,true)
                                        }} />: */}
                                            </div>
                                            <div className="w-[100%] h-[200px]  flex justify-center items-center ">
                                                <h1 className="text-gray-300 text-sm text-start">
                                                    {reviewData.opinion}
                                                </h1>
                                            </div>
                                            <div className="w-[100%] h-[35px] flex justify-end items-end  ">
                                                <button
                                                    className="w-[50%] h-[30px] bg-orange rounded-sm text-white"
                                                    onClick={() => {
                                                        // setReviewData(reviewData)
                                                        // setViewData(true)
                                                    }}
                                                >
                                                    view in Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                        <div className="w-[10%] h-full flex justify-center items-center">
                            <AiFillCaretRight
                                onClick={() => {
                                    setReviewUpdater(reviewUpdater + 3);
                                }}
                                className="text-6xl text-orange  cursor-pointer hover:shadow-[0_10px_20px_rgba(255,_165,_0,_0.7)] transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 animate-bounce"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isModal && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center transition delay-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-banner-gray rounded-lg w-[95%] md:w-[45%] h-[400px] flex flex-col items-center justify-between">
                        <div className="w-[100%] h-[15%] mt-0   flex justify-end">
                            <div className=" w-[90%]  mt-4">
                                <h1 className="text-white text-center text-xl font-semibold">
                                    Terms & Conditions
                                </h1>
                            </div>
                            <IoMdClose
                                className="text-3xl text-red-600 bg-white text-red rounded-sm cursor-pointer "
                                onClick={() => {
                                    setIsModal(false);
                                }}
                            />
                        </div>

                        <div className="w-[95%] h-[70%] mt-4 flex items-center  flex-col  overflow-y-scroll  scrollbar-hide">
                            <div className="w-[90%] h-[300px]">
                                <dl className="text-white space-y-3 ">
                                    <li>
                                        <strong className="text-orange text-sm">
                                            Drop-Off Date
                                        </strong>
                                        : Vehicles must be dropped off on the booked date.
                                    </li>
                                    <li>
                                        <strong className="text-orange text-sm">
                                            Timely Pickup
                                        </strong>
                                        : Vehicles should be collected promptly after service.
                                    </li>
                                    <li>
                                        <strong className="text-orange text-sm">
                                            Personal Belongings
                                        </strong>
                                        : The service center is not liable for personal items left
                                        in the vehicle.
                                    </li>
                                    <li>
                                        <strong className="text-orange text-sm">
                                            Additional Services
                                        </strong>
                                        : Any extra services requested will be added to the final
                                        bill.
                                    </li>
                                    <li>
                                        <strong className="text-orange text-sm">
                                            Cancellation Fee
                                        </strong>
                                        : A booking fee of Rs. 1000 is non-refundable in the event
                                        of cancellation. If full payment has been made, Rs. 1000
                                        will be deducted from the total refund.
                                    </li>
                                </dl>
                            </div>
                        </div>

                        <div className="w-[80%] h-[30%] bg-opacity-75 flex justify-between items-start mt-6">
                            <button
                                className="w-[40%] h-[40%] outline-double bg-red outline-red-600 rounded-md text-white"
                                onClick={() => {
                                    setIsModal(false);
                                }}
                            >
                                cancel
                            </button>
                            <button
                                className="w-[40%] h-[40%] outline-double bg-green-400 outline-green-700 rounded-md  text-white"
                                onClick={() => {
                                    navigate("/services/confirmBooking", {
                                        state: {
                                            data: location.state.data,
                                            selectedServices: selectService,
                                            providerId: location.state.providerId,
                                        },
                                    });
                                }}
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default ShopProfile;
