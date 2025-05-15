"use client";
import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import "../globals.css";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ArrowUpRightIcon, UserCircleIcon } from "@heroicons/react/24/solid";
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
      <div className="bg-white rounded shadow-sm p-6 rounded-lg flex justify-between items-center w-3/4 mx-auto">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <h3 className="text-sm">{user.email}</h3>
              </div>
              <a
                href="/api/auth/logout"
                className="bg-teal text-white px-6 py-2 rounded-xl shadow-lg hover:bg-medium-teal transition"
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-semibold">General User</h1>
                <p className="text-sm">Login for User Info!</p>
              </div>
              <a
                href="/api/auth/login"
                className="bg-teal text-white px-6 py-2 rounded-xl shadow-lg hover:bg-orange-600 transition text-center"
                style={{
              padding: "8px 16px",
              fontSize: "16px",
              color: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              }}
              >
                Login
              </a>
            </>
          )}
        </div>

        <a
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1BF5JBYV3v2brBQQaRBo6X_J-uPCdDtzE4UUCDKtLPJA/edit?usp=sharing"
          className="bg-teal text-white px-6 py-2 rounded-xl shadow-lg hover:bg-medium-teal transition"
        >
          View Data Backup Spreadsheet <ArrowUpRightIcon className="inline w-4 h-4 text-white ml-1 align-text-bottom"/>
        </a>
      </div>
      
      <br></br>  

      {isAdmin && (
        <div className="flex justify-center">
          <div className="rounded-md justify-content-center w-1/2 bg-gray-100 p-4" style={{height:400}}>
            <ResponsiveContainer>
              <UserList/>
            </ResponsiveContainer>
          </div>

          <div className="ml-4">
            <iframe 
              src="https://docs.google.com/spreadsheets/d/1BF5JBYV3v2brBQQaRBo6X_J-uPCdDtzE4UUCDKtLPJA/edit?usp=sharing&embedded=true"
              style={{width: '600px', height: '400px', outline: 'none'}}
              frameBorder="0"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
