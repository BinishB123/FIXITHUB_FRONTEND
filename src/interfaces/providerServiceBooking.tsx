interface SelectedService {
    typeId: string;
    serviceName: string;
    price: number;
    _id: string;
  }
  
  interface VehicleDetails {
    brand: string;
    model: string;
    fueltype: string;
    kilometer: number;
  }
  
  interface User {
    _id:string
    name: string;
    mobile: number;
  }
  
  interface BookedDate {
    date: Date;
  }
  
  interface ServiceName {
    serviceType: string;
  }
  
  export interface ResponseAccordingToDate {
    _id: string;
    selectedService: SelectedService[];
    vechileDetails: VehicleDetails;
    advanceAmount: number;
  advance: boolean,
    amountpaid: number,
    paymentStatus:string,
    status:string,
    user: User;
    bookeddate: BookedDate;
    servicename: ServiceName;
  }
  

  export interface ResponsegetBookingStillTodaysDate{
    _id: string;
    selectedService: SelectedService[];
    vechileDetails: VehicleDetails;
    advanceAmount: number;
     advance: boolean,
    status:"pending"| "confirmed"|"inprogress"|"outfordelivery"| "completed"| "cancelled"| "onhold"|"failed",
    amountpaid: number,
    paymentStatus:string,
    user: {
    _id:string
    name: string;
    mobile: number;
    logoUrl:string
    };
    bookeddate: BookedDate;
    servicename: ServiceName;
  
    brand:{
      brand:string
    }
    suggestions:string
  }

 export interface colors {
   color : "pending"| "confirmed"|"inprogress"|"outfordelivery"| "completed"| "cancelled"| "onhold"|"failed"
 }

 
 