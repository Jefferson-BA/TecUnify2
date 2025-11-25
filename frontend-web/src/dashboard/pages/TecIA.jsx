import React from "react";
import TecIAChat from "../../components/TecIAChat";

export default function TecIA() {
  return (
    <div className="w-full space-y-8">

      <h1 className="text-3xl font-bold 
                     bg-gradient-to-r from-blue-600 to-indigo-600
                     text-transparent bg-clip-text">
        TecIA Chat
      </h1>

      <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
        <TecIAChat />
      </div>
    </div>
  );
}
