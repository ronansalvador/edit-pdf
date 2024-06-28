import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Header from '../components/header';

const modifyPdf = async (pdfBytes, contents) => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  for (const content of contents) {
    const { type, x, y, value } = content;

    if (type === 'text') {
      firstPage.drawText(value, {
        x: Number(x),
        y: Number(y),
        size: 12,
        color: rgb(0, 0, 0),
      });
    } else if (type === 'image') {
      let imageBytes;
      if (value instanceof File) {
        // Carregar imagem do arquivo selecionado
        imageBytes = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function () {
            const result = reader.result;
            const bytes = new Uint8Array(result);
            resolve(bytes);
          };
          reader.readAsArrayBuffer(value);
        });
      } else {
        // Carregar imagem de uma URL
        imageBytes = await fetch(value).then((res) => res.arrayBuffer());
      }

      // Verificar se o tipo de arquivo é PNG
      if (value.name && value.name.toLowerCase().endsWith('.png')) {
        const image = await pdfDoc.embedPng(imageBytes);
        firstPage.drawImage(image, {
          x: Number(x),
          y: Number(y),
          width: 100,
          height: 100,
        });
      } else {
        alert('Somente imagens PNG são suportadas.');
      }
    }
  }

  const pdfBytesModified = await pdfDoc.save();
  return pdfBytesModified;
};

const generatePdf = async (file, contents) => {
  const existingPdfBytes = await file.arrayBuffer();
  const modifiedPdfBytes = await modifyPdf(existingPdfBytes, contents);

  const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'declaracaoModify.pdf');
};

function Generate() {
  const [contents, setContents] = useState([
    { type: 'text', x: '', y: '', value: '', description: '' }
  ]);
  const [file, setFile] = useState(null);

  const handleAddContent = () => {
    setContents([...contents, { type: 'text', x: '', y: '', value: '', description: '' }]);
  };

  const handleContentChange = (index, key, value) => {
    const newContents = contents.map((content, i) =>
      i === index ? { ...content, [key]: value } : content
    );
    if (key === 'value') {
      if (contents[index].type === 'text') {
        newContents[index]['value'] = value; // Atualiza o valor do conteúdo diretamente
      } else {
        newContents[index]['value'] = value instanceof File ? value : value; // Atualiza o arquivo selecionado
      }
    }
    setContents(newContents);
  };

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    handleContentChange(index, 'value', selectedFile);
  };

  const handleBaseFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleGeneratePdf = async () => {
    if (file) {
      try {
        await generatePdf(file, contents);
      } catch (error) {
        alert('Ocorreu um erro ao gerar o PDF modificado.');
        console.error(error);
      }
    } else {
      alert('Por favor, carregue um arquivo PDF base.');
    }
  };

  return (
    <>
      <Header />
      <h1>Alterar PDF</h1>
      <label htmlFor="pdfBaseFile">Selecione um arquivo PDF base:</label>
      <input id="pdfBaseFile" type="file" accept="application/pdf" onChange={handleBaseFileChange} />
      {contents.map((content, index) => (
        <div key={index}>
          <select
            value={content.type}
            onChange={(e) => handleContentChange(index, 'type', e.target.value)}
          >
            <option value="text">Texto</option>
            <option value="image">Imagem</option>
          </select>
          <input
            type="text"
            placeholder="Eixo X"
            value={content.x}
            onChange={(e) => handleContentChange(index, 'x', e.target.value)}
          />
          <input
            type="text"
            placeholder="Eixo Y"
            value={content.y}
            onChange={(e) => handleContentChange(index, 'y', e.target.value)}
          />
          {content.type === 'image' &&
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
            />
          }
          {content.type === 'text' &&
            <input
              type="text"
              placeholder="Conteúdo"
              value={content.value}
              onChange={(e) => handleContentChange(index, 'value', e.target.value)}
            />
          }
          <input
            type="text"
            placeholder="Descrição"
            value={content.description}
            onChange={(e) => handleContentChange(index, 'description', e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddContent}>Adicionar Conteúdo</button>
      <button onClick={handleGeneratePdf}>Gerar PDF</button>
      {contents.length > 0 && contents.map((content, index) => (
        content.x && content.y && content.description && (
          <div key={index}>
            <p>{`${content.description}: X = ${content.x}, Y = ${content.y}: ${content.value instanceof File ? content.value.name : content.value}`}</p>
          </div>
        )
      ))}
    </>
  );
}

export default Generate;
