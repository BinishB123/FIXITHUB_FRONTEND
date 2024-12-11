import adminData from '../../assets/adminData report.png'

function AdminHome() {
    return (<>
        <div className='w-[100%] h-[200%] bg-slate-100-'>
            <div className="h-[20%] md:h-[20%] w-[100%] flex place-content-center ">
                <div className="h-[100%] w-[95%] bg-gradient-to-b from-gray-900 rounded-md mt-3 flex  flex-col md:flex-row">
                    <div className="h-[50%] md:h-[100%]  w-[100%] md:w-[50%] flex place-content-center mt-6">
                        <img src={adminData} width={320} className='w-[50%] animate-fadeInDownBig' />

                    </div>
                    <div className="h-[50%] w-[100%]  md:h-[100%] mt-0 md:w-[50%] flex place-items-center place-content-center">
                        <h1 className="text-white font-dm text-md  md:text-4xl font-semibold hover:scale-95 hover:duration-1000 hover:delay-1000 animate-fadeInUp">"Power at Your Fingertips – Manage, Monitor, and Master Every Detail with Ease!"</h1>
                    </div>


                </div>


            </div>
        </div>

    </>)
}


export default AdminHome