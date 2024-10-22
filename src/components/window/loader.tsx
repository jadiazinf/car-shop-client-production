import { Progress } from "@nextui-org/react";

function WindowLoader() {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-white">
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
