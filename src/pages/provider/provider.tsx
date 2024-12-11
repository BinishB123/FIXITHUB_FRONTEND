import Logo from "../../components/provider/common/logo"
import Header from "../../components/provider/common/header"
import { Outlet } from "react-router-dom"
function Provider() {
    return (<div className='bg-black  h-[742px] flex-col '>
        <Logo></Logo>
        <div className=" flex flex-row w-[100%] h-auto bg-black">
            <div className='w-[20%]  h-[600px] flex place-content-center items-center ml-2  '>
                <Header></Header>
            </div>
           
           <Outlet />
          

        </div>



    </div>)
}

export default Provider