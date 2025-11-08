"use client";

import Image from "next/image";

export const Compass = () => {
  return (
    <div className="absolute bottom-6 left-6 z-20 flex items-center justify-center">
      <div className="relative">
        <Image
          src="/compass.svg"
          alt="Compass"
          width={200}
          height={200}
          className="drop-shadow-md"
        />
      </div>
    </div>
  );
};
