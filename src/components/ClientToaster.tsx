"use client";

import dynamic from "next/dynamic";

const LazyToaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false },
);

export default function ClientToaster() {
  return (
    <LazyToaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "14px",
          background: "#162218",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 600,
        },
      }}
    />
  );
}
