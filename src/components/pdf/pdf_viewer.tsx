import { useEffect } from "react";

type Props = {
  charter: File | string | null;
}

function PdfViewer({ charter }: Props) {

  const isFile = charter instanceof File;
  const pdfUrl = isFile ? URL.createObjectURL(charter) : charter;

  useEffect(() => {
    // Limpia el objeto URL al desmontar el componente
    return () => {
      if (isFile) {
        URL.revokeObjectURL(pdfUrl!);
      }
    };
  }, [pdfUrl, isFile]);

  return (
    <div>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full"
        />
      ) : (
        <p>No hay PDF disponible para mostrar.</p>
      )}
    </div>
  );
};

export default PdfViewer;
