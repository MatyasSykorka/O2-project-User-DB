import React from 'react'
import ReactDOM from 'react-dom/client'
import Home, { loader } from './routes/Home.tsx'
import Registrace from './routes/Register.tsx'
import Login, { loader as loginLoader } from './routes/Login.tsx'
import Database, { loader as DatabaseLoader } from './routes/Database.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import "./index.css"
import { Toaster } from 'react-hot-toast'
import { loginAction, registerAction } from './components/ui/UWindow.tsx'
import UpdateProfile, { loader as UpdateProfileLoader } from './routes/UpdateProfile.tsx'
import UpdatePW, { loader as UpdatePWLoader } from './routes/UpdatePassword.tsx'
import { UpdateProfileAction, UpdatePWAction } from './components/ui/UpdateWindow.tsx'
import AboutThis, {loader as AboutThisLoader} from './routes/AboutIt.tsx'
import Tickets, {loader as TicketsLoader} from './routes/Tickets.tsx'
// import AboutThis from './routes/AboutIt.tsx'


const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      loader: loader
    },
    {
      path: '/login',
      element: <Login />,
      action: loginAction,
      loader: loginLoader
    },
    {
      path: '/users',
      element: <Database />,
      loader: DatabaseLoader
    },
    {
      path: '/register',
      element: <Registrace />,
      action: registerAction
    },
    {
      path: '/update-profile',
      element: <UpdateProfile />,
      action: UpdateProfileAction,
      loader: UpdateProfileLoader
    },
    {
      path: '/update-password',
      element: <UpdatePW />,
      action: UpdatePWAction,
      loader: UpdatePWLoader
    },
    {
      path: '/about',
      element: <AboutThis />,
      loader: AboutThisLoader
    },
    {
      path: '/tickets',
      element: <Tickets />,
      loader: TicketsLoader
    }
  ]
)


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
    <Toaster 
      position='bottom-center'
    />
  </React.StrictMode>,
)
