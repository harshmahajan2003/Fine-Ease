import { SignUp } from '@clerk/nextjs'
import React from 'react';

export const dynamic = "force-dynamic";

const page = () => {
  return <SignUp />;
};

export default page