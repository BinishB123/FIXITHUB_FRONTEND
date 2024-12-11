import { useEffect, useState } from "react";
import { services } from "../../api/user";
import { axiosInstance } from "../../api/common";
import { IgetservicesResponse } from "../../interfaces/userInterface";
import {  useNavigate } from "react-router-dom";

function SelectService(prop: { value: string }) {
    const [service, setservices] = useState<IgetservicesResponse[]>([]);
    const navigate = useNavigate()
    useEffect(() => {
        axiosInstance
            .get(services.getallServiceAccordingToCategory + `/${prop.value}`)
            .then((response) => {
                const { services } = response.data;
               
                setservices(services);
            });
    }, []);
    return (
        <>
            <div className="w-[100%] h-auto flex flex-col place-items-center bg-black">
                <div className="w-[95%] h-[750px] flex flex-col items-center">
                    <div className="w-[100%] h-[100px] bg-gradient-to-b from-gray-950 rounded-md animate-fadeInDownBig">
                        <h1 className="text-center text-white font-dm text-lg md:text-4xl mt-3 ">
                            {prop.value === "general"
                                ? "General Services"
                                : "Road Assistance"}
                        </h1>
                        <p className="text-center text-white font-dm text-sm md:text-md mt-3 tracking-wider">
                            {prop.value === "general"
                                ? "Explore Our Wide Range of General Services"
                                : "Get Immediate Help with Our Roadside Assistance"}
                        </p>

                    </div>
                    <div className="w-[100%] h-[550px]  flex justify-center flex-wrap overflow-y-scroll scrollbar-hide md:justify-evenly space-x-2 gap-y-4 place-items-center ">
                        {service.map((data, index) => (
                            <div
                                className={`flex w-[40%] md:w-[20%] h-[200px] md:h-[250px] bg-banner-gray justify-evenly  flex-col rounded-md animate-fadeInDownBig cursor-pointer ${index === 0 ? "ml-2 mt-2" : ""
                                    }`}
                                key={index}
                                onClick={() => {
                                    navigate('/services/getuservehicleDetails', { 
                                        state: { category:prop.value === "general" ? "general" : "road" ,serviceId:data._id} 
                                    });
                                }}
                                                            >
                                <div className="w-[100%] h-[100px] flex justify-center items-end">
                                    <div className="w-[50%] h-[100px] flex justify-center  ">
                                        <img
                                            src={data.imageUrl}
                                            alt=""
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex  justify-center items-center  w-[100%] h-[50px]  ">
                                    <h1 className="text-white flex   text-lg font-dm font-medium  ">
                                        {data.serviceType}
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SelectService;
