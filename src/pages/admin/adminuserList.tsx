import Header from "../../components/admin/common/AdminHeader"
import AdminUserListComponent from "../../components/admin/adminUser"


function AdminUserList(){
    return(<div className="h-lvh bg-black  md:min-h-screen">
        <Header></Header>
        <AdminUserListComponent></AdminUserListComponent>
    </div>)
}

export default AdminUserList