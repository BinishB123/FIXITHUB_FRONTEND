import { useEffect, useState } from "react";
import { getAdminSalesReport } from "../../services/admin/adminReports";
import { SalesReportAdmin } from "../../interfaces/admin";
import jsPDF from "jspdf";
import "jspdf-autotable";


function SalesReport() {
    const [selectedMonth, setSelectedMonth] = useState<any>(new Date().getMonth())
    const [years,setYears] = useState<any>(null)
    const [report,setReports] = useState<SalesReportAdmin[]|[]>([])
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [year,setYear] = useState<number>(new Date().getFullYear())
     useEffect(()=>{
            const y = []
           for(let i = 2024 ; i<= new Date().getFullYear();i++){
             y.push(i)
           }
           setYears(y)
            
    
        },[])

        useEffect(()=>{
            getAdminSalesReport(year,selectedMonth).then((response:any) => {
                setReports(response.data.report)
                console.log(response);
                
            })

        },[year,selectedMonth])


        const generatePDF = () => {
            const doc = new jsPDF();
            let pageNumber = 1;
            const rowsPerPage = 50; 
            const chunkedReports = [];
            for (let i = 0; i < report.length; i += rowsPerPage) {
              chunkedReports.push(report.slice(i, i + rowsPerPage));
            }
        
            chunkedReports.forEach((chunk, index) => {
              if (index > 0) doc.addPage(); 
              doc.text(`Sales Report - Page ${pageNumber}`, 14, 10);
              const tableData = chunk.map((report) => [
                report.provider.workshopName,
                report.user.name,
                report.service.serviceType,
                new Date(report.selectedDate.date).toLocaleDateString(),
                50,
              ]);
        
              doc.autoTable({
                startY: 20,     
                head: [["Provider","customer", "Service Type", "Date", "PlatForm Fee"]]  ,
                body: tableData,
              });
        
              pageNumber++;
            });
            doc.save("sales_report.pdf");
          };
        

    return (<><div className="w-[100%] h-[655px] flex flex-col items-center mt-5 space-y-3 bg-black">
        <div className="w-[100%] h-[30px] ">
            <h1 className="text-slate-300 text-lg font-dm text-center">Sales Report</h1>
        </div>
        <div className="w-[90%] h-[60px]  flex  ">
            <div className="w-[70%] h-full flex   ">
                <div className="flex w-[35%] flex-col">
                    <div className="w-[100%] h-[20px]">
                        <h1 className="text-sm text-slate-200 pl-2 font-semibold">Month</h1>
                    </div>
                    <select
                name="cars"
                value={selectedMonth}
                id="cars"
                className="w-[50%] h-[30px] rounded-md bg-banner-gray text-slate-200 border-2"
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                }}
              >
                {months.map((data, index) => (
                  <option value={index}>{data}</option>
                ))}
              </select>
                </div>
                <div className="flex w-[35%] flex-col">
                    <div className="w-[50%] h-[20px]">
                        <h1 className="text-sm text-slate-200 pl-2 font-semibold">Year</h1>
                    </div>
                    <select name="cars" value={year} id="cars" className="w-[50%] h-[30px] rounded-md bg-banner-gray text-slate-200 border-2" onChange={(e)=>{
                    setYear(parseInt(e.target.value))
                    }}>
                         {
                    years&& years.map((data:number,index:number)=>(
                        <option value={data}>{data}</option>                    ))
                   }

                    </select>
                </div>
            </div>
            <div className="w-[30%] h-full  flex items-center">
            <button onClick={generatePDF} className="w-[50%] h-[45px] text-white bg-slate-800 rounded-md">Download Report</button>
          </div>

        </div>
        <div className="overflow-y-scroll scrollbar-hide w-[90%] h-[450px] flex justify-center" >
            <table className="table-fixed text-white w-[100%] h-full">
                <thead className="bg-banner-gray h-[35px] w-[95%]">
                    <tr className="font-dm text-sm">
                        <th className="border-2 border-slate-700">Provider</th>
                        <th className="border-2 border-slate-700">Customer</th>
                        <th className="border-2 border-slate-700">Service</th>
                        <th className="border-2 border-slate-700">Date</th>
                        <th className="border-2 border-slate-700">PlatForm Fee</th>
                    </tr>
                </thead>
                <tbody className=" h-[415px]  w-[100%] ">
                    {report.map((data, index) => (
                        <tr className=" h-[20px] text-sm text-center">
                            <td className="border-2 border-slate-600 h-[20px] w-[20%] truncate">{data.provider.workshopName}</td>
                            <td className="border-2 border-slate-600 h-[40px] w-[20%] truncate">{data.user.name}</td>
                            <td className="border-2 border-slate-600 h-[20px] w-[30%] truncate">{data.service.serviceType}</td>
                            <td className="border-2 border-slate-600 h-[20px] w-[10%] truncate">{new Date(data.selectedDate.date).toLocaleDateString()}</td>
                            <td className="border-2 border-slate-600 h-[20px] w-[10%]">{50}</td>


                        </tr >
                    ))}
                </tbody>
            </table>
        </div>
        <div className="w-[90%] h-[40px]  bg-banner-gray flex justify-end">
            <div className=" flex text-white  w-[50%] justify-end pr-14 items-center space-x-3 text-sm font-dm font-semibold">
              <h1>Total  </h1>
              <h1>:</h1>
              <h2 className="text-white">₹{report.length*50}</h2>
            </div>
        </div>



    </div></>)
}

export default SalesReport