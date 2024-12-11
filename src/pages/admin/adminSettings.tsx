import Header from "../../components/admin/common/AdminHeader";
import AdminSettingsComponent from "../../components/admin/adminSettings";
function AdminSettingsPage(){
    return(<div className="h-lvh bg-black  md:min-h-screen">
    <Header></Header>
    <AdminSettingsComponent></AdminSettingsComponent>
    </div>)
}

export default AdminSettingsPage