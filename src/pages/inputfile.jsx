import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import React, { useRef, useState } from 'react';
import Header from '../components/header';

// eslint-disable-next-line react/prop-types
const PDFViewer = ({ file, onCoordinateClick }) => {
  const canvasRef = useRef(null);

  const renderPDF = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const pdf = await pdfjs.getDocument({ data: e.target.result }).promise;
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
    reader.readAsArrayBuffer(file);
  };

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = rect.height - (event.clientY - rect.top); // Inverte o eixo Y

    onCoordinateClick({ x, y });
  };

  React.useEffect(() => {
    renderPDF();
  }, [file]);

  return <canvas ref={canvasRef} onClick={handleCanvasClick} />;
};

const InputFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [coordinate, setCoordinate] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCoordinateClick = ({ x, y }) => {
    console.log(`Coordinates: x=${x}, y=${y}`);
    setCoordinate([x, y])
  };

  return (
    <>
    <Header />
    <div>
      <h1>Selecione um arquivo e clique para ver as coordenadas</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
      {selectedFile && (
        <PDFViewer file={selectedFile} onCoordinateClick={handleCoordinateClick} />
      )}
      {coordinate.length > 0 && <p>{`x = ${coordinate[0]} , y = ${coordinate[1]}`}</p>}
    </>
  );
};

export default InputFile;
