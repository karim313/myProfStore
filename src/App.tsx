import './App.css'
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home';
import Category from './pages/Categories/Category';
import Cart from './pages/Cart/Cart';
import Layout from './Layouts/Layout';
import Dashboard from './pages/dashborad/Dashboard';
import {Login} from './pages/Auth/login/Login';
import { Register } from './pages/Auth/register/Register';
import FullScreenLoader from './components/Loader/FullScreenLoader';
import SpecificProduct from './pages/specificProduct/SpecificProduct';
import Wishlist from './pages/Wishlist/Wishlist';

const router = createBrowserRouter([
    {path: '/', element: <Layout />, children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: "/dashboard",
        element:<Dashboard></Dashboard>
      },
    {
      path:"/category",
      element:<Category></Category>
    },
    {
      path:"/product/:id",
      element:<SpecificProduct></SpecificProduct>
    },
    {
      path:"/cart",
      element:<Cart></Cart>
    },
    {
      path:"/wishlist",
      element:<Wishlist></Wishlist>
    }
    ]},
    {path:'/login',element:<Login/>},
    {path:'/register',element:<Register/>}
  ]);

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsAppLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return (
      <FullScreenLoader
        label="Loading store"
        subLabel="Preparing your shopping experience"
      />
    );
  }

  return <RouterProvider router={router} />;
}

export default App
