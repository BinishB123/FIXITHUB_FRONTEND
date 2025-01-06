import { useEffect, useState } from 'react';
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
import { bookedService, monthlyRevenue } from '../../services/provider/providerProfile';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store/store';


function HomePage() {
    // const [BookedServicesOFEachServices]
    const [monthly, setrevenue] = useState<{ month: string; revenue: number }[] | []>([])
    const [serviceBookedCount, setServicesBookedCount] = useState<{ count: number, serviceType: string }[] | []>([])
    const { providerInfo } = useSelector((state: RootState) => state.provider)
    useEffect(() => {
        if (providerInfo?.id) {
            monthlyRevenue(providerInfo?.id).then((response: any) => {
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
            bookedService(providerInfo.id).then((Response: any) => {
                const rawData = Response.data.data
                const formattedData = rawData.map((item: any) => ({
                    name: item.serviceType,
                    pv: item.count,
                    uv:item.count
                }));
                setServicesBookedCount(formattedData)
            })

        }
    }, [])
    


   
    return (<>
        <div className="w-[80%] h-auto mt-3  ">
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
    </>)
}


export default HomePage