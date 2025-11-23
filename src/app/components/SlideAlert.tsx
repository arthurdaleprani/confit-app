"use client";
import { useEffect } from "react";

export default function SlideAlert({ message, type, onClose }: any) {

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        fixed top-4 right-4 min-w-[260px] max-w-[380px]
        rounded-lg shadow-lg px-4 py-3 text-white
        animate-slide-in
        ${type === "error" ? "bg-red-500" : "bg-green-600"}
      `}
    >
      {message}
    </div>
  );
}
