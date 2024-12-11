import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AddAddress from '../pages/provider/addAddress';
import ProviderSignUp from '../pages/provider/signUp';
import OtpverifyPage from '../pages/provider/otpPage';
import SignInPage from '../pages/provider/signInPage';
import ProviderHomePage from '../pages/provider/providerHome';
import ProviderAddService from '../pages/provider/AddServicePage';
import Provider from '../pages/provider/provider';
import { apiUrl } from '../api/common';
import { ReactNode } from 'react';
import {toast} from 'sonner'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/common';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Redux/store/store';
import {  urgentReset } from '../Redux/slice/providerSlice';
import AddServiceFirstOutletPage from '../pages/provider/addServiceOutlets/addservice1stpage';
import AddServicePage2 from '../pages/provider/addServiceOutlets/addServicePage2';
import AddSupportingBrandsPage from '../pages/provider/addSpportingBrandsPage';
import ProviderProfilePage from '../pages/provider/providerProfile';
import OverViewPage from '../pages/provider/profileOutlets/overview';
import AccountSettingsPage from '../pages/provider/profileOutlets/accounSettingspage';
import BookingsPage from '../pages/provider/BookingsPage';
import AddBookingDatesOutlet from '../pages/provider/BookingsOutlet/AddDate';
import ViewBookingsOutlet from '../pages/provider/BookingsOutlet/ViewBookings';
import ServicePage from '../pages/provider/servicePage';
import ReuseCancelledAndLatestBookingPage from '../pages/provider/BookingsOutlet/ReuseCancelledAndLatestBookingPage';
import ProviderChatPage from '../pages/provider/profileOutlets/Chat';
interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const provider = JSON.parse(localStorage.getItem("provider") || '{}');
        if (!provider) {
            toast.error(" Please sign in ");
            navigate("/admin/signin", { replace: true })
            return
        }
        axiosInstance.get(apiUrl + '/api/provider/auth/checker').then(() => {
            if (!provider) {
                toast.error(" Please sign in ");
                navigate("/admin/signin", { replace: true })
            }
        }).catch((error) => {
            dispatch(urgentReset())
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                if (statusCode==401) {
                    localStorage.removeItem("provider")
                    toast.error("You are Blocked By Admin."); 
                    navigate("/provider/signin", { replace: true })
                    
                }
                if (statusCode === 403) {
                    localStorage.removeItem("provider")
                    toast.error("Your session has expired or your access is restricted. Please sign in again.");
                    navigate("/provider/signin", { replace: true })

                }
            } else {

                console.error('An error occurred:', error);
            }
        })
    },[])
    return <>{children}</>;
};



const ProviderRoute = () => {
    return (
        <Routes>
            <Route path="/addworkshopdetails" element={<AddAddress />} />
            <Route path='/otpverify' element={<OtpverifyPage/>}/>
            <Route path='/signup' element={<ProviderSignUp/>}/>
            <Route path='/signin' element={<SignInPage/>}/>
            <Route path='/' element={<Provider/>}>
            <Route index element={<ProtectedRoute><ProviderHomePage /></ProtectedRoute>} />
            <Route path="addservice" element={<ProtectedRoute><ProviderAddService/></ProtectedRoute>} >
                       <Route index element={<ProtectedRoute><AddServiceFirstOutletPage/></ProtectedRoute>} />
                       <Route path='addTwowheelerService' element={<ProtectedRoute><AddServicePage2 value={2}></AddServicePage2></ProtectedRoute>}/>
                       <Route path='addFourwheelerService' element={<ProtectedRoute><AddServicePage2 value={4}></AddServicePage2></ProtectedRoute>}/>

            </Route>
            <Route path='/addsupportingBrands' element={<ProtectedRoute><AddSupportingBrandsPage/></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><ProviderProfilePage/></ProtectedRoute>}>
                  <Route index element={<ProtectedRoute><OverViewPage/></ProtectedRoute>} />
                  <Route path='accountsettings' element={<ProtectedRoute><AccountSettingsPage/></ProtectedRoute>}/>
                  <Route path='chat/:chatid/:userid' element={<ProtectedRoute><ProviderChatPage/></ProtectedRoute>}/>
            </Route>
            <Route path='/bookings' element={<ProtectedRoute><BookingsPage/></ProtectedRoute>}>
                <Route index element={<AddBookingDatesOutlet/>} />
                <Route path='viewbookings' element={<ViewBookingsOutlet/>}/>
                <Route path='cancelledBookings' element={<ReuseCancelledAndLatestBookingPage value={"cancelled"}></ReuseCancelledAndLatestBookingPage>}/>
                <Route path='latestBookings' element={<ReuseCancelledAndLatestBookingPage value={"latest"}></ReuseCancelledAndLatestBookingPage>}/>

            </Route>
            <Route path='/services' element={<ProtectedRoute><ServicePage/></ProtectedRoute>}/>
           
            </Route>
        </Routes>
    );
};

export default ProviderRoute;
