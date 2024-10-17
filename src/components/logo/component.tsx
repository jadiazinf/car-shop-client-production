function LogoComponent(props: {size?: 'xl' | 'sm' | 'md' | 'lg' | '2xl' | '3xl' | '4xl'}) {
  return (
    <span
      className={`font-playwrite font-bold text-black ${props.size ? `text-${props.size}` : 'text-sm'}`}
    >
      Carshop
    </span>
  );
}

export default LogoComponent;
