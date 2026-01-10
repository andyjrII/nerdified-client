"use client";

import { SyncLoader } from "react-spinners";

const Spinners = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SyncLoader color="#2563eb" size={15} />
    </div>
  );
};

export default Spinners;
