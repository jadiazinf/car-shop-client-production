import { useContext, useEffect } from "react";
import BrandAndModelContext from "../contexts/brand_and_model";
import SelectComponent from "../../../components/inputs/select";
import useGetModelsByBrand, { GetModelsByBrandIdProps } from "../services/get_by_brand_id/use_get_by_brand_id";
import useGetAllBrands, { GetAllBrandsProps } from "../../brand/services/get_all/use_get_all";

function SelectBrandAndModelComponent() {

  const { brandAndModel, setBrandAndModel } = useContext(BrandAndModelContext);

  const { isGettingBrandsLoading, payloadState: brands, performGetAllBrands } = useGetAllBrands();

  const { isGettingModelsLoading, payloadState: models, performGetModelsByBrand } = useGetModelsByBrand();

  useEffect(() => {
    performGetAllBrands();
  }, []);

  useEffect(() => {
    if (brandAndModel && brandAndModel.brand)
      performGetModelsByBrand({brand_id: brandAndModel.brand.id!});
  }, [brandAndModel?.brand]);

  return (
    <div className='w-full flex flex-col md:flex-row gap-5'>
      <SelectComponent
        label="Marca"
        key="brand"
        name="brand"
        onChange={(e) => setBrandAndModel({model: brandAndModel?.model || null, brand: (brands as GetAllBrandsProps).payload.find( element => element.id === parseInt(e.target.value) )!})}
        value={brandAndModel?.brand?.id?.toString() || ''}
        isDisabled={brands === 'not loaded' || isGettingBrandsLoading}
        data={(brands as GetAllBrandsProps).payload?.map( element => ({key: element.id?.toString() || '', label: element.name}) ) || []}
      />
      <SelectComponent
        label="Modelo"
        key="model"
        name="model"
        onChange={(e) => setBrandAndModel({brand: brandAndModel?.brand || null, model: (models as GetModelsByBrandIdProps).payload.find( element => element.id === parseInt(e.target.value) )!})}
        value={brandAndModel?.model?.id?.toString() || ''}
        isDisabled={models === 'not loaded' || models.payload === null || isGettingModelsLoading}
        data={(models as GetModelsByBrandIdProps).payload?.map( element => ({key: element.id?.toString() || '', label: element.name}) ) || []}
      />
    </div>
  );
}

export default SelectBrandAndModelComponent;
