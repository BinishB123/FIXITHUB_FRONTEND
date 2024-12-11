
//in redux initial state 
interface userInitialState {
  userInfo: userInfo | null
  isLoggedIn: boolean,
  isLoading: boolean,
  error: boolean,
  errormessage: string,
  message: string
  success: null | boolean
}
export interface HeaderProps {
  prop: boolean;
}
export interface userInfo {
  id: string,
  name: string,
  email: string,
  mobile: string,
  blocked: boolean
  logoUrl?: string

}

export interface Iusersignup {
  name: string,
  email: string,
  mobile: string,
  password: string

}

export interface Ivalidation {
  field: string,
  message: string
}

export interface mainResponse {
  message: string,
  success: boolean
}

export interface userResponse {
  message: string,
  success: boolean,
  user?: {
    id: string,
    name: string,
    email: string,
    mobile: string,
    blocked: boolean
  }

}


export interface SignInData {
  email: string,
  password: string
}

export interface IgetservicesResponse {
  _id: string
  category: string,
  serviceType: string,
  imageUrl: string
}




export interface Workshop {
  workshopName: string;
  ownerName: string;
  email: string;
  mobile: string;
  logoUrl: string;
  selectedService: SelectedService;
  services: Service[];
  workshopDetails: WorkshopDetails;
}

interface SelectedService {
  _id: string;
  type: string;
}

interface Service {
  typeid: string;
  typename: string;
  startingprice: number;
  isAdded: boolean;
}

interface WorkshopDetails {
  address: string;
  location: Location;
}

interface Location {
  type: string;
  coordinates: [number, number];
}



export interface IRequiredDataDForBooking {
  providerId: string,
  userId: string,
  date: string,
  vehicleType: string,
  serviceType: string,
  selectedService: { typeId: string, serviceName: string, price: number }[],
  suggestions?: string,
  vehicleDetails: {
    vehicleId: string,
    brand: string,
    model: string,
    fueltype: string,
    kilometer: string
  },
}





interface SelectedService {
  typeId: string;
  serviceName: string;
  price: number;
  _id: string;
}



interface BookedDate {
  date: Date;
}

interface ServiceName {
  serviceType: string;
}

interface VehicleDetails {
  brand: string;
  model: string;
  fueltype: string;
  kilometer: number;
}


export interface ResponsegetBookingGreaterThanTodaysDate {
  _id: string;
  selectedService: SelectedService[];
  vechileDetails: VehicleDetails;
  date:string
  advanceAmount: number;
  advance: boolean,
  status: string,
  amountpaid: number,
  vechileType:string,
  paymentStatus: string,
  provider: {
    _id:string,
    workshopName: string;
    mobile: number;
    logoUrl: string
  };
  bookeddate: BookedDate;
  servicename: ServiceName;

  brand: {
    brand: string
  }
  suggestions: string
}









export default userInitialState