"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "../globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import ProfileClient from "../components/ProfileClient";
import NavigationBar from "../components/NavigationBar";
import { isUserAdmin } from '../../actions/isUserAdmin';
import { redirect } from "next/navigation";
import { ResponsiveContainer } from "recharts";
import { getUsersRoles } from "../../actions/getUsersRoles"
import UserList from "app/components/UserList";


export default function Page() {
  const { user, error, isLoading } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      }
    }
    checkAdmin();
    console.log(isAdmin);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={(user) ? user.name : "Guest"}/>
      <br></br>
      <br></br>

      {/* top white box*/}
      <div className="bg-white rounded shadow-sm p-6 rounded-lg flex justify-between items-center w-1/2 mx-auto">
        
        {user ? (
          <div>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <h3 className="text-sm">{user.email}</h3>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold">General User</h1>
            <p className="text-sm">Login for User Info!</p>
          </div>
        )}
        <div>
        </div>
        <div className="flex flex-col space-y-4">
          {!user && (
            <a
            href="/api/auth/login"
            className="bg-teal text-white px-6 py-2 rounded-xl shadow-lg hover:bg-orange-600 transition text-center"
          >
             Login
          </a>
          )}
          <a
            href="/api/auth/logout"
            className="bg-teal text-white px-6 py-2 rounded-xl shadow-lg hover:bg-orange-600 transition"
          >
            Logout
          </a>
        </div>
      </div>
      
      <br></br>  

      {isAdmin && (
        <div className="flex justify-center">
        <div className="rounded-md justify-content-center w-2/3 bg-gray-100 p-4" style={{height:400}}>
          <ResponsiveContainer>
            <UserList/>
          </ResponsiveContainer>
        </div>
      </div>
      )}
    </div>
  );
}
