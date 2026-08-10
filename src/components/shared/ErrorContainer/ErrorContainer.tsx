import { TriangleAlert } from "lucide-react";

interface ErrorContainerProps {
  message: string;
}

const ErrorContainer = ({ message }: ErrorContainerProps) => {
  return (
    <div className="">
      <div className="flex h-[300px] w-full flex-col items-center justify-center bg-primary/10 rounded-[12px]">
        <TriangleAlert className="text-red-500 w-20 h-20" />
        <h3 className="mt-2 text-black font-semibold text-base md:text-lg leading-[150%]">{message}</h3>
      </div>
    </div>
  );
};

export default ErrorContainer;