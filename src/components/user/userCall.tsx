import img from "../../assets/workshops.png";
import { BsFillMicMuteFill } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useRef } from "react";
import { useSocket } from "../../context/socketioContext";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";



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


function UserCallComponent() {
  const { socket } = useSocket();
  const { userInfo } = useSelector((state: RootState) => state.user)
  const localStream = useRef<MediaStream | undefined>();
  const peerConection = useRef<RTCPeerConnection | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const params = useParams();

  useEffect(() => {
    socket?.emit("getChatidForCreatingRoom", { userid: userInfo?.id, providerid: params.providerid, getter: userInfo?.id, whomTocall: params.providerid })
  }, []);
 
  useEffect(() => {
   
    if (!peerConection.current) {
      peerConection.current = new RTCPeerConnection(servers);

    }
    socket?.on("callaccepted", callaccepted)
    socket?.on("recieveAnswer", recieveAnswer)
    socket?.on("recieveCandidate", recieveCandidate)
    peerConection.current.ontrack = (event) => {      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];

      }
    };

    return () => {
      if (peerConection.current) {
        peerConection.current.close();
        peerConection.current = null;
        
      }
      socket?.off("callaccepted")
      socket?.off("recieveAnswer")
      socket?.off("recieveCandidate")
    }

  }, [socket])


  const callaccepted = async (response: any) => {
    console.log(response);
    
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then((stream) => {

      localStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => {
        peerConection.current?.addTrack(track, stream)
      })
      peerConection.current?.addTransceiver('video', { direction: 'recvonly' });

      peerConection.current?.createOffer().then((offer) => {
        socket?.emit('sendOffer', { receiver: params.providerid, offer: offer, sendid: userInfo?.id })
        return peerConection.current?.setLocalDescription(offer)
      })

      if (peerConection.current) {
        peerConection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.emit("sendCandidate", { event: event.candidate, recieverid: params.providerid });
          }
        }
      }

    }).catch((error) => {
      console.log("error", error);

    })

  }


  const recieveAnswer = (response: any) => {
    if (peerConection.current) {
      peerConection.current.setRemoteDescription(response.answer)
    }

  }


  const recieveCandidate = async (response: any) => {
     await peerConection.current?.addIceCandidate(new RTCIceCandidate(response.event))

  }





  return (
    <>
      <div className="w-[100%] h-[742px] bg-black flex justify-center items-center">
        <div className=" w-[100%] md:w-[60%] h-full md:h-[520px] bg-banner-gray flex flex-col justify-between rounded-sm">
          <div className="w-[100%] h-[300px]  flex flex-col justify-center items-center mt-4">
            <div className="w-[50%] h-[150px]  flex justify-between items-center  overflow-hidden bg-red">
              {/* <video ref={""} autoPlay playsInline className="w-[40%] h-full  bg-green-300" /> */}
              <video ref={remoteVideoRef} autoPlay playsInline className="w-[40%] h-full bg-blue-500 " />


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

export default UserCallComponent;
