
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
        <div className="h-screen flex flex-col w-full  items-center justify-center">
          {children}
        </div>
  );
}
