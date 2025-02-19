import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import RatingComponent from ".";
import LogoComponent from "../logo/component";

export type CompanyRatingsProps = {
  [key: number]: number;
};

type CompanyRatingsComponentProps = {
  ratings: CompanyRatingsProps;
};

export function CompanyRatingsComponent(props: CompanyRatingsComponentProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent className="flex flex-col gap-5 justify-center items-center">
            <LogoComponent size="md" />
            <p className="font-medium">Calificaciones de la empresa</p>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <RatingComponent size="lg" rating={5} isDisabled />
                <p className="text-xs text-black text-opacity-50">
                  {`(${props.ratings[5] ?? 0})`}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <RatingComponent size="lg" rating={4} isDisabled />
                <p className="text-xs text-black text-opacity-50">
                  {`(${props.ratings[4] ?? 0})`}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <RatingComponent size="lg" rating={3} isDisabled />
                <p className="text-xs text-black text-opacity-50">
                  {`(${props.ratings[3] ?? 0})`}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <RatingComponent size="lg" rating={2} isDisabled />
                <p className="text-xs text-black text-opacity-50">
                  {`(${props.ratings[2] ?? 0})`}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <RatingComponent size="lg" rating={1} isDisabled />
                <p className="text-xs text-black text-opacity-50">
                  {`(${props.ratings[1] ?? 0})`}
                </p>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="flex flex-col w-44">
        <div className="flex items-center gap-1.5">
          <p className="text-lg">Promedio:</p>
          <RatingComponent
            size="sm"
            rating={Math.round(
              Object.entries(props.ratings).reduce(
                (prev, [key, value]) => prev + parseInt(key) * value,
                0
              ) /
                Object.values(props.ratings).reduce(
                  (prev, curr) => prev + curr,
                  0
                )
            )}
            isDisabled
          />
        </div>
        <p className="text-xs text-black text-opacity-50">{`Total de calificaciones: ${Object.values(
          props.ratings
        ).reduce((prev, curr) => prev + curr, 0)}`}</p>
        <Button
          className="w-auto"
          onClick={onOpen}
          variant="light"
          size="sm"
          radius="sm"
          color="primary"
        >
          Ver detalle
        </Button>
      </div>
    </>
  );
}
