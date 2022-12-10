import { createBrowserRouter, redirect } from 'react-router-dom';
import Layout from './components/Layout';
import Buy from './pages/Buy';
import Home from './pages/Home';
import Sell from './pages/Sell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Layout />,

    children: [
      {
        path: '/',
        loader: (args) => {
          throw redirect('/home');
        },
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/buy',
        element: <Buy />,
      },
      {
        path: '/sell',
        element: <Sell />,
      },
    ],
  },
]);
