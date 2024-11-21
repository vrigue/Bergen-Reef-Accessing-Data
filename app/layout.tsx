import React from 'react';
import './globals.css' // These styles apply to every route in the application
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata = {
  title: 'Plumbing',
  description: 'Due Thursday',
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang='en' suppressHydrationWarning>
        <UserProvider>
          <body>{children}</body>
        </UserProvider>
        
      </html>
    )
  }
