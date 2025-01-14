import { CiCircleChevDown } from "react-icons/ci";
import appLogo from '../../../assets/Rectangle 168.png'
import { GiAutoRepair } from "react-icons/gi";

function Footer() {
    return (<footer className=' w-[100%] h-auto    flex place-content-center bg-black'>
        <div className='w-[95%] h-[400px] hidden md:flex justify-start space-x-7 bg-black'>
            <div className='w-[20%] h-[350px] flex flex-col justify-start space-y-5'>
                <h1 className='text-lg font-dm font-semibold text-orange'>STAY CONNECTED</h1>
                <h4 className='text-md font-dm font-bold text-white'>Facebook</h4>
                <h4 className='text-md font-dm font-bold text-white'>Twitter</h4>
                <h4 className='text-md font-dm font-bold text-white'>LinkedIn</h4>
                <h4 className='text-md font-dm font-bold text-white'>Instagram</h4>
                <h4 className='text-md font-dm font-bold text-white'>YouTube</h4>
                <h4 className='text-md font-dm font-bold text-white'>Pinterest</h4>
                <h4 className='text-md font-dm font-bold text-white'>TikTok</h4>
                <h4 className='text-md font-dm font-bold text-white'>WhatsApp</h4>

            </div>
            <div className='w-[20%] h-[350px] flex flex-col justify-start space-y-5'>
                <h1 className='text-lg font-dm font-semibold text-orange'>EXPLORE</h1>
                <h4 className='text-md font-dm font-bold text-white'>Our Services</h4>
                <h4 className='text-md font-dm font-bold text-white'>Become a Partner</h4>
                <h4 className='text-md font-dm font-bold text-white'>Blog</h4>
                <h4 className='text-md font-dm font-bold text-white'>Careers</h4>
                <h4 className='text-md font-dm font-bold text-white'>About Us</h4>
                <h4 className='text-md font-dm font-bold text-white'>FAQs</h4>
                <h4 className='text-md font-dm font-bold text-white'>Contact Us</h4>
                <h4 className='text-md font-dm font-bold text-white'>Privacy Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>Terms & Conditions</h4>

            </div>
            <div className='w-[20%] h-[350px] flex flex-col justify-start space-y-5'>
                <h1 className='text-lg font-dm font-semibold text-orange'>CUSTOMER SUPPORT</h1>
                <h4 className='text-md font-dm font-bold text-white'>24/7 Helpline</h4>
                <h4 className='text-md font-dm font-bold text-white'>Email: support@gmail.com</h4>
                <h4 className='text-md font-dm font-bold text-white'>Live Chat Available on the App</h4>
                <h4 className='text-md font-dm font-bold text-white'>Phone: +1 (123) 456-7890</h4>
                <h4 className='text-md font-dm font-bold text-white'>WhatsApp Support</h4>
                <h4 className='text-md font-dm font-bold text-white'>FAQs & Help Center</h4>
                <h4 className='text-md font-dm font-bold text-white'>Track Your Order</h4>
                <h4 className='text-md font-dm font-bold text-white'>Refund & Cancellation</h4>
                <h4 className='text-md font-dm font-bold text-white'>Feedback & Suggestions</h4>

            </div>
            <div className='w-[20%] h-[350px] flex flex-col justify-start space-y-5'>
            <h1 className='text-lg font-dm font-semibold text-orange'>POLICY</h1>
                <h4 className='text-md font-dm font-bold text-white'>Privacy Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>Terms and Conditions</h4>
                <h4 className='text-md font-dm font-bold text-white'>Cookie Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>Refund Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>Data Protection Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>Accessibility Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>User Agreement</h4>
                <h4 className='text-md font-dm font-bold text-white'>Anti-Discrimination Policy</h4>
                <h4 className='text-md font-dm font-bold text-white'>Community Guidelines</h4>

            </div>
            <div className='w-[20%] h-[400px] flex flex-col place-content-end '>
                <div className='w-[100%] h-[50px] flex flex-row '>
           <GiAutoRepair className="text-3xl text-center text-orange " /> 
           <h1 className="font-dm font-bold text-white text-sm md:text-xl hover:text-orange-500">
          FIXITHUB
           </h1>                </div>

            </div>


        </div>
        <div className='md:hidden w-[90%] h-[300px] mt-20  space-y-6 bg-black'>
            <div className='w-[100%] h-[50px]  flex justify-between rounded-md '>
                <h1 className='text-gray-400 text-sm mt-6 ml-4'>STAY CONNECTED</h1>
                <CiCircleChevDown className='text-white text-4xl mt-4 mr-5' />

            </div>
            
            <div className='w-[100%] h-[50px]  flex justify-between rounded-md bg-black '>
                <h1 className='text-gray-400 text-sm mt-6 ml-4'>STAY CONNECTED</h1>
                <CiCircleChevDown className='text-white text-4xl mt-4 mr-5' />

            </div>
            <div className='w-[100%] h-[50px]  flex justify-between rounded-md '>
                <h1 className='text-gray-400 text-sm mt-6 ml-4'>STAY CONNECTED</h1>
                <CiCircleChevDown className='text-white text-4xl mt-4 mr-5' />

            </div>
            <div className='w-[100%] h-[50px]  flex justify-between rounded-md '>
                <h1 className='text-gray-400 text-sm mt-6 ml-4'>STAY CONNECTED</h1>
                <CiCircleChevDown className='text-white text-4xl mt-4 mr-5' />

            </div>

        </div>

    </footer>)
}


export default Footer