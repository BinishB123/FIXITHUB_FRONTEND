import AdminReport from "../../components/admin/adminReport"
import Header from "../../components/admin/common/AdminHeader"


function AdminReportPage(){
    return(<><div className="w-[100%] h-auto bg-black">
        <Header></Header>
        <AdminReport></AdminReport>
        </div></>)
}

export default AdminReportPage