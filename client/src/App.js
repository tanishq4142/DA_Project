import {Route, BrowserRouter as Router,Routes} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginForm from "./components/LoginPage/LoginPage";
import Register from "./components/Register/Register";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";

import UserInfo from "./components/UserInfo/UserInfo";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route exact path="/loginpage" element={  <LoginForm/> } ></Route>
        <Route exact path="/register" element={  <Register/> } ></Route>
        <Route exact path="/userinfo" element={  <UserInfo/> } ></Route>
        <Route exact path="/dashboard" element={  <Dashboard/> } ></Route>
        <Route exact path="/updateprofile" element={  <UpdateProfile/> } ></Route>


        </Routes>
      </Router>
    </div>
  );
}

export default App;
