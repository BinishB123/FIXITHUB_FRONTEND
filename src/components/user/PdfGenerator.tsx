import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

interface SelectedService {
  typeId: string;
  serviceName: string;
  price: number;
  _id: string;
}

interface BookedDate {
  date: Date;
}

interface ServiceName {
  serviceType: string;
  _id: string;
}

interface VehicleDetails {
  brand: string;
  model: string;
  fueltype: string;
  kilometer: number;
}

export interface ResponsegetBookingGreaterThanTodaysDate {
  _id: string;
  selectedService: SelectedService[];
  vechileDetails: VehicleDetails;
  date: string;
  advanceAmount: number;
  advance: boolean;
  status: string;
  amountpaid: number;
  vechileType: string;
  paymentStatus: string;
  provider: {
    _id: string;
    workshopName: string;
    mobile: number;
    logoUrl: string;
  };
  bookeddate: BookedDate;
  servicename: ServiceName;

  brand: {
    brand: string;
  };
  suggestions: string;
  review?: string | null|undefined;
}
const PDFGenerator: React.FC<{ data: ResponsegetBookingGreaterThanTodaysDate }> = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGenerating && contentRef.current) {
      html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width / 2, canvas.height / 2]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save('invoice.pdf');
        setIsGenerating(false);
      }).catch(error => {
        console.error('Error generating PDF:', error);
        setIsGenerating(false);
      });
    }
  }, [isGenerating, data]);

  const generatePDF = () => {
    setIsGenerating(true);
  };

  const totalAmount = data.selectedService.reduce((acc, service) => acc + service.price, 0);

  return (
    <>
      <button
        onClick={generatePDF}
        className="bg-gray-950 w-[50%] h-[40px] rounded-md font-dm text-sm"
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating PDF...' : 'Download Invoice'}
      </button>
      {isGenerating && (
        <div ref={contentRef} style={{ position: 'absolute', left: '-9999px', top: 0 }} className='text-black'>
          <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>{data.provider.workshopName}</h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <img src={data.provider.logoUrl} alt="Workshop Logo" style={{ width: '100px', height: 'auto' }} />
                <h2 style={{ fontSize: '20px', marginTop: '10px' }}>Invoice</h2>
                <p style={{ fontSize: '14px', color: '#666' }}>Date: {format(new Date(data.bookeddate.date), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Vehicle Details:</h3>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Type: {data.vechileType}</p>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Brand: {data.brand.brand}</p>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Model: {data.vechileDetails.model}</p>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Fuel Type: {data.vechileDetails.fueltype}</p>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Kilometer: {data.vechileDetails.kilometer}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Service Details:</h3>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Service Type: {data.servicename.serviceType}</p>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Date: {format(new Date(data.bookeddate.date), 'MMMM dd, yyyy')}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Service</th>
                  <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {data.selectedService.map((service, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', fontSize: '14px' }}>{service.serviceName}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>₹{service.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <div style={{ width: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Subtotal:</span>
                  <span style={{ fontSize: '14px' }}>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Advance Amount:</span>
                  <span style={{ fontSize: '14px' }}>₹{data.advanceAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total:</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Additional Information:</h3>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Status: {data.status}</p>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Payment Status: {data.paymentStatus}</p>
              {data.suggestions && <p style={{ fontSize: '14px', marginBottom: '5px' }}>Suggestions: {data.suggestions}</p>}
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#666' }}>Thank you for your business!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFGenerator;

