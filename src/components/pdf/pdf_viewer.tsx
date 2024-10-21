type Props = {
  charter: File | string | null;
}

function PdfViewer({ charter }: Props) {

  const isFile = charter instanceof File;
  const pdfUrl = isFile ? URL.createObjectURL(charter) : charter;

  return (
    <div>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
          sandbox="allow-same-origin allow-scripts allow-popups"
        />
      ) : (
        <p>No hay PDF disponible para mostrar.</p>
      )}
    </div>
  );
};

export default PdfViewer;
