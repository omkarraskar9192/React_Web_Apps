import { StrictMode,React } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './Layout.jsx';
import { ThemeProvider } from '@material-tailwind/react';
import { Content ,Team,About,Home} from './components/index.js';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element ={<Layout/>}>
      <Route path='' element = {<Home/>}/>
      <Route path= 'about' element ={<About/>}/>
      <Route path= 'content' element ={<Content/>}/>
      <Route path= 'team' element ={<Team/>}/>

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
)
