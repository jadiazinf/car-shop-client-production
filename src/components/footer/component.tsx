import { Link } from "@heroui/react";
import LogoComponent from "../logo/component";

export function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white py-8 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5">
          <LogoComponent size="2xl" color="text-white"/>
        </div>
        <p className="mb-2">Caracas, Venezuela</p>

        <p className="mb-4">
          Soporte:{' '}
          <Link
            href="mailto:mgratero@gmail.com"
            className="text-white hover:text-gray-300"
            isExternal
          >
            mgratero@gmail.com
          </Link>
        </p>

        <div className="border-t border-white/20 pt-4 mt-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Carshop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
