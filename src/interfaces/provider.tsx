export interface ProviderRegisterResponse {
    message: string,
    success: boolean,
    provider?: {
        id: string,
        ownername: string
        workshopname: string,
        email: string,
        mobile: string,
        requested: boolean,
        blocked: boolean
    }

}

export interface ProviderSignResponse {
    message: string,
    success: boolean,
    provider?: {
        id: string,
        ownername: string
        workshopname: string,
        email: string,
        mobile: string,
        requested: boolean,
        blocked: boolean
    }

}

export interface signInData {
    email: string,
    password: string
}


export interface ProviderInfo {
    id: string,
    ownername: string
    workshopname: string,
    email: string,
    mobile: string,
    requested: boolean,
    blocked: boolean
    logoUrl?:string|null
}


export interface ProviderInitialState {
    providerInfo: ProviderInfo | null
    isLoading: boolean,
    error: boolean,
    errorMessage: string | null
    message: string | null
    success: null | boolean
  
}



interface workshopDetails {
    address: string,
    coordinates: {
        lat: number,
        long: number
    }
}


export interface ProviderModel {
    workshopName: string,
    ownerName: string,
    email: string,
    mobile: string,
    password: string
    workshopDetails: workshopDetails,
}

export interface mainResponse {
    message: string,
    success: boolean
  }


//providerServices start
export interface providerServicesSubtype{
    _id:string
    type:string
    isAdded:boolean
    priceRange?:number
}
export interface providerGeneralServices{
    typeid:string
    typename:string
    image:string
    category:"general"|"road"
    isAdded:boolean
    subType:providerServicesSubtype[]
}
export interface providerRoadServices{
    typeid:string,
    typename:string,
    category:"general"|"road"
    isAdded:boolean
    image:string
}
//providerServices end





export interface IproviderReponseData {
    _id: string;
    workshopName: string;
    ownerName: string;
    email: string;
    workshopDetails: workshopDetails;
    blocked: boolean;
    requestAccept: boolean | null;
    supportedBrands: { brand: string }[];
    about?: string;
    logoUrl:string
    mobile:number
  }




  export interface NotificationGetter {
    count: number;
    createdAt: string; // ISO date string
    latestMessage: string; // ObjectId represented as a string
    message: {
      _id: string; // ObjectId represented as a string
      sender: string;
      chatId: string; // ObjectId represented as a string
      message: string;
      providerdelete: boolean;
      userdelete: boolean;
      seen: boolean;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      __v: number;
    };
    providerId: string; // ObjectId represented as a string
    updatedAt: string; // ISO date string
    user: {
      name: string;
      logoUrl: string;
    };
    userId: string; // ObjectId represented as a string
    _id: string; // ObjectId represented as a string
  }