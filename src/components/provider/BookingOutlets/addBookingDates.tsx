

import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import { IoAddOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { addDate, getAddedDates, updateCount } from "../../../services/provider/providerBookings";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store/store";

function AddBookings() {
    const [dates, setDates] = useState<{ date: Date, isAdded: boolean }[] | []>([])
    const [todaysDate,setTodaysDate] = useState<Date>(new Date())
    const [datesAndCount, setDatesAndCount] = useState<{ _id?:string, date: Date, count: number }[] | []>([])
    const {providerInfo} = useSelector((state:RootState)=>state.provider)
    useEffect(() => {
        let date = new Date();
        let arr = [];
        todaysDate.setHours(0,0,0,0)
        setTodaysDate(todaysDate)
        // Only run if providerInfo has an id
        if (providerInfo?.id) {
            getAddedDates(providerInfo?.id).then((response: any) => {
                console.log(response);
                
                const formattedDates = response.data.map((item:any) => ({
                    ...item,
                    date: new Date(item.date) 
                }));
                setDatesAndCount(formattedDates);
                for (let i = 1; i <= 5; i++) {
                    let newDate = new Date(date);
                    newDate.setDate(date.getDate() + i);
                    newDate.setHours(0, 0, 0, 0);
                    const checker = response.data.some((item: any) => item.date === newDate.toISOString());
                    arr.push({ date: newDate, isAdded: checker });
                }
                setDates(arr);
            }).catch((error) => {
                console.error("Error fetching dates:", error);
            });
        }
    }, [providerInfo?.id]);
    
    const Add = async (date: Date) => {
         if(providerInfo?.id){
            const response :{success: true, id: string}|null =  await addDate(date,providerInfo?.id) 
            
         if (response) {
            setDatesAndCount(prev => {
                const newDatesAndCount = [...prev, {_id:response.id ,date, count: 0 , bookedCount: 0}]
                    .sort((a, b) => a.date.getTime() - b.date.getTime());
                return newDatesAndCount;
            });
         }
         
      
        const newDate = dates.map((item) => {
            if (item.date === date) {
                return { ...item, isAdded: true }
            }
            return item
        })
        setDates(newDate)
    }
    }
    

    const OnClickUpdateCount = (dateId:string,toDo:string)=>{
        console.log(dateId,toDo);
        
       if(providerInfo?.id){
        updateCount(dateId,toDo).then((response)=>{
           console.log(response);
           
            const data = toDo==="add"? datesAndCount.map((item)=>{
                if(item._id===dateId){
                    return {...item,count:item.count+1}
                }
                return item
            }):datesAndCount.map((item)=>{
                if(item._id===dateId){
                    return {...item,count:item.count-1}
                }
                return item
            })
            setDatesAndCount(data)
        })
       }
    }



    return (<><div className="w-[100%] h-auto flex flex-col items-center">
        <div className="w-[90%] h-[200px] flex flex-col mt-3 space-y-4">
            <div className="w-[100%] h-[50px] ">
                <h1 className="text-2xl font-medium text-white text-dm border-b-2 text-center pb-3"> Set  Available Dates for Customers to Book Services</h1>
            </div>
            <div className="w-[100%] h-[100px] flex  justify-between space-x-1  ">
                {dates.map((item, index) => (
                    <div className="w-[20%]  h-[100px] bg-banner-gray  flex flex-col  rounded-md items-center" key={index} >
                        <div className="w-[90%]  h-[50px] text-center place-content-center ">
                            <h1 className="text-center text-md text-white"> {item.date.toDateString()}</h1>
                        </div>
                        {!item.isAdded ?
                            <button className="w-[90%] h-[35px] rounded-md bg-orange text-white flex justify-center items-center text-md" onClick={() => {
                                Add(item.date)
                            }}>
                                Add <IoMdAdd className="text-xl ml-2 mt-1" />
                            </button> : <button className="w-[90%] h-[35px] rounded-md  flex justify-center items-center text-md" onClick={() => {
                             
                            }}>
                                <MdLockOutline className="text-xl ml-2 mt-1 text-white" />
                            </button>
                        }
                    </div>
                ))}


            </div>




        </div>
        <div className="w-[90%] h-auto flex flex-col space-y-2 ">
           {
            datesAndCount.length>0&& <div className="w-[100%] h-[40px] rounded-md     bg-banner-gray ">
            <h1 className="text-white text-xl font-dm font-semibold tracking-wide text-center  ">Already Added</h1>
        </div>
           }
            <div className="w-[100%] h-[200px]  flex space-x-2">
                {datesAndCount.map((item, inde) => (
                    
                    <div className="w-[20%] h-[200px] flex flex-col items-center bg-banner-gray rounded-md animate-fadeInDownBig" key={inde}>
                        <div className="w-[90%] h-[40px]  flex justify-end items-center">
                        {
                            // item.date+""!== todaysDate+""&&<MdDelete className="text-2xl text-red cursor-pointer" />
                        }
                        </div>
                        <div className="w-[90%] h-[100px] flex flex-col justify-center items-center">
                            <h1 className="text-white text-2xl font-semibold">{item.date.toDateString().split(' ')[2]}</h1>
                            <h4 className="text-white tracking-widest">{`${item.date.toDateString().split(' ')[0]}, ${item.date.toDateString().split(' ')[1]}`}</h4>
                            <h5 className="text-white tracking-wide">{item.date.toDateString().split(' ')[3]}</h5>

                        </div>
                        <div className="w-[90%] h-[100px] flex justify-center space-x-1">
                            <div className="w-[20%] h-[30px] ">
                                <button className="w-[100%] rounded-md h-[40px] bg-orange flex justify-center items-center" onClick={()=>{
                                    if(item._id&&item.count>0){
                                        OnClickUpdateCount(item._id,"sub")
                                       }
                                }}><GrFormSubtract className="text-2xl text-white " /></button>
                            </div>
                            <div className="w-[60%] h-[50px]  flex flex-col justify-center items-center">
                            <h1 className=" h-[50px] text-center  text-white mt-4 text-sm"> {`Available count : ${item.count}`}</h1>


                            </div>
                            <div className="w-[20%] h-[30px]  ">
                                <button className="w-[100%] rounded-md h-[40px] bg-orange flex justify-center items-center" onClick={()=>{
                                   
                                    
                                   if(item._id){
                                    
                                    OnClickUpdateCount(item._id,"add")
                                   }
                                }}><IoAddOutline className="text-2xl text-white " /></button>
                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    </div></>)
}


export default AddBookings
