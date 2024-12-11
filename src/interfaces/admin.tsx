
export interface IAdminIntialState{
    isLoading: boolean,
    isAdmin : boolean,
    error:boolean,
    success:boolean,
    message:string|null,
    errorMessage:string|null
}

export interface SignData{
    email:string,
    password:string
}

export interface Response{
    success:boolean
    message?:string
}

export type Brand = {
    brand: string | null;
  };
  
  export interface SubType {
    _id: string;
    type: string; // Make sure you're using 'types' consistently
  }
export  type generalServices = {
    _id: string;
    serviceType: string;
    imageUrl: string;
    category: string;
    subTypes: SubType[]|[];
  };
  
export  type roadServices = {
    _id: string;
    serviceType: string;
    imageUrl: string;
    category: string;
  };


 export interface FileDetails {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
}