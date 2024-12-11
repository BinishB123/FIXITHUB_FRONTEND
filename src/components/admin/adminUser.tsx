import { axiosInstance } from '../../api/common'
import axios from 'axios'
import adminuser from '../../assets/adminuser.png'
import userimg from '../../assets/user.png'
import { useLayoutEffect, useState } from 'react'
import { apiUrl } from '../../api/common'
import { FaEyeLowVision } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
function AdminUserListComponent() {
    const [users, setuser] = useState<Array<any>>([])
    const [active, setactive] = useState<number>(0)
    const [blocked, setBlocked] = useState<number>(0)
    const navigate = useNavigate()
    useLayoutEffect(() => {
        axiosInstance.get(apiUrl + '/api/admin/user/getuser').then((response) => {
            if (response.data.users) {
                setuser(response.data.users)
                setactive(response.data.active)
                setBlocked(response.data.blocked)
            }
        }).catch((error) => {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                if (statusCode === 403) {
                    toast.error("Session Expired please login")
                    navigate("/admin/signin", { replace: true })
                }
            } else {

                console.error('An error occurred:', error);
            }

        })

        return () => {
            setuser([])
        }

    }, [])
  


    const blockAndUnblock = (id: string, state: boolean) => {
        axiosInstance.patch(apiUrl + "/api/admin/user/blockAndUnblock", { id: id, state: state }).then((Response) => {
            if (state) {
                setBlocked(blocked + 1)
                setactive(active - 1)
            }
            if (!state) {
                setactive(active + 1)
                setBlocked(blocked - 1)
            }

            if (Response.data.success) {
                const updatedUsers = users.map((user) => {
                    if (user.id === id) {
                        return { ...user, blocked: state };
                    }
                    return user;
                });
                setuser(updatedUsers);
            }
        })


    }



    return (<>
        <div className='w-[100%] h-[200%] bg-black '>
            <div className="h-[20%] md:h-[20%] w-[100%] flex place-content-center ">
                <div className="h-[100%] w-[95%] bg-gradient-to-b from-gray-900 rounded-md mt-3 flex  flex-col md:flex-row">
                    <div className="h-[50%] md:h-[100%]  w-[100%] md:w-[50%] flex place-content-center mt-6">
                        <img src={adminuser} width={320} className='w-[50%]  ' />

                    </div>
                    <div className="h-[50%] w-[100%]  md:h-[100%] mt-0 md:w-[50%] flex flex-col place-items-center place-content-center space-y-5">
                        <div className='w-[100%] h-[10%]  '>
                            <h1 className="text-white font-dm text-md  md:text-4xl font-semibold hover:scale-95 hover:duration-1000 hover:delay-1000 animate-fadeInUp">"Manage Users with Ease and Efficiency!"</h1>
                        </div>
                        <div className='w-[100%] h-[60%]  flex space-x-5 justify-center  place-items-center'>
                            <div className='w-[30%] h-[40%] bg-gray-400 animate-fadeInUp flex flex-col  justify-center  items-center rounded-md'>
                                <div className='flex justify-center w-[100%] h-[60%]  items-center '>
                                    <FaEyeLowVision className='w-[20%] h-[60%] text-white' />
                                    <h1 className='text-white font-dm text-lg font-semibold'>BLOCKED USERS</h1>
                                </div>
                                <div>
                                    <h1 className='text-xl text-white font-semibold'>{blocked}</h1>
                                </div>

                            </div>

                            <div className='w-[30%] h-[40%] bg-orange animate-fadeInDownBig flex  flex-col justify-center  items-center rounded-md  '>
                                <div className='flex justify-center w-[100%] h-[60%]  items-center '>
                                    <FaEye className='w-[20%] h-[60%] text-white' />
                                    <h1 className='text-white font-dm text-lg font-semibold'>ACTIVE USERS</h1>
                                </div>
                                <div>
                                    <h1 className='text-xl text-white font-semibold'>{active}</h1>
                                </div>

                            </div>

                        </div>
                    </div>


                </div>


            </div>
            <div className='w-full h-[1050px] flex flex-col mt-20 items-center scrollbar-hide overflow-y-scroll'>
                <div className='w-[90%] '>
                    <table className="min-w-full table-auto">
                        <thead className="">
                            <tr>
                                <th className="px-4 py-2 text-left text-white">Image</th>
                                <th className="px-4 py-2 text-left text-white">Name</th>
                                <th className="px-4 py-2 text-left text-white">Email</th>
                                <th className="px-4 py-2 text-left text-white">Status</th>
                                <th className="px-4 py-2 text-left text-white">Mobile</th>
                                <th className="px-4 py-2 text-left text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.map((user) => (
                                <tr key={user.id} className="border-b-2 border-b-gray-500 animate-fadeInUp hover:bg-banner-gray">
                                    {/* User Image Field */}
                                    <td className="px-4 py-2">
                                        <img
                                            src={userimg}
                                            // alt={`${user.name}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-white">{user.name}</td>
                                    <td className="px-4 py-2 text-white">{user.email}</td>
                                    <td className={`px-4 py-2 text-md font-semibold ${user.blocked ? 'text-red' : 'text-green-500'}`}>
                                        {user.blocked ? "Blocked" : "Active"}
                                    </td>
                                    <td className="px-4 py-2 text-white">{user.mobile}</td>
                                    <td className="px-4 py-2 text-white">
                                        <button
                                            className={`${user.blocked ? 'bg-blue-500' : 'bg-red'} text-white text-sm w-15 px-3 py-1 rounded`}
                                            onClick={() => {
                                                blockAndUnblock(user.id, !user.blocked);
                                            }}
                                        >
                                            {user.blocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>
            </div>

            <div className='w-[100%] h-[50px]  flex justify-center'>
                <button className='animate-bounce w-[10%] h-[50px] bg-orange text-white rounded-md'>view more</button>

            </div>
        </div>
    </>)
}

export default AdminUserListComponent