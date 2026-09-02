import './App.css'
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home';
import Category from './pages/Categories/Category';
import Cart from './pages/Cart/Cart';
import Layout from './Layouts/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import { AuthPage } from './pages/Auth/AuthPage';
import FullScreenLoader from './components/Loader/FullScreenLoader';
import SpecificProduct from './pages/specificProduct/SpecificProduct';
import Wishlist from './pages/Wishlist/Wishlist';
import { Toaster } from 'sonner';
import Deal from './pages/deal/Deal';
import Orders from './pages/Orders/Orders';
import { ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter([
    {path: '/', element: <Layout />, children: [
      {
        index: true,
        element: <Home></Home>
      },
    {
      path:"/category",
      element:<Category></Category>
    },
    {
      path:"/product/:id",
      element: (
        <ProtectedRoute>
          <SpecificProduct></SpecificProduct>
        </ProtectedRoute>
      )
    },
    {
      path:"/cart",
      element: (
        <ProtectedRoute>
          <Cart></Cart>
        </ProtectedRoute>
      )
    },
    {
      path:"/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard></Dashboard>
        </ProtectedRoute>
      )
    },
    {
      path:"/wishlist",
      element: (
        <ProtectedRoute>
          <Wishlist></Wishlist>
        </ProtectedRoute>
      )
    },
    {
      path:"deals",
      element: (
        <ProtectedRoute>
          <Deal/>
        </ProtectedRoute>
      )
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      )
    }
    
    ]},
    {path:'/login',element:<AuthPage/>},
    {path:'/register',element:<AuthPage/>}
  ],
  {
    future: {
      v7_startTransition: true,
    },
  });

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

  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App
