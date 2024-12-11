import { Outlet } from "react-router-dom"
import Footer from "../../components/user/common/footer"
import Header from "../../components/user/common/header"

function FixitHub() {
    return (<div className='h-lvh bg-black  md:min-h-screen flex-col '>
        <Header />
         <Outlet/>
        <Footer />

    </div>)
}

export default FixitHub