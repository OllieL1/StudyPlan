import Head from 'next/head';
import React from 'react';

interface CommonHeadProps {
  title: string;
  description?: string;
  favicon?: string;
}

const CommonHead: React.FC<CommonHeadProps> = ({ 
  title, 
  description = "Ollie's Study Tracker - Track your study sessions and progress",
  favicon = "/icon.png"
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" 
        rel="stylesheet"
      />
      
      {/* Favicon */}
      <link rel="icon" href={favicon} type="image/png" />
      
      {/* Font Awesome */}
      <link 
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </Head>
  );
};

export default CommonHead;