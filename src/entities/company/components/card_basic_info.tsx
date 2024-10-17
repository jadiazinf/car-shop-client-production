import CardInfoButtonComponent from "../../../components/card-info-button/component";
import CompanyModel from "../model";

type CompanyBasicInfoProps = {
  company: CompanyModel;
}

function CompanyCardBasicInfo(props: CompanyBasicInfoProps) {
  const { company } = props

  return <CardInfoButtonComponent title={company.name} subtitle={`(${company.dni})`}/>;
}

export default CompanyCardBasicInfo;
