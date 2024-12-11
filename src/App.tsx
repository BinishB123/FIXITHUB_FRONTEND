import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import UserRoute from './routes/userRoute';
import { Toaster } from 'sonner'
import ProviderRoute from './routes/ProviderRoute';
import AdminRoutes from './routes/AdminRoute';


function App() {
 
  
  return (
    <>
      <BrowserRouter>
      <Toaster  position='top-center' richColors/>
        <Routes>
          <Route path='/*' element={<UserRoute />} />
          <Route path='/provider/*' element={<ProviderRoute/>}/>
          <Route path='/admin/*' element={<AdminRoutes/>}/>
        </Routes>
       
      </BrowserRouter>
    </>
  );
}

export default App;
