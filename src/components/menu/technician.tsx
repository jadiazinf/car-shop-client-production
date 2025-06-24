import MenuOptionContainer from "./components/option_container";
import { LiaToolsSolid } from "react-icons/lia";
import { Accordion, AccordionItem } from "@heroui/react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdAppRegistration, MdCategory } from "react-icons/md";

function TechnicianMenuOptions() {
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
        icon={<MdCategory />}
        name="Categoría de servicios"
        url="/dashboard/catetgories"
      />
    </div>
  );
}

export default TechnicianMenuOptions;
