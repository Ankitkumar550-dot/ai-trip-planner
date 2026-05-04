'use client'

import React, { useEffect, useState, useContext } from 'react'
import Header from './_components/Header';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { TripDetailContext } from '@/context/TripDetailContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>();
  const CreateUser = useMutation(api.user.CreateNewUser);
  const [tripDetail, setTripDetail] = useState<any>();

  useEffect(() => {
    user && CreateNewUser();
  }, [user])

  const CreateNewUser = async () => {
    const result = await CreateUser({
      name: user?.fullName ?? '',
      email: user?.primaryEmailAddress?.emailAddress ?? '',
      imageUrl: user?.imageUrl ?? ''
    });
    setUserDetail(result);
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{ tripDetail, setTripDetail }}>
        <div>
          <Header />
          {children}
        </div>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}

export const useTripDetail = () => {
  return useContext(TripDetailContext);
}

