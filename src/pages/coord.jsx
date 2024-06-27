import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import React, { useRef } from 'react';


// eslint-disable-next-line react/prop-types
const PDFViewer = ({ pdfUrl, onCoordinateClick }) => {
  const canvasRef = useRef(null);

  console.log('url', pdfUrl);

  const renderPDF = async () => {
    const pdf = await pdfjs.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = rect.height - (event.clientY - rect.top); // Inverte o eixo Y

    onCoordinateClick({ x, y });
  };

  React.useEffect(() => {
    renderPDF();
  }, []);

  return <canvas ref={canvasRef} onClick={handleCanvasClick} />;
};

const Coord = () => {
  const handleCoordinateClick = ({ x, y }) => {
    console.log(`Coordinates: x=${x}, y=${y}`);
  };

  
  return (
    <div>
      <PDFViewer pdfUrl="/DECLARACAO.pdf" onCoordinateClick={handleCoordinateClick} />
     
    </div>
  );
};

export default Coord;
