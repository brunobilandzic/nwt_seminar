import React, { useContext, useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router";
const baseUrl = "http://localhost:3001/api";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUser, user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
      const response = await axios.post(`${baseUrl}/register`, { username, password });
    console.log(response.data.token);
    
    setUser(response.data.user)
    localStorage.setItem("token", response.data.token);
  };
  
  useEffect(() => {
    if (user)
      navigate("/")
  }, [user])
  
    

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="username">Username</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>
      <Button type="submit">Register</Button>
    </Form>
  );
}

export default Register;
