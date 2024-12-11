import { useEffect, useState } from "react";
import { apiUrl, axiosInstance } from "../../api/common";
import { CgRemove } from "react-icons/cg";
import { IoAddCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSupportingBrands() {
  const navigate = useNavigate()
  const [searchwords,setSearchWords] = useState<string|undefined>(undefined)
  const [tempbrandStore,settempBrandStore] = useState<
  { _id: string; brand: string; isAdded: boolean }[]
>([])
  const [brands, setBrands] = useState<
    { _id: string; brand: string; isAdded: boolean }[]
  >([]);
  const { providerInfo } = useSelector((state: RootState) => state.provider);

  useEffect(() => {
    axiosInstance
      .get(
        apiUrl + `/api/provider/addservice/getallbrands?id=${providerInfo?.id}`
      )
      .then((response) => {
        const { brands } = response.data;
        settempBrandStore(brands)
        setBrands(brands);
        settempBrandStore(brands)
      })
      .catch((error) => {
       
        
        if (axios.isAxiosError(error)) {
          console.log("confritm");
          
          const statusCode = error.response?.status;
          console.log("Status Code:", statusCode);
    
          localStorage.removeItem("provider");
          navigate('/provider/signin', { replace: true });
          toast.error("Your session has expired or your access is restricted. Please sign in again.");
        } else {
          console.error("An unexpected error occurred:", error);
        }
        
        console.error("Error fetching brands:", error);
      });
  }, []);
  
  const onClickSearch = ()=>{
    const obj :any ={}
    const searchTerm = searchwords?.toLowerCase()||""; 
    const filteredData:{ _id: string; brand: string; isAdded: boolean }[] = tempbrandStore.filter((data) => {
        if (data.brand.toLowerCase().includes(searchTerm.toLowerCase())&&!obj[data.brand]) {
            obj[data.brand] = 1
            return data
        }
          }); 
    setBrands(filteredData); 
  }

  const addbrands = (brandid: string) => {
    axiosInstance
      .post(apiUrl + "/api/provider/addservice/addbrands", {
        id: providerInfo?.id,
        brandid: brandid,
      })
      .then((response) => {
        const updatedData = tempbrandStore.map((data) => {
          if (data._id === brandid) {
            return { ...data, isAdded: true };
          }
          return data;
        });
        setTimeout(()=>{
            setBrands(updatedData);
        settempBrandStore(updatedData)
        setSearchWords(undefined)
        },500)
        toast.success("Added")
      }).catch((error)=>{
        if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        if (statusCode===403) {
          localStorage.removeItem("provider");
          navigate('/provider/signin', { replace: true });
          toast.error("Your session has expired or your access is restricted. Please sign in again.");
        }
        } else {
          console.error("An unexpected error occurred:", error);
        }
        
        console.error("Error fetching brands:", error);
      });;
  };

  const deleteBrand = (brandid: string) => {
    axiosInstance
      .patch(apiUrl + "/api/provider/addservice/removeBrand", {
        id: providerInfo?.id,
        brandid: brandid,
      })
      .then((response) => {
        const updatedData = tempbrandStore.map((data) => {
          if (data._id === brandid) {
            return { ...data, isAdded: false };
          }
          return data;
        });
        toast.success("Removed")
        setTimeout(()=>{
            setBrands(updatedData);
            settempBrandStore(updatedData)
            setSearchWords(undefined)
        },500)
        
        
      }).catch((error)=>{
        if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        if (statusCode===403) {
          localStorage.removeItem("provider");
          navigate('/provider/signin', { replace: true });
          toast.error("Your session has expired or your access is restricted. Please sign in again.");
        }
        } else {
          console.error("An unexpected error occurred:", error);
        }
        
        console.error("Error fetching brands:", error);
      });
    
  };
  

  return (
    <>
      <div className="w-[80%]  h-auto flex flex-col items-center ">
        <div className="w-[95%] h-[100px] ">
          <h1 className="text-center text-white text-2xl font-dm font-medium">
            Add Supported Brands
          </h1>
          <p className="text-center text-white text-md tracking-wide font-dm font-medium">
            {" "}
            List all the brands that are supported in your workshop.
          </p>
        </div>
        <div className="w-[30%] h-[40px]  flex  space-x-2">
            <input type="text" placeholder="Search Brand" value={!searchwords?"":searchwords} onChange={(e)=>{
                setSearchWords(e.target.value)
                onClickSearch()
            }} className="text-center rounded-md w-[80%] bg-banner-gray text-white" />
           {
            searchwords!==undefined&& <MdCancel className="text-4xl text-gray-50 cursor-pointer"  onClick={()=>{
                setSearchWords(undefined)
                setBrands(tempbrandStore) 
            }}/>
           }

        </div>
        <div className="w-[95%] h-[490px] bg-orange-500 flex flex-wrap overflow-y-scroll scrollbar-hide p-4 gap-4 justify-items-center justify-center animate-fadeInDownBig mt-5">
          {brands.map((data, index) => (
            <div
              className="w-[20%] h-[100px] bg-banner-gray rounded-md"
              key={index}
            >
              <div className="w-[100%] h-[70px] place-content-center">
                <h1 className="text-lg text-white font-bold text-center">
                  {data.brand}
                </h1>
              </div>
              {data.isAdded ? (
                <div className="w-[100%] h-[30px] flex justify-end pr-3 relative group">
                  <CgRemove className="text-xl text-red cursor-pointer" onClick={()=>{
                    deleteBrand(data._id)
                  }} />
                  <span className="absolute bottom-full  transform   hidden group-hover:block text-red text-sm font-semibold bg-white rounded shadow-md p-1">
                    Remove
                  </span>
                </div>
              ) : (
                <div className="w-[100%] h-[30px] flex justify-end pr-3 relative group">
                  <IoAddCircleOutline
                    className="text-xl text-green-500 cursor-pointer"
                    onClick={() => {
                      addbrands(data._id);
                    }}
                  />
                  <span className="absolute bottom-full  transform   hidden group-hover:block text-green-600 text-sm font-semibold bg-white rounded shadow-md p-1">
                    Add
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AddSupportingBrands;
