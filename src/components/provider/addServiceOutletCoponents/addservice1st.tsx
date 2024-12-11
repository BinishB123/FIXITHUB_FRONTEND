import { useNavigate } from 'react-router-dom';
import { MdTwoWheeler } from "react-icons/md";
import { IoCarSportSharp } from "react-icons/io5";







function AddServiceFirstUi(){
  const navigate = useNavigate()
    return(<>
    <div className="mb-11 h-[60px] ">
          <h1 className="text-center text-white text-2xl font-light tracking-widest">
            Select the Type of Services You Are Providing
          </h1>
        </div>
        <div className="w-[85%] h-[350px]  flex justify-evenly">
          <div className="w-[30%] h-[400px]   bg-gradient-to-b from-gray-950 animate-fadeInDownBig flex flex-col place-items-center rounded-md ">
            <div className="w-[50%] h-[100px]  mt-8 flex  rounded-sm place-content-center place-items-center  bg-orange">
            <MdTwoWheeler className='text-6xl font-bold text-black' />
            </div>
            <div className="w-[90%] h-[120px] mt-6">
              <h1 className="text-center text-xl tracking-wider text-white ">
               Two-wheelers
              </h1>
              <p className="text-sm text-white font-light text-center">
              "Manage your Two-wheeler services: add new maintenance, repair, modification, or roadside assistance options, edit existing ones, or remove services as needed."
              </p>
            </div>
            <div className="w-[90%] h-[40px]  mt-4 flex flex-col place-content-center place-items-center">
              <button className="bg-orange w-[70%] h-[50px] rounded-md text-lg text-white" onClick={()=>{navigate('/provider/addservice/addTwowheelerService')}}>
                View
              </button> 
            </div>
          </div>
          <div className="w-[30%] h-[400px] bg-gradient-to-b from-gray-950 animate-fadeInDownBig flex flex-col place-items-center rounded-md ">
            <div className="w-[50%] h-[100px]  mt-8 flex  rounded-sm place-content-center place-items-center  bg-orange">
            <IoCarSportSharp className='text-6xl font-bold text-black' />
            </div>
            <div className="w-[90%] h-[120px] mt-6">
              <h1 className="text-center text-xl tracking-wider text-white ">
              Four-wheelers
              </h1>
              <p className="text-sm text-white font-light text-center">
              "Manage your Four-wheeler services: add new maintenance, repair, modification, or roadside assistance options, edit existing ones, or remove services as needed."
              </p>
            </div>
            <div className="w-[90%] h-[40px]  mt-4 flex flex-col place-content-center place-items-center">
              <button className="bg-orange w-[70%] h-[50px] rounded-md text-lg text-white" onClick={()=>{navigate('/provider/addservice/addFourwheelerService')}}>
                View
              </button>
            </div>
          </div>
          
        </div>
    </>)
}


export default AddServiceFirstUi