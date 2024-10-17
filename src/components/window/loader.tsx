import { Progress } from "@nextui-org/react";

function WindowLoader() {
  return (
    <div className="w-full h-full absolute flex justify-center items-center bg-white">
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
