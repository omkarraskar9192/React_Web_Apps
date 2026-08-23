import React from "react"
import {Outlet} from 'react-router-dom'
import {Header} from "./components/index.js";


export default function Layout(){

    return (
        <>
            <Header/>
            <Outlet/>
            

        
        
        </>
    )
}