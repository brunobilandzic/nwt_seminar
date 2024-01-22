import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("http://localhost:3001/api/users");
      const body = await response.json();
      setUsers(body);
    };

    getUsers();
  }, []);
  return (
    <div>
      {users?.map((user) => {
        return (
          <Link to={`/users/${user._id}`}>
            <div>{user.username}</div>
          </Link>
        );
      })}
    </div>
  );
}
