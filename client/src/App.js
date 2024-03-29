import "./App.css";
import { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import EditMatch from "./components/matches/editMatch";
import Error404Page from "./components/404";
import Loading from "./components/utils/Loading";
import NavigationBar from "./components/utils/NavigationBar";
import GroupProfile from "./components/profiles/groups/GroupProfile";
import PasswordReset from "./components/PasswordReset";
import CreateMatch from "./components/matches/createMatch";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line
  const [name, setName] = useState("");
  const [allGroups, setAllGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuth = async () => {
    setIsLoading(true);
    if (localStorage.token) {
      try {
        setIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);
        const response = await fetch("/api/auth/authentication", {
          method: "GET",
          headers: myHeaders,
        });
        const parseRes = await response.json();
        parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isAuth();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <Fragment>
      <NavigationBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} name={name} />
      <Fragment>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Router>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              exact
              path="/"
              // prettier-ignore
              element={isAuthenticated ? (<Dashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>) : (<Home />)}
            />
            <Route
              exact
              path="/cadastro"
              element={
                !isAuthenticated ? (
                  <Register isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/painel" isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route exact path="/grupo/:id" element={<GroupProfile isAuthenticated={isAuthenticated} />} />
            <Route
              exact
              path="/senha/redefinir/:requestId"
              element={
                !isAuthenticated ? (
                  <PasswordReset isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/painel" />
                )
              }
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/painel"
              element={
                isAuthenticated ? (
                  <Dashboard
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                    allGroups={allGroups}
                    setAllGroups={setAllGroups}
                  />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/partida/nova/:id"
              element={isAuthenticated ? <CreateMatch isAuthenticated={isAuthenticated} /> : <Navigate to="/painel/" />}
            />
            <Route path="/partida/:id" element={<EditMatch isAuthenticated={isAuthenticated} />} />

            {/* 404 */}
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </Router>
      </Fragment>
    </Fragment>
  );
}

export default App;
