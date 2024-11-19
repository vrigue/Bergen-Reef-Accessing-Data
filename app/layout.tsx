import React from 'react';
import './globals.css' // These styles apply to every route in the application
 
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
        <body>{children}</body>
      </html>
    )
  }