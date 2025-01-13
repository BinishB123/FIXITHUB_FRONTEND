
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




export interface reportData {
  _id?:  string;
  userId: string ;
  providerId: string ;
  BookingId: string ;
  report: string;
  provider?: {
    workshopName: string;
    logoUrl: string;
  };
  user?: {
    name: string;
    logoUrl: string;
  };
  status?: "Pending" | "In Progress" | "Approved" | "Rejected" | "Completed";
}


export interface reportDetailsData {
  BookingId: string;
  bookeddate: string; // ISO date string
  date: string; // ISO date string
  bookings: {
    advance: boolean;
    advanceAmount: number;
    paymentStatus: string;
    selectedService: {
      price: number;
      serviceName: string;
      typeId: string;
      _id: string;
    }[];
    status: string;
    vechileDetails: {
      brand: string;
      fueltype: string;
      kilometer: number;
      model: string;
    };
  };
  provider: {
    logoUrl: string;
    workshopName: string;
  };
  providerId: string;
  report: string;
  status: string;
  user: {
    logoUrl: string;
    name: string;
  };
  userId: string;
  _id: string;
  servicename: {serviceType:string}
}

interface sel{
  
  typeId : string
  serviceName:string
  price:number
  _id:string
}
export interface SalesReportAdmin {
_id:  string,
service: {
  serviceType: string
}
user: {
  name: string,
}
provider:{
  workshopName: string;
}
selectedDate: {
  date: Date
}
selectedService: sel[]



}

