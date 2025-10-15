import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export an HTML element to PDF
 */
export const exportToPDF = async (
  elementId: string,
  fileName: string
): Promise<void> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add more pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
