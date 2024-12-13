import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserHomePage from '../pages/user/userHomePage';
import UserSignUP from '../pages/user/userSignupPage';
import UserSignInPage from '../pages/user/userSignIn'
import UserOtp from '../pages/user/userOtpPage';
import FixitHub from '../pages/user/fixitHub';
import ServicesPage from '../pages/user/ServicesPage';
import SelectServicePage from '../pages/user/selectService';
import Services1stUi from '../pages/user/services1stUi';
import ShopListPage from '../pages/user/shopList';
import ShopProfilePage from '../pages/user/ShopProfilePage';
import { toast } from 'sonner';
import { reset } from '../Redux/slice/userSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {  axiosInstance } from '../api/common';
import { ReactNode, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../Redux/store/store';
import { useSelector } from 'react-redux';
import { userAuth } from '../api/user';
import UserProfilePage from '../pages/user/profile';
import OverViewPage from '../pages/user/profileOutlets/overView';
import UserlocationAndvehicleDetailsPage from '../pages/user/userLocation&vehicleDetailsPage';
import UserBookingConfirmPage from '../pages/user/ConfirnationPage';
import BookingSuccessPage from '../pages/user/BookingSuccessPage';
import LatestBookingPage from '../pages/user/profileOutlets/latestBookingPage';
import BookingHistoryPage from '../pages/user/profileOutlets/BookingHistoryPage';
import { ChatOutletPage } from '../pages/user/profileOutlets/ChatOutletPage';
import UserCallPage from '../pages/user/userCallPage';
import UserInCommigCallModal from '../components/user/userincommingcallmodal';
interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate()
    const { userInfo } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()


    useEffect(() => {
        if (!userInfo?.id) {
            navigate("/login", { replace: true })
            return
        }
        axiosInstance.get(userAuth.checker + `?id=${userInfo?.id}`).then(() => {
            const user = JSON.parse(localStorage.getItem("user") || '{}');
            if (!user) {
                toast.error(" Please sign in");
                navigate("/login", { replace: true })
            }
        }).catch((error) => {
            dispatch(reset())
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                if (statusCode === 403 || statusCode === 401) {
                    localStorage.removeItem("user")

                    toast.error("Your session has expired or your access is restricted. Please sign in again.");
                    navigate("/login", { replace: true })
                }
            } else {

                console.error('An error occurred:', error);
            }
        })
    })
    return <>{children}</>;
};



const UserRoute = () => {
    const [isModal,setModal] = useState(false)
    
    


    return (
        <><Routes>
        <Route path="/" element={<FixitHub />} >
            <Route index element={<UserHomePage />} />
            <Route path='services' element={<ProtectedRoute><ServicesPage /></ProtectedRoute>}>
                <Route index element={<Services1stUi />} />
                <Route path='selectGeneralservice' element={<ProtectedRoute><SelectServicePage value='general' /></ProtectedRoute>} />
                <Route path='selectRoadAssistance' element={<ProtectedRoute><SelectServicePage value='road' /></ProtectedRoute>} />
                <Route path='getuservehicleDetails' element={<ProtectedRoute><UserlocationAndvehicleDetailsPage /></ProtectedRoute>} />
                <Route path='shoplist' element={<ProtectedRoute><ShopListPage /></ProtectedRoute>} />
                <Route path='shopProfile' element={<ProtectedRoute><ShopProfilePage /></ProtectedRoute>} />
                <Route path='confirmBooking' element={<UserBookingConfirmPage />} />
            </Route>
            <Route path='/profile' element={<ProtectedRoute><UserProfilePage></UserProfilePage></ProtectedRoute>}>
                <Route index element={<OverViewPage />} />
                <Route path='latestbooking' element={<LatestBookingPage />} />
                <Route path='serviceHistory' element={<BookingHistoryPage />} />
                <Route path='chat/:chatid/:providerid' element={<ChatOutletPage />} />
            </Route>
            <Route path='/success' element={<BookingSuccessPage />} />
        </Route>
        <Route path='/call/:providerid' element={<UserCallPage></UserCallPage>} />
        <Route path='/signup' element={<UserSignUP />} />
        <Route path='/login' element={< UserSignInPage />} />
        <Route path='/otpverify' element={<UserOtp />} />


    </Routes>
    {isModal&&<UserInCommigCallModal/>}
    </>
    );
};

export default UserRoute;
