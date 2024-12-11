import Header from "../../components/admin/common/AdminHeader"
import AdminProvider from "../../components/admin/adminProvider/adminProvider"



function AdminproviderPage(){
    return(<div className="h-lvh bg-black  md:min-h-screen">
        <Header></Header>
        <AdminProvider></AdminProvider>
    </div>)
}

export default AdminproviderPage