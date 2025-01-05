import { useEffect, useState } from "react";
import user from "../../assets/user.png";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "../../Redux/store/store";
import { getFeedBacks, like, replyService } from "../../services/provider/providerBookings";
import { reviewDatas } from "../../interfaces/providerServiceBooking";
import { IoMdClose } from "react-icons/io";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ViewFeeBackComponent() {
    const { providerInfo } = useSelector((state: RootState) => state.provider);
    const [reviews, setReviews] = useState<reviewDatas[] | []>([]);
    const [reviewData,setReviewData] = useState<reviewDatas|null>(null)
    const [viewData,setViewData] = useState<boolean>(false)
    const [replytext,setReplyText] = useState<string>('')
    const [reply,setReply] = useState<boolean>(false)
    useEffect(() => {
        if (providerInfo) {
            getFeedBacks(providerInfo.id).then((response: any) => {
                setReviews(response.data.feedBacks);
            });
        }
    }, []);

    const onClickLike = (id:string,status:boolean)=>{
        like(id,status).then((response)=>{
            const updatedData = reviews.map((data)=>{
                if (data._id===id) {
                    return {...data,like:status}
                }
                return data
            })

            setReviews(updatedData)
        })

    }

    const onClickReply =(id:string)=>{
        replyService(id,replytext).then((response)=>{
            if (reviewData) {
                setReviewData({...reviewData,reply:replytext})
            }
            const updatedData = reviews.map((data)=>{
                if (data._id===id) {
                    return {...data,reply:replytext}
                }
                return data
            })

            setReviews(updatedData)
            setReply(false)
               
        })
    }

    return (
        <>
            <div className="w-[80%] h-[auto]  mt-5">
                <div className="w-[90%] h-[630px] ">
                    <div className="w-[100%] h-[40px]">
                        <h1 className="text-gray-200 text-md font-dm pl-4">
                            FeedBacks By Customers
                        </h1>
                    </div>
                    <div className="w-full h-[590px]  flex flex-wrap gap-3 p-4 overflow-y-scroll scrollbar-hide">
                        {reviews.map((reviewData, index) => (
                            <div
                                className={`w-[40%] h-[200px] rounded-md space-x-2 bg-banner-gray animate-fadeInDownBig   ${index === 0 ? "" : ""
                                    } flex `}
                            >
                                <div className="w-[15%] h-full  flex   ">
                                    <img
                                        src={
                                            reviewData.user.logoUrl ? reviewData.user.logoUrl : user
                                        }
                                        alt="Image"
                                        className="w-12 h-12 mt-2 ml-2 rounded-full"
                                    />
                                </div>

                                <div className="w-[70%] h-full  flex flex-col">
                                    <div className="w-[100%] h-[50px] flex  items-center justify-between">
                                        <h1 className="text-white">{reviewData.user.name}</h1>
                                        {!reviewData.like?<FaRegHeart className="text-white cursor-pointer" onClick={()=>{
                                            onClickLike(reviewData._id,true)
                                        }} />:
                                        <FaHeart className="text-red cursor-pointer" onClick={()=>{
                                            onClickLike(reviewData._id,false)
                                        }} />

                                        }
                                    </div>
                                    <div className="w-[100%] h-[100px]  flex justify-center items-center ">
                                        <h1 className="text-gray-300 text-sm text-start">
                                            {reviewData.opinion}
                                        </h1>
                                    </div>
                                    <div className="w-[100%] h-[35px] flex justify-end ">
                                        <button className="w-[50%] h-[30px] bg-orange rounded-sm text-white" onClick={()=>{
                                            setReviewData(reviewData)
                                            setViewData(true)
                                        }}>
                                            view in Detail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {viewData&&<motion.div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition delay-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-transparent rounded-lg w-[95%] md:w-[60%] h-auto flex flex-col items-center ">
                     
                    
                          <div className="w-[100%] h-[600px] bg-banner-gray flex flex-col items-center justify-center space-y-3">
                            <div className="w-[100%] h-[50px]  flex justify-end text-white">
                              <IoMdClose
                                className="text-4xl text-end bg-red cursor-pointer"
                                onClick={() => {
                                  setViewData(false);
                                }}
                              />
                            </div>
                            <div className="w-[90%] h-[250px]  flex flex-col space-y-4  justify-center items-center ">
                              <div className="w-[100%] h-[100px] space-y-1 ">
                                <h1 className="text-lg text-white">{`Review By ${reviewData?.user.name} `} </h1>
                               
                                  <h1 className="text-md text-start text-gray-300">
                                    {reviewData?.opinion}
                                  </h1> 
                                 
                                
                              </div>
                              <hr className="bg-gray-500 w-[100%]" />
                              <div className="w-[60%] h-[100px] space-y-1 ">
                               {!reply?
                                   (!reviewData?.reply)&&  <h1 className="text-md text-gray-400 cursor-pointer" onClick={()=>{
                                    setReply(true)
                                 }}>{`Reply  :: `}</h1>  :
                                 <div className="w-[100%] h-[100px] flex ">
                                 <input type="text" value={replytext} onChange={(e)=>setReplyText(e.target.value)} className="w-[70%] h-[50px] bg-transparent border-b-2 outline-none text-white" placeholder="type your reply " maxLength={150} name="" id="" />
                                 <div className="flex w-[20%]  place-content-center space-x-2">
                                   <h1 className="text-md text-gray-400 pt-8 cursor-pointer"  onClick={()=>{
                                   if (reviewData) {
                                    onClickReply(reviewData?._id)
                                   }
                                   }}>post</h1>
                                   <h1 className="text-md text-gray-400 pt-8 cursor-pointer" onClick={()=>{
                                    setReply(false)
                                   }}>cancel</h1>


                                 </div>
                                 </div>
                               }
                                <h1 className="text-sm text-start text-gray-300">
                                  {reviewData?.reply ?`Your Reply :  ${ reviewData?.reply}` :"....." }
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
                                       
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                    
                     
                    </div>
                  </motion.div>
            }
        </>
      
    );
}

export default ViewFeeBackComponent;
