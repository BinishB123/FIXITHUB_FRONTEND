import { IoSend } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { getChatOfOneToOne } from "../../../services/user/userProfile";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { IChatingUser } from "../../../interfaces/chat";
import { RootState } from "../../../Redux/store/store";
import { useSocket } from "../../../context/socketioContext";

export function ChatComponenet() {
  const v = new Date();

  const { socket } = useSocket();
  const messagedivref = useRef<HTMLDivElement>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState<string>("");
  const [typing, setTyping] = useState<{
    typer: "user" | "provider";
    indicate: "typing...." | null;
  }>({ typer: "user", indicate: null });
  const [chatConverstaion, setChatConverstaion] = useState<IChatingUser | null>(
    null
  );
  const [online, setOnline] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    getChatOfOneToOne(params.chatid + "").then((response: any) => {
      setChatConverstaion(response.data.data);
      socket?.emit("oppositeGuysIsInOnlineOrNot", {
        userId: params.providerid,
        emitTo: userInfo?.id,
        whom:"user"
      });
    });
    socket?.on("isOnline", (response) => {
      setOnline(response.online);
    });
    socket?.on("userOffline", (response) => {
      if (params.providerid === response.id) {
        setOnline(response.online);
      }
    });
    socket?.emit("join-chat", params.chatid);

    socket?.on("receivemessage", (response) => {
    
     
     if (response.response.sender==="provider") {
      socket.emit("updateMessageseen",{messageId:response.response._id})
     }
        
      
      
      setChatConverstaion((prev) => {
        if (prev && prev._id === response.response.chatId) {
          return {
            ...prev,
            messages: [...(prev.messages || []), response.response],
          };
        }
        return prev;
      });
      
    });

    socket?.on("typing", (response) => {
      if (response.typer === "provider") {
        setTyping({ typer: response.typer, indicate: "typing...." });
        setTimeout(() => {
          setTyping({ typer: "user", indicate: null });
        }, 5000);
      }
    });

    socket?.on("setup", (response) => {
      if (response.id === params.providerid) {
        setOnline(true);
      }
    });

    return () => {
      socket?.off("receivemessage");
      socket?.off("join-chat");
      socket?.off("typing");
      socket?.off("isOnline");
      socket?.off("userOffline");
      socket?.off("setup");
    };
  }, [socket]);

  useEffect(() => {
    if (messagedivref.current) {
      messagedivref.current.scrollTop = messagedivref.current.scrollHeight;
    }
  }, [chatConverstaion?.messages]);

  const sendMessage = (
    sender: string,
    chatId: string,
    message: string,
    recieverId: string
  ) => {
    if (!message.trim()) return;
    const messageDetails = {
      sender: sender,
      chatId: chatId,
      message: message,
      recieverId: recieverId,
    };
    socket?.emit("send-message", messageDetails);
    setMessage("");
  };

  const typingIndicator = () => {
    socket?.emit("isTyping", { typer: "user", chatid: params.chatid });
  };

  const callProvider = () => {};

  return (
    <>
      <div className="w-[100%] md:w-[80%] h-[600px]  flex space-x-1">
        {/* chat listing */}
        <div className=" hidden w-[40%] h-[600px] animate-fadeInDownBig bg-banner-gray rounded-md flex flex-col items-center s ">
          <div className="w-[90%] h-[80px]   border-b-2 place-items-center">
            <h1 className="text-md font-dm font-medium text-center text-white mt-4">
              Chat With Provider
            </h1>
            <div className="h-[32px] w-[100%] flex justify-between">
              <input
                type="text"
                className="h-[32px] w-[90%] rounded-sm text-white text-sm font-sm font-semibold bg-banner-gray outline-none"
                placeholder="Search with Provider Name.."
                name=""
                id=""
              />
              {/* <MdCancel className="text-2xl text-gray-800 cursor-pointer"  onClick={()=>{
               
            }}/> */}
            </div>
          </div>
          <div className=" flex flex-col w-[90%] h-[530px] mt-3 space-y-2 overflow-y-scroll scrollbar-hide">
            {/* {chats.map((data, index) => (
            <div
              // onClick={() => onClickAChat(data.provider._id, data._id)}
              key={index}
              className="w-[100%] h-[60px] bg-red-500 space-x-2 flex flex-shrink-0  hover:bg-slate-900 rounded-sm cursor-pointer"
            > <div className="w-[17%]  rounded-full overflow-hidden flex items-center justify-center">
                <img src={data.provider.logoUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="w-[60%] flex flex-col">
                <div className="w-[100%] h-[30px] ">
                  <h1 className="truncate text-white">{data.provider.workshopName}</h1>
                </div>
                <div className="w-[100%] h-[30px]  ">
                  <p className=" truncate text-sm text-white">{data.newMessage?.message}</p>
                </div>

              </div>
              <div className="w-[20%] ">
                <p className="text-sm text-white tracking-tighter">{`${v.getHours()} : ${v.getMinutes()} ${v.getHours() < 12 ? "AM" : "PM"}`}</p>
              </div>
            </div>

          ))} */}
          </div>
        </div>
        {/*  end chat listing */}
        <div className="w-[100%] md:w-[60%] h-[600px]  flex flex-col animate-fadeInDownBig">
          <div className="w-[100%] h-[80px] bg-red-500 space-x-2 flex flex-shrink-0 bg-banner-gray    rounded-sm cursor-pointer">
            {" "}
            <div className="w-[10%] ml-2 h-[55px] mt-3  rounded-full  overflow-hidden flex items-center justify-center">
              <img
                src={chatConverstaion?.provider.logoUrl}
                alt=""
                className="w-[90%] h-[90%] object-cover"
              />
            </div>
            <div className="w-[60%] flex flex-col">
              <div className="w-[100%] h-[30px] ">
                <h1 className="truncate text-white mt-3">
                  {chatConverstaion?.provider.workshopName}
                </h1>
              </div>
              <div className="w-[100%] h-[80px]">
                {online === true ? (
                  <h1 className="truncate text-green-500 text-sm mt-3 animate-pulse  ">
                    {online && !typing.indicate
                      ? "online"
                      : typing.indicate &&
                        typing.typer === "provider" &&
                        typing.indicate}
                  </h1>
                ) : (
                  <h1 className="truncate text-gray-400 text-sm mt-3 animate-pulse  ">
                    Offline
                  </h1>
                )}
              </div>
            </div>
            <div className="w-[30%]  flex justify-center items-center">
              <MdOutlineCall
                className="text-2xl text-blue-500"
                onClick={() => {
                  callProvider();
                }}
              />
            </div>
          </div>
          <div className="w-[100%] h-[570px] ">
            <div className="w-[100%] flex justify-center  bg-gradient-to-b from-gray-950 h-[470px] ">
              <div
                ref={messagedivref}
                className="w-[90%] h-[460px] overflow-y-scroll scrollbar-hide mt-2 space-y-3"
              >
                {chatConverstaion?.messages &&
                  chatConverstaion?.messages.map((data, index) => (
                    <>
                      {data.sender !== "user" ? (
                        <div
                          key={index}
                          className="w-[100%] flex justify-start"
                        >
                          <div className="w-[60%] h-[]  bg-banner-gray rounded-md ">
                            <p className=" text-white break-words text-sm text-start ml-2 mt-1 mb-2 font-medium rounded-md">
                              {data.message}
                            </p>
                            <p className="text-end text-sm text-white mr-3 tracking-tighter">
                              {`${new Date(data.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[100%] flex justify-end">
                          <div className="w-[60%] h-[]  bg-brown  rounded-md ">
                            <p className=" text-white break-words text-sm text-start ml-2 mt-1 mb-2 font-medium rounded-md">
                              {data.message}
                            </p>
                            <p className="text-end text-sm text-white mr-3 tracking-tighter">
                              {`${new Date(data.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
              </div>
            </div>
            <div className="w-[100%] h-[50px]   flex space-x-6 ">
              <input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  typingIndicator();
                }}
                maxLength={151}
                className="w-[100%] text-white pl-3 bg-banner-gray h-[40px] rounded-md "
                placeholder="Type a message"
                type="text"
                name=""
                id=""
              />
              <IoSend
                className="text-orange text-4xl"
                onClick={() => {
                  if (chatConverstaion) {
                    sendMessage(
                      "user",
                      chatConverstaion?._id + "",
                      message,
                      chatConverstaion?.provider._id
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
