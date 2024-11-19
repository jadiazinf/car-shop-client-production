import { Progress } from "@nextui-org/react";

type Props = {
  message?: string;
}

function WindowLoader(props: Props) {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex flex-col gap-3 items-center justify-center z-50 bg-white">
      <p className="text-primary">{ props.message }</p>
      <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md"
      />
    </div>
  );
}

export default WindowLoader;
