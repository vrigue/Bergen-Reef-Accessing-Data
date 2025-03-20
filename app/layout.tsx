import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./globals.css"; // These styles apply to every route in the application
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata = {
  title: "Coral Reeve",
  description: "Data Visualization Web Application for the BCA Coral Reef Research Lab ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <body>{children}</body>
      </UserProvider>
    </html>
  );
}