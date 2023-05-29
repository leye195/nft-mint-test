import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "@/routes/Main";
import MyToken from "@/routes/MyToken";
import OnSale from "@/routes/OnSale";

import AppProvider from "@/components/AppProvider";
import Layout from "@/components/Layout";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Main />
      </Layout>
    ),
  },
  {
    path: "/my-token",
    element: (
      <Layout>
        <MyToken />
      </Layout>
    ),
  },
  {
    path: "/sale",
    element: (
      <Layout>
        <OnSale />
      </Layout>
    ),
  },
]);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
