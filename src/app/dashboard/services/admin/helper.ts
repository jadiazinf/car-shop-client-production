import { NewServiceInfo } from "./types";

class DashboardServicesAdminPageHelpers {

  static addOrRemoveOrSetElements(props: { selectedValues: number[] | "all", newServices: NewServiceInfo}): ("all" | "remove" | number) {
    const { selectedValues: sv, newServices: ns } = props;

    console.log("Selected values", sv);
    console.log("New services", ns);

    if (sv === "all")
      return "all";

    if (sv.length > ns.services.length)
      for (let counter = 0; counter < sv.length; counter++)
        if ( !ns.services.find( service => service.id === sv[counter] ) )
          return sv[counter];

    return "remove";
  }

  static arrWithRemovedService(props: {services: number[], newServices: NewServiceInfo}) {
    let arr: {id: number; price: number}[] = [];
    props.services.forEach( service => props.newServices.services.some( element => element.id === service ) && arr.push(props.newServices.services.find( element => element.id === service )!))
    return arr;
  }

  static arrWithNewService(props: {services: NewServiceInfo, newService: {id: number, price: number}}) {
    return [...props.services.services, props.newService];
  }
}

export default DashboardServicesAdminPageHelpers;
