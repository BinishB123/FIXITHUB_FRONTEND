import img from "../../assets/workshops.png";
import { BsFillMicMuteFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
import { AiFillAudio } from "react-icons/ai";
import { useSocket } from "../../context/socketioContext";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";


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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const params = useParams();

  const { socket } = useSocket()
  useEffect(() => {
    if (!peerConection.current) {
      peerConection.current = new RTCPeerConnection(servers)
    }
    socket?.on("sendOfferToReceiver",sendOfferToReceiver )
    socket?.on("recieveCandidate", recieveCandidate)

    console.log("peerConection.current?.connectionState",peerConection.current?.connectionState==="connected",peerConection.current?.connectionState);

      peerConection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (videoRef.current) {
        videoRef.current.srcObject = remoteStream;
      }
    };

    return () => {
      if (peerConection.current) {
        peerConection.current.close();
        peerConection.current = null;
      }
      
      socket?.off("sendOfferToReceiver")
      socket?.off("recieveCandidate")
    }
  }, [socket])


    const sendOfferToReceiver = async (response:any) => {
       const offer = new RTCSessionDescription(response.offer)
       await peerConection.current?.setRemoteDescription(offer);
       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (providerSideVideoRef.current) {
          providerSideVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => {
          peerConection.current?.addTrack(track, stream);
        });
      })
      .catch((error) => console.error("Error acquiring media stream:", error))
      const answer = await peerConection.current?.createAnswer();
      await peerConection.current?.setLocalDescription(answer);
      socket?.emit("answer", { to: params.userid, answer: answer })
      if (peerConection.current) {
         peerConection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("sendCandidate", { event: event.candidate, recieverid: params.userid });
        }
      }
    }
  }
  


  const recieveCandidate = async(response:any) => {
   await peerConection.current?.addIceCandidate(new RTCIceCandidate(response.event))
  } 
 

  return (
    <>
      <div className="w-[100%] h-[742px] bg-black flex justify-center items-center">
        <div className=" w-[100%] md:w-[60%] h-full md:h-[520px] bg-banner-gray flex flex-col justify-between rounded-sm">
          <div className="w-[100%] h-[300px]  flex flex-col justify-center items-center mt-4">
            <div className="w-[50%] h-[150px]  flex justify-between items-center bg-red overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-[40%] h-full bg-gray-800 " />
              <video ref={providerSideVideoRef} autoPlay playsInline className="w-[40%] h-full  bg-green-700" />

              {/* <img
                src={img}
                alt=""
                className="object-cover rounded-full w-full h-full"
              /> */}
            </div>
            <div className="w-[30%] h-[100px]  space-y-2">
              <h5 className="text-center text-white font-dm text-md pt-1">
                jesson Ok
              </h5>
              <h5 className="text-center text-gray-400 animate-pulse flex justify-center gap-2 font-dm font-semibold">
                Calling...
              </h5>
            </div>
          </div>
          <div className="w-[100%] h-[100px] flex justify-center items-center cursor-pointer">
            <div className=" w-[100%] md:w-[50%] h-[100px]   flex justify-center space-x-4">
              <div className="w-[20%] md:w-[10%] h-[50px] bg-gray-600 rounded-full flex justify-center items-center">
                <BsFillMicMuteFill className="text-xl" />
                <AiFillAudio className="text-2xl hidden" />
              </div>
              <div className="w-[20%] md:w-[10%] h-[50px] shadow-md hover:shadow-[0_10px_20px_rgba(255,_0,_0,_0.7)] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  bg-red rounded-full flex justify-center items-center animate-fadeInDownBig">
                {" "}
                <MdCallEnd className="text-2xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderCallComponent;
