

import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import React from "react";

interface Props {
  message: string;
}

const NotFound = ({ message }: Props) => {
  return (
    <div className="">
      <div className="bg-primary/10 h-[360px] w-full flex flex-col items-center justify-center rounded-[20px]">
        {/* Image */}
        <Image
          src="/assets/images/not_found_page.png"
          alt="404 Not Found"
          width={300}
          height={300}
          priority
          unoptimized
          className="mb-4 w-[250px] h-[150px]"
        />

        {/* Text Animation applied to message string only */}
        <p className="text-lg font-bold text-gradient text-center w-1/2">
          <TextAnimate animation="slideUp" by="word">
            {message}
          </TextAnimate>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
