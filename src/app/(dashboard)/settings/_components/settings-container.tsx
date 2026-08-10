import { Key, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const SettingsContainer = () => {
  return (
    <div className="p-6">
      <div className="w-full flex flex-col items-center gap-5  bg-white border-[1px] border-[#E7E7E7] p-2 rounded-[8px]">
        <Link className="w-full" href="/settings/personal-information">
          <button className="bg-white w-full flex items-center gap-2 text-base font-semibold text-primary leading-[150%] rounded-[6px] p-4 shadow-[0px_4px_6px_0px_#0000001A] hover:border">
            <User /> Profile
          </button>
        </Link>

        <Link className="w-full" href="/settings/change-password">
          <button className=" bg-white w-full flex items-center gap-2 text-base font-semibold text-primary leading-[150%] rounded-[6px] p-4 shadow-[0px_4px_6px_0px_#0000001A] hover:border">
            <Key /> Password
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SettingsContainer;
