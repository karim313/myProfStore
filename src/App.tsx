import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home';
import Category from './pages/Categories/Category';
import Cart from './pages/Cart/Cart';
import Layout from './Layouts/Layout';
import Dashboard from './pages/dashborad/Dashboard';


function App() {

  let x = createBrowserRouter([
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
      path:"/cart",
      element:<Cart></Cart>
    }
    ]},
  ]);

  return <>
  <RouterProvider router={x}></RouterProvider> 
  </>
}

export default App
