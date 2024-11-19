import { HeaderBreadcrumbItemProps } from "../components/breadcrumbs/header";

class LayoutHelper {

  static getBreadcrumbOptions(path: string):HeaderBreadcrumbItemProps[] {
    return path.split("/").map( element => ({
      text: "",
      url: ""
    }) );
  }

}

export default LayoutHelper;
