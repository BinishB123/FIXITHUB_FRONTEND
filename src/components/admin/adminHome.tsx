import { useEffect, useState } from 'react';
import adminData from '../../assets/adminData report.png'
import { bookedService, monthlyRevenue } from '../../services/admin/adminProvider';
import {
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    ComposedChart,
    Legend,
    Bar,
    Line,

} from 'recharts';


function AdminHome() {
    const [monthly, setrevenue] = useState<{ month: string; revenue: number }[] | []>([])
    const [serviceBookedCount, setServicesBookedCount] = useState<{ count: number, serviceType: string }[] | []>([])
    useEffect(() => {

        monthlyRevenue().then((response: any) => {
            const rawData = response.data.data
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const formattedData = rawData.map((item: any) => ({
                name: months[item.month - 1],
                uv: item.revenue,
            }));

            setrevenue(formattedData)


        })
        bookedService().then((Response: any) => {
            const rawData = Response.data.data
            const formattedData = rawData.map((item: any) => ({
                name: item.serviceType,
                pv: item.count,
                uv: item.count
            }));
            setServicesBookedCount(formattedData)
        })


    }, [])


    return (<>
        <div className='w-[100%] h-auto bg-black '>
            <div className="h-[20%] md:h-[200px] w-[100%] flex place-content-center ">
                <div className="h-[100%] w-[95%] bg-gradient-to-b from-gray-900 rounded-md mt-3 flex  flex-col md:flex-row">
                    <div className="h-[50%] md:h-[100%]  w-[100%] md:w-[50%] flex place-content-center mt-6">
                        <img src={adminData} width={220} height={50} className=' animate-fadeInDownBig' />

                    </div>
                    <div className="h-[50%] w-[100%]  md:h-[100%] mt-0 md:w-[50%] flex place-items-center place-content-center">
                        <h1 className="text-white font-dm text-md  md:text-4xl font-semibold hover:scale-95 hover:duration-1000 hover:delay-1000 animate-fadeInUp pr-9">"Power at Your Fingertips – Manage, Monitor, and Master Every Detail with Ease!"</h1>
                    </div>


                </div>


            </div>
            <div className='w-[100%] h-auto  pt-7 mt-14 bg-black flex justify-center'>
                <div className='w-[100%] h-[300px]'>
                    <div className='w-[100%] h-[40px] '>
                        <h1 className='text-gray-300 pl-16 text-xl font-dm'>Monthly Revenue </h1>
                    </div>

                    <div className='w-[100%] h-[260px]'>
                        <AreaChart
                            width={730}
                            height={250}
                            data={monthly}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="uv"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorUv)"
                            />
                            <Area
                                type="monotone"
                                dataKey="pv"
                                stroke="#82ca9d"
                                fillOpacity={1}
                                fill="url(#colorPv)"
                            />
                        </AreaChart>
                    </div>

                </div>
                <div className='w-[100%] h-[350px] mt-2'>
                    <div className='w-[100%]  h-[50px] '>
                        <h1 className='text-gray-300 pl-16 text-xl font-dm'>Customer Service Bookings Overview  </h1>
                    </div>
                    <div className='w-[100%] h-[300px]'>
                        <ComposedChart width={730} height={250} data={serviceBookedCount}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                        </ComposedChart>
                    </div>

                </div>



            </div>
        </div>

    </>)
}


export default AdminHome