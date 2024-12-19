import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getbookingdates, stripePayment, } from "../../services/user/userServiceBooking";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { IRequiredDataDForBooking } from "../../interfaces/userInterface";



function UserBookingConfirm() {
    const location = useLocation()
    const [selectDate, setSelectedDate] = useState<undefined | string>(undefined)
    const [dates, setDates] = useState<{ count: number, date: Date, _id: string }[] | []>([])
    const navigate = useNavigate()
    const [suggestions,setsuggestion] = useState<string>("")
    const [selectedServices, setSelectedServices] = useState<{typeid: string; typename: string; startingprice: number; isAdded: boolean}[] | []>([])
    const {userInfo} = useSelector((state:RootState)=>state.user)
    useEffect(() => {  
        if (!location.state) {
            navigate('/services')
          } else {
        
        getbookingdates(location.state.providerId).then((response: any) => { 
            console.log("location.state",location.state);  
            
            const updatedData = response.data.map((item: { _id: string, date: string, count: string }) => {
                const date = new Date(item.date)
                return { ...item, date: date }
            })
            const filteredData: { typeid: string; typename: string; startingprice: number; isAdded: boolean }[]= location.state.selectedServices.filter((item: { typeId: string, serviceName:string, price: number,isAdded:boolean}) => {
              
                    if (item.isAdded) {
                        return item
                    }
               
            })
            filteredData.sort((a, b) => b.startingprice - a.startingprice)
            setSelectedServices(filteredData)
            setDates(updatedData)
        })
    }

    }, [])
    const calculatePercentage = (totalAmount:number, percentage=25) =>{
        return (totalAmount * percentage) / 100;
    }

    const makePayment = async () => {
        if (!selectDate) {
            return toast.warning("Please Select A Date")
        }
        const updatedData = selectedServices.map((item)=>{
            return {typeId:item.typeid,serviceName:item.typename,price:item.startingprice}
        }) 
        const dataRequiredBooking:IRequiredDataDForBooking = {
            providerId: location.state.providerId,
            userId:userInfo?.id+"",
            date:selectDate  ,
            vehicleType:location.state.data.vehicleType ,
            serviceType:location.state.data.seviceId  ,
            selectedService:updatedData,
            suggestions:suggestions,
            vehicleDetails: {
                vehicleId:location.state.data.vehcileNumber ,
                brand: location.state.data.brand ,
                model:location.state.data.model,
                fueltype:location.state.data.fuel, 
                kilometer:location.state.data.kilometer
            },
        }
        
        const initailAmountToPay = calculatePercentage(dataRequiredBooking.selectedService.reduce((acc,cuu)=>{return acc+cuu.price},0))+50
        const stripeResponse = await stripePayment(selectDate,dataRequiredBooking,initailAmountToPay)
        if (stripeResponse.statusCode === 409) {
            const updatedDates = dates.filter((data) => data._id !== selectDate);
                setDates(updatedDates)
                setSelectedDate(updatedDates[0]._id)
            return toast.error("Date no Longer Available Select Another Date")
        }
        if (stripeResponse.success) {
            const hashed = window.btoa(JSON.stringify(dataRequiredBooking))
            try {
                sessionStorage.setItem("vehicle", hashed);
                window.location.href = stripeResponse.url
              } catch (e) {
               toast.warning("Something went wrong")
              }
              
            
        }
    }
   




    return (<>
        <div className="w-[100%] h-auto bg-black flex md:flex-row flex-col ">
            <div className="w-[100%] md:w-[50%] h-auto md:h-[600px] flex justify-center flex-col items-center " >
                <div className="w-[90%] h-[200px] bg-banner-gray flex flex-col items-center rounded-md">
                    <div className="w-[90%] h-[40px] ">
                        <h1 className="text-center text-white">"Share Your  Concerns"</h1>
                    </div>
                    <div className="w-[95%] h-[140px]">
                        <textarea name="" maxLength={324} value={suggestions} onChange={(e)=>{setsuggestion(e.target.value)}} className="w-[100%] h-[100%] bg-banner-gray border-2 text-white rounded-sm" id=""></textarea>
                    </div>

                </div>
                <div className="w-[80%] h-auto  flex flex-col space-y-2 mt-3">
                    <h1 className="text-white text-center text-2xl font-dm font-light tracking-wider">Select Service Date</h1>
                    <p className="text-gray-400 text-sm">Please select the date on which you would like the service to be scheduled with the provider</p>
                    {dates.length > 0 && dates.map((item, index) => (
                        <div key={index} className="w-[100%] h-[60px] bg-banner-gray text-white justify-center flex flex-col space-x-2 items-center rounded-md">
                            <div className="flex space-x-2 items-center">
                                <label htmlFor={`${index}`}>{`${item.date.toDateString().split(' ').join(' ')}`}</label>

                                <input
                                    onClick={() => {
                                        setSelectedDate(item._id)}}
                                    type="radio"
                                    value={item._id} 
                                    name="fuel"
                                   
                                    className={`w-4 h-4 ${item._id===selectDate&&"text-blue-600"} bg-gray-100 border-gray-300 ${item._id === selectDate ? "focus:ring-blue-500 dark:focus:ring-blue-600" : ""
                                        } dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                                />

                            </div>

                            <p className={`${item.count < 5 ? "text-red" : "text-green-500"}`}>{`Balance Booking ${item.count == 1 ? "Slot" : "Slots"} : ${item.count}`}</p>

                        </div>
                    ))}

                </div>


            </div>
            <div className="w-[100%] md:w-[50%] h-[700px]  flex flex-col justify-center space-y-3 items-center" >
                <div className="w-[90%] md:w-[60%] h-[400px] bg-banner-gray rounded-md">
                    <div className="w-[100%] h-[50px] text-white  place-content-center font-dm font-medium  " >
                        <h1 className="text-center">Selected Services</h1></div>
                    <div className="w-[100%] h-[300px]   flex flex-col items-center space-y-1 overflow-y-scroll scrollbar-hide">
                        {selectedServices.map((item, index) => (
                            <div key={index} className="w-[86%] h-[30px]  flex space-x-6 justify-between border-b-2">
                                <p className="text-sm text-white">{item.typename}</p>
                                <p className="text-white text-sm">{`${item.startingprice} Rs`}</p>
                            </div>
                        ))}

                    </div>
                    <div className="h-[50px] ">
                        <h1 className="text-center text-white">{`Total Amount : ${selectedServices.reduce((acc, cc) => { return acc + cc.startingprice}, 0)}`}</h1>
                    </div>
                  
                </div>
                <div className="h-[60px] w-[60%] bg text-white bg-blue-500 justify-center rounded-md font-dm flex flex-col items-center">
                    <h1 className="space-x-4 ml-2 text-sm">PlatForm Fee : 50rs</h1>
                    <h1 className="ml-2 text-sm">{`Advance payment of 25% of toatAmount : ${calculatePercentage(selectedServices.reduce((acc, cc) => { return acc + cc.startingprice}, 0))}Rs`}</h1>
                    </div>
                <div className="w-[90%] md:w-[60%] h-[50px] bg-orange rounded-md text-white flex justify-center">
                    <button className="text-md font-semibold" onClick={makePayment}>{`Pay & Confirm : ${calculatePercentage(selectedServices.reduce((acc, cc) => { return acc + cc.startingprice}, 0))+50} Rs `}</button>
                </div>
            </div>

        </div>
    </>)
}

export default UserBookingConfirm