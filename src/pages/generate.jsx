

import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const modifyPdf = async (pdfBytes, data) => {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();

  console.log('medidas', width, height);

  firstPage.drawText(data.nome, {
    x: 107,
    y: 696,
    size: 12,
    color: rgb(238 / 255, 11 / 255, 11 / 255),

  });

  firstPage.drawText(data.RG, {
    x: 250,
    y: 676,
    size: 12,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(data.endereço, {
    x: 137,
    y: 637,
    size: 12,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(data.dia, {
    x: 207,
    y: 455,
    size: 12,
    color: rgb(0, 0, 0),
  });

  // firstPage.drawText(data.total, {
  //   x: 115,
  //   y: height - 205,
  //   size: 12,
  //   color: rgb(0, 0, 0),
  // });

  const pdfBytesModified = await pdfDoc.save();
  return pdfBytesModified;
};

const generatePdf = async (data) => {
  const existingPdfUrl = './DECLARACAO.pdf';
  const existingPdfBytes = await fetch(existingPdfUrl).then(res => res.arrayBuffer());

  const modifiedPdfBytes = await modifyPdf(existingPdfBytes, data);

  const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'declaracaoModify.pdf');
};



function Generate() {

  const handleGeneratePdf = () => {
    const data = {
      nome: 'Nome do Fulano',
      CPF: '999.999.999-99',
      RG: '22222222-2',
      endereço: 'endereço do fulano, xxx',
      dia: '10'
    }
    generatePdf(data);
  };
  
  

  return (
    <>
      <h1>Teste PDF</h1>
      <button onClick={handleGeneratePdf}>Gerar Orçamento</button>
    </>
  )
}

export default Generate
