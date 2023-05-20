import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "@/routes/Main";
import MyToken from "@/routes/MyToken";

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
]);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
