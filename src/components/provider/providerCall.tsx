// import img from "../../assets/workshops.png";
import { BsFillMicMuteFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
import { AiFillAudio } from "react-icons/ai";
import { useSocket } from "../../context/socketioContext";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
// import { setTime } from "react-datepicker/dist/date_utils";


const servers: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:bn-turn2.xirsys.com"] },
    {
      username:
        "o8_s2lbVKiqxpNa5Ntw5kG_h7g9zYj-AbK49RHWtnH26b_exoUgSkD5MrvzAQkpMAAAAAGcrwiBzYXJhdGhz",
      credential: "90886c3c-9c74-11ef-8e6e-0242ac140004",
      urls: [
        "turn:bn-turn2.xirsys.com:80?transport=udp",
        "turn:bn-turn2.xirsys.com:3478?transport=udp",
        "turn:bn-turn2.xirsys.com:80?transport=tcp",
        "turn:bn-turn2.xirsys.com:3478?transport=tcp",
        "turns:bn-turn2.xirsys.com:443?transport=tcp",
        "turns:bn-turn2.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};


function ProviderCallComponent() {
  const localStream = useRef<MediaStream | undefined>();
  const providerSideVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConection = useRef<RTCPeerConnection | null>(null)
  const [mute,setMute] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [calleData, setCalleData] = useState<{ name: string | null, logoUrl: string | null }>({ name: null, logoUrl: null })
  const location = useLocation()
  const { providerInfo } = useSelector((state: RootState) => state.provider)
  const [callingState, setCallingState] = useState<
    "calling" | "connected" | "callEnded" | "disconnected" | "failed To Connect" | "Rejected" | "trying To connect"
  >("trying To connect"); const params = useParams();
  const navigate = useNavigate()
  const { socket } = useSocket()

  useEffect(() => {
    if (!location.state) {
      socket?.emit("getChatidForCreatingRoom", { userid: params.userid, providerid: providerInfo?.id, getter: providerInfo?.id, whomTocall: params.userid, callerData: { workshopName: providerInfo?.workshopname, logoUrl: providerInfo?.logoUrl } })
      socket?.emit("getcalleData", { id: providerInfo?.id, calle: "user", calleid: params.userid })
    }
  }, []);



  useEffect(() => {
    if (!peerConection.current) {
      peerConection.current = new RTCPeerConnection(servers)
    }
    socket?.on("rejected", () => {
      setCallingState("Rejected")
      setTimeout(() => {
        navigate(-1)
      }, 3000)
    })
    socket?.on("callaccepted", callaccepted)
    socket?.on("recieveAnswer", recieveAnswer)
    socket?.on("sendOfferToReceiver", sendOfferToReceiver)
    socket?.on("recieveCandidate", recieveCandidate)
    socket?.on("recieveCalleData", ({ data }) => {
      setCalleData({ name: data.name, logoUrl: data.logoUrl })
    })


    peerConection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (videoRef.current) {
        console.log(remoteStream);
        
        videoRef.current.srcObject = remoteStream;
      }
    };


    if (peerConection.current) {
      peerConection.current.oniceconnectionstatechange = () => {
        if (peerConection.current?.iceConnectionState === 'disconnected') {
          setCallingState(peerConection.current?.iceConnectionState)
        }
        if (peerConection.current?.iceConnectionState === "connected") {
          setCallingState(peerConection.current.iceConnectionState)
        }
      };
    }
    return () => {
      if (peerConection.current) {
        peerConection.current.close();
        peerConection.current = null;
      }

      socket?.off("sendOfferToReceiver")
      socket?.off("recieveCandidate")
      socket?.off("callaccepted")
      socket?.off("callaccepted")
      socket?.off("recieveCalleData")
      socket?.off("rejected")

    }
  }, [socket])

  const sendOfferToReceiver = async (response: any) => {

    const offer = new RTCSessionDescription(response.offer);
    await peerConection.current?.setRemoteDescription(offer);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Callee: Local media stream obtained:", stream);
        localStream.current = stream;
        if (providerSideVideoRef.current) {
          providerSideVideoRef.current.srcObject = stream;
        }


        stream.getTracks().forEach((track) => {
          peerConection.current?.addTrack(track, stream);
        });


        peerConection.current?.createAnswer().then(async (answer) => {
          await peerConection.current?.setLocalDescription(answer);
          socket?.emit("answer", { to: params.userid, answer: answer });
        }).catch((error) => {
          console.error("Error creating SDP answer:", error);
        });

      }).catch((error) => {
        console.error("Error acquiring media stream:", error);
      });


    if (peerConection.current) {
      peerConection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("sendCandidate", { event: event.candidate, recieverid: params.userid });
        } else {
          console.log("Callee: All ICE candidates sent.");
        }
      };


      peerConection.current.ontrack = (event) => {
        if (providerSideVideoRef.current) {
          providerSideVideoRef.current.srcObject = event.streams[0];
        }
      };
    }


  }



  const recieveCandidate = async (response: any) => {
    await peerConection.current?.addIceCandidate(new RTCIceCandidate(response.event))
    setCallingState("connected")

  }


  const cutTheCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = undefined;
    }
  
    if (providerSideVideoRef.current) {
      providerSideVideoRef.current.srcObject = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  
    
    if (peerConection.current) {
      peerConection.current.close();
      peerConection.current = null;
    }
     
    setTimeout(() => {
      navigate(-1)
    }, 2000)
  }



  const callaccepted = async (response: any) => {

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      localStream.current = stream;
      if (providerSideVideoRef.current) {
        providerSideVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerConection.current?.addTrack(track, stream);
      });

      // peerConection.current?.addTransceiver('video', { direction: 'recvonly' });

      peerConection.current?.createOffer().then((offer) => {
        socket?.emit('sendOffer', { receiver: params.userid, offer: offer, sendid: providerInfo?.id, callerData: response.callerData });
        return peerConection.current?.setLocalDescription(offer);
      }).then(() => {
        if (peerConection.current) {
          peerConection.current.onicecandidate = (event) => {
            if (event.candidate) {
              socket?.emit("sendCandidate", { event: event.candidate, recieverid: params.userid });
            } else {
              console.log("Caller: All ICE candidates sent.");
            }
          };
        }
      }).catch((error) => {
        console.error("Error during offer creation or setting local description:", error);
      });
    }).catch((error) => {
      console.error("Error obtaining local media stream:", error);
    });

  }


  const recieveAnswer = (response: any) => {
    if (peerConection.current) {
      peerConection.current.setRemoteDescription(response.answer)
    }
    setCallingState("connected")

  }


  const onClickMuteUnmute = ()=>{
    if (localStream.current) {
      const isNowMuted = !mute;
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !isNowMuted;
      });
      
    setMute(!mute)

  }
}



  return (
    <>
      <div className="w-[100%] h-[742px] bg-black flex justify-center items-center">
        <div className=" w-[100%] md:w-[60%] h-full md:h-[520px] bg-banner-gray flex flex-col justify-between rounded-sm">
          <div className="w-[100%] h-[300px]  flex flex-col justify-center items-center mt-4">
            <div className="w-[50%] h-[150px]  flex justify-between items-center bg-red overflow-hidden">
              {/* <h1>provider side video</h1> */}
         
              <video ref={videoRef} autoPlay playsInline className="w-[40%] h-full  bg-green-700 hidden" />

              <img
                src={calleData.logoUrl+""}
                alt=""
                className="object-cover rounded-full w-full h-full"
              />
            </div>
            <div className="w-[30%] h-[100px]  space-y-2">
              <h5 className="text-center text-white font-dm text-md pt-1">
                {calleData.name}
              </h5>
              <h5 className="text-center text-gray-400 animate-pulse flex justify-center gap-2 font-dm font-semibold">
                {callingState === "calling" ? "calling..." : callingState}
              </h5>
            </div>
          </div>
          <div className="w-[100%] h-[100px] flex justify-center items-center cursor-pointer">
            <div className=" w-[100%] md:w-[50%] h-[100px]   flex justify-center space-x-4">
            <div className="w-[20%]  md:w-[10%] h-[50px] bg-gray-600 rounded-full flex justify-center items-center" onClick={onClickMuteUnmute}>
                {
                  !mute?<AiFillAudio className="text-2xl " />:<BsFillMicMuteFill className="text-xl"  />

                }
              </div>
              <div className="  w-[20%] md:w-[10%] h-[50px] shadow-md hover:shadow-[0_10px_20px_rgba(255,_0,_0,_0.7)] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  bg-red rounded-full flex justify-center items-center animate-fadeInDownBig" onClick={() => {
                  cutTheCall()
                }}>
                {" "}
                <MdCallEnd className="text-2xl text-white"  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderCallComponent;
