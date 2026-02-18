import React from "react";
import { Button } from "./button";

const Report = () => {
  return (
    <div className="h-[100vh] w-full flex justify-center items-center bg-[#EAEFEF]">
      {/* Report Section */}
      <div className="h-17vh w-33vh mt-14 flex flex-col items-center">
        <div className="h-10vh w-10vh rounded-full shadow-xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/icons/circle.png"
            alt="circle"
          />
        </div>
        <p className="w-18vh h-3vh text-[#5D5D5D]  font-bold mt-7 text-center">
          Report Successful
        </p>
        <p className="h-2vh w-30vh text-[16px] mt-1 text-center">
          Your grievance has been officially recorded
        </p>

        {/* Table Div directly below */}
        <div className="w-[50vh] border rounded-lg p-4 space-y-2 mt-7">
          <div className="flex justify-between">
            <p className="text-blue-600 bg-blue-100 rounded-lg font-semibold text-[2vh] py-1 px-2 border border-blue-300">
              Official Record
            </p>
            <p className="text-sm text-gray-600 ml-10">Generated: 2/16/2026</p>
          </div>

          {/* Complaint ID Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/icons/clipboard.png"
                alt="clipboard"
                className="h-10 w-10 text-[4vh] object-contain"
              />
              <p className="text-gray-400 -translate-x-5">Complaint ID</p>
            </div>
            <p className="text-sm text-[#5D5D5D] font-bold">CMP49641</p>
          </div>

          {/* Assigned To Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/icons/bob.png"
                alt="assigned"
                className="h-10 w-10 text-[4vh] object-contain"
              />
              <p className="text-gray-400 -translate-x-5">Assigned To</p>
            </div>
            <p className="text-sm text-[#5D5D5D]  font-bold">Water Department</p>
          </div>
        </div>

        {/* Action Button at the bottom */}
        <Button className="mt-8 ml-0.5 w-full ">Go to My Complaints →</Button>
      </div>
    </div>
  );
};

export default Report;
