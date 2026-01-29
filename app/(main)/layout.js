import React from 'react'
export const dynamic = "force-dynamic";
const MainLayout = ({ children }) => {
  return <div className="container mx-auto px-4 my-20 md:my-28">
    {children}
  </div>;
};

export default MainLayout