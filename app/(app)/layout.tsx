import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center items-center overflow-hidden w-screen h-screen">
      {children}
    </div>
  );
}
