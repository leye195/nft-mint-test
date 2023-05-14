import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppProvider from "@/components/AppProvider";
import Main from "@/routes/Main";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
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
