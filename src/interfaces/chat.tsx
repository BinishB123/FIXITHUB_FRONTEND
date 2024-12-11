interface IMessage {
    _id: string;
    chatId: string;
    message: string;
    sender: "user" | "provider"; 
    providerdelete: boolean;
    userdelete: boolean;
    createdAt: string; // ISO string format for date
    updatedAt: string; // ISO string format for date
    seen:boolean;
    __v: number; // Version key added by MongoDB
  }
  

export interface IChatingUser {
    _id: string;
    provider: {
      _id: string; 
      workshopName: string; 
      logoUrl?:string
    }
    user: {
      _id: string; 
      name: string; 
      logoUrl: string; 
    };
    newMessage?:{message:string,updatedAt:string}
    messages?:IMessage[]
  }