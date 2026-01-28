import { SignIn } from '@clerk/nextjs'
import React from 'react';

export const dynamic = "force-dynamic";

const page = () => {
  return <SignIn />;
}

export default page