import { GoTools } from "react-icons/go";
import MenuOptionContainer from "./components/option_container";
import { LiaToolsSolid } from "react-icons/lia";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { IoBarChartSharp, IoDocumentTextOutline } from "react-icons/io5";
import { MdAppRegistration } from "react-icons/md";

function AdminMenuOptions() {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Accordion variant="light" className="border-b-0.5 border-black">
        <AccordionItem title="Compañía" startContent={<LiaToolsSolid />}>
          <div className="flex flex-col gap-2">
            <MenuOptionContainer
              icon={<IoDocumentTextOutline />}
              name="Información"
              url="/dashboard/companies"
            />
            <MenuOptionContainer
              icon={<MdAppRegistration />}
              name="Peticiones"
              url="/dashboard/companies/requests"
            />
          </div>
        </AccordionItem>
      </Accordion>
      <MenuOptionContainer
        icon={<GoTools />}
        name="Servicios"
        url="/dashboard/services"
      />
      <MenuOptionContainer
        icon={<IoBarChartSharp />}
        name="Reportes"
        url="/dashboard/reports"
      />
    </div>
  );
}

export default AdminMenuOptions;
