import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import EditProfile from "../src/pages/EditProfile/EditProfile";
import Home from "../src/pages/Home/Home";
import Login from "../src/pages/Login/Login";
import Profile from "../src/pages/Profile/Profile";
import Register from "../src/pages/Register/Register";
import "../src/styles/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./Context/DarkModeContext";
import { AuthContext } from "./Context/AuthContext";
import Chat from "./pages/Chat/Chat";

function App() {
  const {currentUser} = useContext(AuthContext);

  const AuthRoute = ({children}) =>{
    if(!currentUser){
      return <Navigate to="/login" />
    }
    return children;
  }
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },
    {
      path: "/",
      element: <AuthRoute>
        <Home/>
      </AuthRoute>,
    },
    {
      path: "/profile/:username",
      element: <AuthRoute>
        <Profile/>
      </AuthRoute>,
    },

    {
      path: "/chat/:username",
      element: <AuthRoute>
        <Chat/>
        </AuthRoute>,
    },
    
    {
      path: "/profile/:username/edit",
      element: <AuthRoute>
        <EditProfile/>
        </AuthRoute>,
    },
  ]);
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
