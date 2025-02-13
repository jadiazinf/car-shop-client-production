import { useState } from "react";
import { useDropzone } from "react-dropzone";

function FileDropzone(props: {
  text: string;
  onDrop: (acceptedFiles: File[]) => void;
}) {
  const [_, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    props.onDrop(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center cursor-pointer">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Suelta los archivos aquí...</p>
        ) : (
          <p className="text-gray-600">{props.text}</p>
        )}
      </div>

      {/* {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Archivos seleccionados:</h3>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index} className="text-gray-700">
                {file.name}
              </li>
            ))}
          </ul>
          <p className="text-gray-600">Total de archivos: {files.length}</p>
        </div>
      )} */}
    </div>
  );
}

export default FileDropzone;
