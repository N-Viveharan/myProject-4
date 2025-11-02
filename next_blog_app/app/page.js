'use client'

import BlogList from "@/Components/BlogList";
import Fooder from "@/Components/Fooder";
import Header from "@/Components/Header";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
    <ToastContainer theme="dark"/>
    <Header/>
    <BlogList/>
    <Fooder/>
    </>
  );
}
