import { Route, Routes, useNavigate, } from "react-router-dom"
import AdminLoginPage from "../pages/admin/adminLogin"
import AdminSettingsPage from "../pages/admin/adminSettings"
import AdminHomePage from "../pages/admin/adminHome"
import { ReactNode, useEffect } from "react"
import AdminUserList from "../pages/admin/adminuserList"
import AdminproviderPage from "../pages/admin/adminProvider"
import TwocardsProviderView from "../components/admin/adminProvider/cards"
import ProviderPendingPage from "../pages/admin/adminProviderPending"
import AdminprovidersPage from "../components/admin/adminProvider/adminProviders"
import axios from "axios"
import { apiUrl, axiosInstance } from "../api/common"
import { toast } from "sonner"
import AdminReportPage from "../pages/admin/adminReportPage"

interface ProtectedRouteProps {
    children: ReactNode;
}


const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate()
    const adminData = JSON.parse(localStorage.getItem("isAdmin") || '{}');

    useEffect(() => {
        if (!adminData.isAdmin) {
            navigate("/admin/signin", { replace: true })
            return
        }

        axiosInstance.get(apiUrl + '/api/admin/auth/checker').then(() => {
            if (!adminData.isAdmin) {
                toast.error("Session Expired please login")
                navigate("/admin/signin", { replace: true })
            }
        }).catch((error) => {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                if (statusCode === 403) {
                    localStorage.removeItem("isAdmin")
                    toast.error("Session Expired please login")
                    navigate("/admin/signin", { replace: true })
                }
            } else {

                console.error('An error occurred:', error);
            }
        })
    })
    return <>{children}</>;
};


const AdminRoutes = () => {
    return (<Routes>
        <Route path="/signin" element={<AdminLoginPage />}></Route>
        <Route path="/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>}></Route>
        <Route path="/dashboard" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>}></Route>
        <Route path="/userlist" element={<ProtectedRoute><AdminUserList /></ProtectedRoute>}></Route>
        <Route path="/reports" element={<ProtectedRoute><AdminReportPage></AdminReportPage></ProtectedRoute>}></Route>
        <Route path="/providers" element={<ProtectedRoute><AdminproviderPage /></ProtectedRoute>}>
            <Route index element={<TwocardsProviderView />} />
            <Route path="pendinglist" element={<ProviderPendingPage />} />
            <Route path="providerslist" element={<AdminprovidersPage />} />

        </Route>
    </Routes>)
}

export default AdminRoutes