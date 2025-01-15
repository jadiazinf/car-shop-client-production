import { useContext } from "react";
import { HeaderBreadcrumbItemProps } from "../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../components/breadcrumbs/context";
import { usePersistedStore } from "../../store/store";
import UserInfo from "../../entities/user/components/info";

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Perfil",
    url: "/profile",
  },
];

export default function ProfilePage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);
  setBreadcrumbs(BreadCrumbsItems);

  const { sessionType } = usePersistedStore().authReducer;

  return (
    <div className="w-full">
      <UserInfo user={sessionType!.user!} isUpdatable />
    </div>
  );
}
