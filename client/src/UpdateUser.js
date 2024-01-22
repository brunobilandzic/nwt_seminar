import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

function UpdateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`http://localhost:3001/api/users/${id}`);
      setEmail(response.data.email);
      setPassword(response.data.password);
    };

    getUser();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:3001/api/users/${id}`,
        {
          email,
          password,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Update User</button>
      <h1>cajiasa</h1>
    </form>
  );
}

export default UpdateUser;
