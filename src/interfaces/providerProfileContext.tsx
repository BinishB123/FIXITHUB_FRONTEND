import React from "react";
import { IproviderReponseData } from "./provider";

export interface ProfileContext {
    editaboutSt:string|null;
    seteditAbout:React.Dispatch<React.SetStateAction<string|null>>;
    profile:IproviderReponseData|null;
    setProfile:React.Dispatch<React.SetStateAction<IproviderReponseData|null>>;
}