import { Avatar, Button } from "@nextui-org/react";
import { FaCamera } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from "react";
import { ToasterContext } from "../toaster/context/context";

interface AvatarComponentProps {
  imgUrl?: string;
  onChangeAvatar: (url: File) => void;
  isLoading?: boolean;
}

function AvatarComponent(props: AvatarComponentProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { dispatch } = useContext(ToasterContext);

  useEffect(() => {
    if (selectedFile)
      props.onChangeAvatar(selectedFile);
}, [selectedFile]);

  function handleButtonClick() {
      if (fileInputRef.current)
        fileInputRef.current.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
        const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        if (validFormats.includes(file.type)) {
            setSelectedFile(file);
        } else {
            dispatch({payload: "Por favor, selecciona un archivo en formato JPEG, JPG o PNG.", type: "ERROR" });
            setSelectedFile(null);
        }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-center md:justify-normal">
      {
        <div className="cursor-pointer">
          <Avatar className="w-32 h-32" showFallback src={props.imgUrl} fallback={
            <FaCamera className="text-gray-600 w-5 h-5"/>
          } />
        </div>
      }
      <div className="flex flex-col gap-2 ml-0 md:ml-5">
        <div className='w-auto'>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            radius="sm"
            variant="faded"
            className="bg-slate-300 bg-opacity-10 border-1.5"
            onClick={handleButtonClick}
            isLoading={props.isLoading}
          >
            Cambiar foto
          </Button>
        </div>
        <p className='text-sm text-black text-opacity-50'>Por lo menos 800x800 px recomendado<br/>solo JPG o PNG está permitdo</p>
      </div>
    </div>
  );
}

export default AvatarComponent;
