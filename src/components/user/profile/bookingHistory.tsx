import { useEffect, useRef, useState } from "react";
import { IoIosChatboxes, IoMdClose, IoMdDoneAll } from "react-icons/io";
import { MdDelete, MdOutlineCall } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";
import {
  addReviewApi,
  confirmPayment,
  deleteImageservice,
  editReviewService,
  getreviewdetails,
  getServiceHistory,
} from "../../../services/user/userServiceBooking";
import { IoAddOutline } from "react-icons/io5";
import {
  ResponsegetBookingGreaterThanTodaysDate,
  responseGetReviewDetails,
} from "../../../interfaces/userInterface";
import { StatusColors, statusColors } from "../../../constants/colors";
import { createReport, getChatId } from "../../../services/user/userProfile";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/socketioContext";
import { toast } from "sonner";
import { GrFormNext } from "react-icons/gr";
import { motion } from "framer-motion";
import { CiEdit } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoReport } from "react-icons/go";

export function BookingHistory() {
  const [editreviewText, setEditreviewText] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [pageNumber, setPageNumber] = useState(0);
  const [report, setReport] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [startIndexAndEndIndex, setStartIndexAndEndIndex] = useState<{
    start: number;
    end: number;
  }>({ start: 0, end: 5 });
  const navigate = useNavigate();
  const [serviceHistory, setHistory] = useState<
    ResponsegetBookingGreaterThanTodaysDate[] | []
  >([]);
  const [singleService, setSinglesService] =
    useState<ResponsegetBookingGreaterThanTodaysDate | null>(null);
  const [upanddown, setupanddown] = useState(false);
  const [indext, setindex] = useState<number | undefined>(undefined);
  const { socket } = useSocket();
  const [addReview, setAddReview] = useState<boolean>(false);
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const [viewReview, setViewReview] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>("");
  const provideridRef = useRef<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<null | responseGetReviewDetails>(
    null
  );
  const [reportText, setReportText] = useState<string>("");

  useEffect(() => {
    if (userInfo?.id) {
      getServiceHistory(
        userInfo.id,
        startIndexAndEndIndex.start,
        startIndexAndEndIndex.end
      )
        .then((response: any) => {
          setHistory(response.data.data);
          console.log("response.data.data", response.data.data);

          setTotalCount(response.data.count);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleFullPayment = (docid: string, selectedService: any) => {
    confirmPayment(docid, selectedService).then((Response: any) => {
      window.location.href = Response.data.url;
    });
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

  useEffect(() => {
    socket?.on("checkedUserIsOnlineOrNot", (response) => {
      if (!response.success) {
        toast.warning("User is Offline");
      } else {
        navigate(`/call/${provideridRef.current}`);
      }
    });

    return () => {
      socket?.off("checkedUserIsOnlineOrNot");
    };
  }, [socket]);

  const onClickPagination = (start: number) => {
    if (userInfo?.id) {
      getServiceHistory(userInfo.id, start, startIndexAndEndIndex.end)
        .then((response: any) => {
          setHistory(response.data.data);
          setTotalCount(response.data.count);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const checkUserisOnlinOrNotBeforeCalling = (providerid: string) => {
    socket?.emit("checkOnlineorNot", {
      userid: userInfo?.id,
      providerid: providerid,
      checker: "user",
    });
  };

  const reviewImagesPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        toast.error("Add Image Type Only");
        return;
      }
      setImagePreview([
        ...imagePreview,
        URL.createObjectURL(e.target.files[0]),
      ]);
      setOriginalFiles([...originalFiles, e.target.files[0]]);
    }
  };

  const AddReview = () => {
    setLoading(true);
    const data = new FormData();
    data.append("userId", userInfo?.id + "");
    data.append("providerId", singleService?.provider._id + "");
    data.append("serviceId", singleService?.servicename._id + "");
    data.append("bookingId", singleService?._id + "");
    data.append("review", reviewText);
    originalFiles.forEach((file) => {
      data.append(`images`, file);
    });
    addReviewApi(data).then((response: any) => {
      const updateData = serviceHistory.map((da) => {
        if (da._id + "" === "" + singleService?._id) {
          return { ...da, review: response.data.review._id };
        }
        return da;
      });
      if (updateData) {
        setHistory(updateData);
      }
      setLoading(false);
      setAddReview(false);
      toast.success("Review Added");
      console.log(response);
    });
  };

  const onClickGetReviewDetails = (bookingid: string) => {
    getreviewdetails(bookingid)
      .then((response: any) => {
        console.log(response);

        setReviewData(response.data.ReviewData);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
        setLoading(false);
        setViewReview(false);
      });
  };

  const removeAnImage = (ind: number) => {
    const removed = imagePreview.filter((image, index) => {
      if (index !== ind) {
        return image;
      }
    });
    const removedOrginales = originalFiles.filter((file, index) => {
      if (index !== ind) {
        return file;
      }
    });
    setImagePreview(removed);
    setOriginalFiles(removedOrginales);
  };

  const ediTReview = (id: string) => {
    console.log(
      reviewText.trim().toLowerCase(),
      reviewData?.opinion.trim().toLocaleLowerCase()
    );

    if (reviewData) {
      if (
        reviewText.trim() === "" ||
        reviewText.trim().toLowerCase() ===
        reviewData?.opinion.trim().toLocaleLowerCase()
      ) {
        window.alert();
        return;
      }
      editReviewService(id, reviewText).then((response) => {
        setReviewData({ ...reviewData, opinion: reviewText });
        setEditreviewText(false);
        console.log(response);
      });
    }
  };

  const deleteanimage = (id: string, url: string) => {
    if (reviewData) {
      deleteImageservice(id, url).then((response) => {
        const images = reviewData.images.filter((data) => {
          if (data.url !== url) {
            return data;
          }
        });
        setReviewData({ ...reviewData, images: images });
      });
    }
  };

  const OnClickReport = () => {
    if (reportText.trim() === "") {
      return toast.warning("Please Say Your issue");
    }
    if (userInfo && singleService) {
      const data = {
        userId: userInfo?.id,
        providerId: singleService?.provider._id,
        BookingId: singleService?._id,
        reportText,
        report: reportText,
      };
      createReport({ ...data }).then((response) => {
        toast.success("Reported your Issue");
        setReport(false);
        setSinglesService(null);
      }).catch((error)=>{
        console.log(error);
        
      });
    }
  };

  return (
    <>
      <div className="w-[80%] h-[600px]  flex flex-col ml-2 space-y-2">
        <div className="w-[100%] h-[40px] bg-banner-gray rounded-sm">
          <h1 className="text-white font-medium font-dm ml-2 mt-2">
            Service History
          </h1>
        </div>
        <div className="w-[100%]  h-[550px] space-y-1 overflow-y-scroll scrollbar-hide ">
          {serviceHistory.map((item, index) => (
            <>
              <div
                key={index}
                className="w-[100%] h-[70px] bg-banner-gray rounded-md animate-fadeInDownBig text-white  flex space-x-1 "
              >
                <div className="w-[20%] h-[100%] flex flex-col justify-center items-center  ">
                  <h1 className="text-white">{item.provider.workshopName}</h1>
                </div>
                <div className="w-[30%] h-[100%] text-white flex justify-center items-center ">
                  <h1>{` Service ${item.servicename.serviceType}`}</h1>
                </div>
                <div className="w-[10%] h-[100%] text-white flex justify-center items-center ">
                  <h1
                    className={`text-sm ${statusColors[item.status as keyof StatusColors]
                      }`}
                  >{` ${item.status}`}</h1>
                </div>
                <div className="w-[15%] h-[100%] flex justify-center items-center  flex-col ">
                  <p>{`x${item.selectedService.length}`}</p>
                  <h1>{`Total: ${item.selectedService.reduce(
                    (acc, cuu) => acc + cuu.price,
                    0
                  )}`}</h1>
                </div>
                <div className="w-[20%] h-[100%] flex justify-center items-center ">
                  <p>{new Date(item.bookeddate.date).toDateString()}</p>
                </div>
                <div className="w-[15%] h-[100%] flex cursor-pointer justify-evenly items-center  space-x-3 ">
                  <IoIosChatboxes
                    onClick={() => {
                      if (userInfo?.id) {
                        chatCreation(item.provider._id, userInfo?.id);
                      }
                    }}
                    className="text-orange text-2xl"
                  />
                  <MdOutlineCall
                    className="text-2xl text-blue-500"
                    onClick={() => {
                      provideridRef.current = item.provider._id;
                      checkUserisOnlinOrNotBeforeCalling(item.provider._id);
                    }}
                  />
                </div>
                <div className="w-[7%] h-[100%] flex flex-col justify-center items-center ">
                  <FaCaretDown
                    className={`text-2xl text-orange cursor-pointer ${!upanddown &&
                      indext === index &&
                      "rotate-360 transition ease-linear"
                      } ${upanddown &&
                      indext === index &&
                      "rotate-180 transition ease-linear"
                      } `}
                    onClick={() => {
                      setupanddown(!upanddown);

                      if (upanddown) {
                        setindex(undefined);
                      } else {
                        setindex(index);
                      }
                    }}
                  />
                </div>
                <div className="w-[3%] h-full cursor-pointer flex justify-center items-center  ">
                  {item.status === "completed" && (
                    <GoReport
                      className="text-yellow-500  text-xl pr-1"
                      onClick={() => {
                        setSinglesService(item);
                        setReport(true);
                      }}
                    />
                  )}
                </div>
              </div>
              <div
                className={`w-full h-[200px] rounded-md bg-banner-gray flex ${upanddown && indext === index
                    ? "animate-fadeInDownBig transition ease-linear"
                    : "hidden"
                  }`}
              >
                {/* Left Section */}
                <div className="w-[40%] h-full p-4 text-white flex flex-col text-sm  space-y-2">
                  <h1>{`Vehicle Type: ${item.vechileType} `}</h1>
                  <h1>{`Fuel Type: ${item.vechileDetails.fueltype}`}</h1>
                  <h1>{`Kilometer: ${item.vechileDetails.kilometer}`}</h1>
                  {item.status === "completed" &&
                    item.paymentStatus !== "paid" && (
                      <div className="w-[60%] h-[100px] flex justify-center items-end">
                        <button
                          className="w-[100%] h-[40px] bg-blue-600 rounded-md"
                          onClick={() => {
                            handleFullPayment(item._id, item.selectedService);
                          }}
                        >{`pay ${Math.abs(
                          item.selectedService.reduce(
                            (acc, cuu) => acc + cuu.price,
                            0
                          ) - item.advanceAmount
                        )}`}</button>
                      </div>
                    )}

                  {item.status === "completed" &&
                    item.paymentStatus === "paid" && (
                      <div className="w-[60%] h-[100px] flex justify-center items-end">
                        {item.review ? (
                          // If the review exists, allow editing or viewing the review
                          <button
                            className="w-[100%] h-[40px] bg-gray-800 text-sm text-gray-400 rounded-md font-dm font-semibold"
                            onClick={() => {
                              setAddReview(false);
                              setViewReview(true);
                              setLoading(true);
                              if (item.review) {
                                onClickGetReviewDetails(item.review);
                              }
                            }}
                          >
                            Edit Or View Review
                          </button>
                        ) : (
                          // If no review exists, allow adding a review
                          <button
                            className="w-[100%] h-[40px] bg-gray-800 text-sm text-gray-400 rounded-md font-dm font-semibold"
                            onClick={() => {
                              setAddReview(true);
                              setSinglesService(item);
                            }}
                          >
                            Add Review
                          </button>
                        )}
                      </div>
                    )}
                </div>

                {/* Center Section */}
                <div className="w-[35%] h-full p-4 space-y-3 text-white">
                  {item.status === "cancelled" && (
                    <>
                      {" "}
                      <h1
                        className={`${item.advance === true && item.status == "cancelled"
                            ? "text-blue-400"
                            : "text-green-400"
                          } text-sm flex items-center space-x-2 `}
                      >
                        {`Advance Fee :  ${item.advance === true && item.status == "cancelled"
                            ? "Refunded"
                            : "paid"
                          }`}
                      </h1>
                    </>
                  )}
                  {item.status !== "cancelled" && (
                    <h1
                      className={`${item.paymentStatus === "paid"
                          ? "text-green-500"
                          : "text-red"
                        }`}
                    >{`Full Payment Status: ${item.paymentStatus} `}</h1>
                  )}
                  <h1
                    className={statusColors[item.status as keyof StatusColors]}
                  >{`Service Status: ${item.status}`}</h1>
                </div>

                {/* Right Section */}
                <div className="w-[35%] h-full p-4 overflow-y-scroll scrollbar-hide">
                  <dl>
                    {item.selectedService.map((service, idx) => (
                      <li key={idx} className="text-white  text-sm">
                        {`${service.serviceName}: ${service.price} Rs`}
                      </li>
                    ))}
                  </dl>
                </div>
              </div>
            </>
          ))}
        </div>
        <div className="w-[100%] h-[50px]  flex justify-center items-start space-x-2 cursor-pointer rounded-md">
          <div
            className={`w-[4%] h-[40px] bg-orange ${pageNumber + 1 > 1 ? "flex" : "hidden"
              } items-center justify-center rounded-md`}
            onClick={() => {
              onClickPagination(
                startIndexAndEndIndex.start < 0
                  ? 0
                  : startIndexAndEndIndex.start - 5
              );

              setStartIndexAndEndIndex({
                start:
                  startIndexAndEndIndex.start < 0
                    ? 0
                    : startIndexAndEndIndex.start - 5,
                end:
                  startIndexAndEndIndex.end < 5
                    ? 5
                    : startIndexAndEndIndex.end - 5,
              });

              setPageNumber(pageNumber <= 0 ? 0 : pageNumber - 1);
            }}
          >
            {pageNumber + 1 > 1 && (
              <GrFormNext className="text-xl text-white rotate-180" />
            )}
          </div>
          <div className="w-[4%] h-[40px] bg-orange flex items-center justify-center rounded-md">
            <h1 className="text-white text-center">{pageNumber + 1}</h1>
          </div>
          <div
            className={`w-[4%] h-[40px] bg-orange flex ${startIndexAndEndIndex.start + 10 > Math.ceil(totalCount / 5) * 5
                ? "hidden"
                : "flex"
              } items-center justify-center rounded-md`}
            onClick={() => {
              onClickPagination(startIndexAndEndIndex.start + 5);
              setStartIndexAndEndIndex({
                start: startIndexAndEndIndex.start + 5,
                end: startIndexAndEndIndex.end * (pageNumber + 1),
              });
              setPageNumber(pageNumber + 1);
            }}
          >
            <GrFormNext className="text-xl text-white" />
          </div>
        </div>
      </div>
      {addReview && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition delay-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-transparent rounded-lg w-[95%] md:w-[60%] h-[80%] flex flex-col items-center ">
            <div className="w-[100%] h-[10%] mt-0  flex justify-end">
              <div className=" w-[90%] mt-4"></div>
            </div>
            <div className="w-[100%] h-[350px] flex-col space-y-5 scrollbar-hide ">
              <div className="w-[100%] h-[70px] space-y-2  ">
                <h1 className="text-white font-semibold text-lg pl-2">
                  ADD REVIEW
                </h1>
                <input
                  onChange={(e) => {
                    setReviewText(e.target.value);
                  }}
                  value={reviewText}
                  maxLength={150}
                  type="text"
                  placeholder="Type your review"
                  className="w-[100%] h-[50px] text-white pl-4 font-dm font-light border-2 border-gray-900  rounded-sm bg-banner-gray"
                />
              </div>
              <div className="w-[100%] h-[270px] bg-banner-gray flex justify-center items-center  rounded-md border-2 border-gray-900">
                <div className="w-[95%] h-[200px] rounded flex justify-evenly  ">
                  {imagePreview.map((image, index) => (
                    <>
                      <div className="w-[200px] h-[240px] flex flex-col space-y-2">
                        <div
                          key={index}
                          className="w-full h-[180px] flex items-center justify-center border border-dashed"
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <button
                          onClick={() => removeAnImage(index)}
                          className=" outline-dashed outline-red h-[40px] text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ))}
                  <div
                    className={`w-[200px] h-full outline-dashed outline-neutral-400 rounded-sm   cursor-pointer ${imagePreview.length === 4 && "hidden"
                      }`}
                    onClick={() => {
                      if (imageInputRef.current) {
                        imageInputRef.current.click();
                      }
                    }}
                  >
                    <input
                      name="images"
                      type="file"
                      className="hidden"
                      ref={imageInputRef}
                      onChange={(e) => {
                        reviewImagesPreview(e);
                      }}
                      accept="image/png, image/jpeg"
                    />
                    <div className="w-[100%] h-[150px] flex justify-center items-center">
                      <IoAddOutline className="text-center text-9xl text-gray-600" />
                    </div>
                    <h1 className="text-center text-gray-400">Add Image</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[95%]  h-auto bg-opacity-75 flex justify-center items-center space-x-52 mt-6">
              <button
                className="w-[40%] h-[50px] bg-green-500 text-white rounded-md"
                onClick={() => {
                  AddReview();
                  // if (imgfile) {
                  //   changeOrAddLogo(imgfile)
                  // }
                }}
              >
                Done
              </button>
              <button
                className="w-[40%] h-[50px] bg-red text-white rounded-md"
                onClick={() => {
                  // setModalState(false);
                  // if (imageInputref.current?.value) {
                  //   imageInputref.current.value = ""
                  // }
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {viewReview && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition delay-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-transparent rounded-lg w-[95%] md:w-[60%] h-auto flex flex-col items-center ">
            {!loading ? (
              <>
                <div className="w-[100%] h-[600px] bg-banner-gray flex flex-col items-center justify-center space-y-3">
                  <div className="w-[100%] h-[50px]  flex justify-end text-white">
                    <IoMdClose
                      className="text-4xl text-end bg-red cursor-pointer"
                      onClick={() => {
                        setViewReview(false);
                      }}
                    />
                  </div>
                  <div className="w-[90%] h-[250px]  flex flex-col space-y-4  justify-center items-center ">
                    <div className="w-[100%] h-[100px] space-y-1 ">
                      <h1 className="text-lg text-white">{`Your Review `} </h1>
                      {!editreviewText ? (
                        <h1 className="text-md text-start text-gray-300">
                          {reviewData?.opinion}
                        </h1>
                      ) : (
                        <input
                          onChange={(e) => {
                            setReviewText(e.target.value);
                          }}
                          value={reviewText}
                          maxLength={150}
                          type="text"
                          placeholder="Type your review"
                          className="w-[100%] h-[50px] text-white pl-4 font-dm font-light border-2 border-gray-900  rounded-sm bg-banner-gray"
                        />
                      )}

                      {!editreviewText ? (
                        <CiEdit
                          className=" text-2xl text-blue-300 cursor-pointer"
                          onClick={() => {
                            if (reviewData) {
                              setReviewText(reviewData?.opinion);
                              setEditreviewText(true);
                            }
                          }}
                        />
                      ) : (
                        <IoMdDoneAll
                          className="text-2xl text-blue-300 cursor-pointer"
                          onClick={() => {
                            if (reviewData) {
                              ediTReview(reviewData?._id);
                            }
                          }}
                        />
                      )}
                    </div>
                    <hr className="bg-gray-500 w-[100%]" />
                    <div className="w-[60%] h-[100px] space-y-1 ">
                      <h1 className="text-md text-white">{`Reply from ${reviewData?.provider.workshopName} : `}</h1>
                      <h1 className="text-sm text-start text-gray-300">
                        {reviewData?.reply ? "....." : reviewData?.reply}
                      </h1>
                    </div>
                  </div>
                  <div className="w-[90%] h-[300px] flex  items-center space-x-2">
                    {reviewData?.images.map((data, index) => (
                      <>
                        <div className="w-[200px] h-[240px]  space-y-2">
                          <div
                            key={index}
                            className="w-full h-[180px] flex items-center justify-center  border-2 relative"
                          >
                            <img
                              src={data.url}
                              alt={`Preview ${index + 1}`}
                              className="object-contain w-full h-full"
                            />
                            <div className="absolute w-[100%] top-0 left-44  cursor-pointer ">
                              <MdDelete
                                className="text-xl text-red"
                                onClick={() => {
                                  deleteanimage(reviewData._id, data.url);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-[100%] h-[700px]  flex justify-center items-center ">
                  <AiOutlineLoading3Quarters className="text-center text-4xl text-white animate-spin" />
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
      {addReview && loading && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition delay-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-transparent rounded-lg w-[95%] md:w-[60%] h-auto flex flex-col items-center ">
              <div className="w-[100%] h-[700px]  flex justify-center items-center ">
                <AiOutlineLoading3Quarters className="text-center text-4xl text-white animate-spin" />
              </div>
            </div>
          </motion.div>
        </>
      )}

      {report && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition delay-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-transparent  w-[95%] md:w-[60%] h-auto flex flex-col items-center  ">
              <div className="w-[70%] h-[450px] bg-banner-gray rounded-md flex flex-col justify-center items-center space-y-2">
                <div className="w-[90%] h-[50px] ">
                  <h1 className="text-md text-gray-200 font-dm">
                    Report About Service
                  </h1>
                </div>
                <div className="w-[90%] h-[300px] border-2 rounded-md ">
                  <textarea
                    value={reportText}
                    onChange={(e) => {
                      setReportText(e.target.value);
                    }}
                    maxLength={518}
                    className="w-[100%] h-full bg-banner-gray pl-3 pt-2 text-white"
                    placeholder="Reason......"
                  />
                </div>
                <div className="w-[90%] h-[50px] flex justify-between  ">
                  <button
                    className="w-[40%] h-full bg-blue-400 text-white rounded-md"
                    onClick={OnClickReport}
                  >
                    Report
                  </button>
                  <button
                    className="w-[40%] h-full bg-red text-white rounded-md"
                    onClick={() => {
                      setReport(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
