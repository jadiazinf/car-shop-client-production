interface CardInfoButtonComponentProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

function CardInfoButtonComponent(props: CardInfoButtonComponentProps) {
  return (
    <div className='flex justify-center items-center flex-col gap-2 p-5 border-1.5 border-black border-opacity-50 rounded-md bg-slate-100 bg-opacity-50 text-black text-opacity-50 hover:border-opacity-100 hover:bg-white hover:text-opacity-100 hover:scale-105 ease-in-out duration-300 cursor-pointer'>
      <span className='font-bold text-lg'>{props.title}</span>
      { props.subtitle && <span className='text-sm'>{ `Rif ${props.subtitle}` }</span> }
    </div>
  );
}

export default CardInfoButtonComponent;
