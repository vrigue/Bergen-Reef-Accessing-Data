'use client'
import React from 'react';
import './globals.css'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "26 Nov.",
    pH: 8.1,
    salt: 3.5,
    amt: 2400,
  },
  {
    name: "12:00 pm",
    pH: 8.2,
    salt: 3.7,
    amt: 2210,
  },
  {
    name: "27 Nov.",
    pH: 8.3,
    salt: 3.5,
    amt: 2290,
  },
  {
    name: "12:00 pm",
    pH: 7.9,
    salt: 3.2,
    amt: 2000,
  },
  {
    name: "28 Nov.",
    pH: 8.1,
    salt: 3.5,
    amt: 2181,
  },
  {
    name: "12:00 pm",
    pH: 7.8,
    salt: 3.6,
    amt: 2500,
  },
  {
    name: "29 Nov.",
    pH: 8.05,
    salt: 3.3,
    amt: 2100,
  },
];

export default function Page() {
  return (
    <div>
      <br></br>
      <h1 className="text-3xl font-bold underline">Hello, Home page!</h1>
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pH"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="salt" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>

    </div>
  );
}