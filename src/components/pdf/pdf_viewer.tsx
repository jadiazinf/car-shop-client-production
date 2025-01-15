import { useEffect } from "react";

type Props = {
  charter: File | string | null;
};

function PdfViewer({ charter }: Props) {
  const isFile = charter instanceof File;
  const pdfUrl = isFile ? URL.createObjectURL(charter) : charter;

  useEffect(() => {
    return () => {
      if (isFile) {
        URL.revokeObjectURL(pdfUrl!);
      }
    };
  }, [pdfUrl, isFile]);

  return (
    <div className="w-full h-full">
      {pdfUrl ? (
        <iframe src={pdfUrl} className="w-full h-full" />
      ) : (
        <p>No hay PDF disponible para mostrar.</p>
      )}
    </div>
  );
}

export default PdfViewer;
