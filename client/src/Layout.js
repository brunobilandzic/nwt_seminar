import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log(token);
    if (token) {
      const fetchUser = async () => {
        const response = await axios.get(`${baseUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      };
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token: localStorage.getItem("token") }}>
      <div>
        <div>
          <nav>
            <ul className="navbarlist">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/users">All Users</Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>{" "}
                </>
              )}

              <li>
                <Link to="/models">Models</Link>
              </li>
              {user && user.isAdmin && (
                <>
                  <li>
                    <Link to="/models/new">Add Model</Link>
                  </li>
                  <li>
                    <Link to="/manufacturers/new">Add Manufacturer</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/manufacturers">Manufacturers</Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/login" onClick={logout}>
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <div className="main">{children}</div>
      </div>
    </UserContext.Provider>
  );
}
