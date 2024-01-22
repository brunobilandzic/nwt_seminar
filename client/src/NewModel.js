import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewModel = () => {
  const { user, token } = useContext(UserContext);

  const [manufacturers, setManufacturers] = useState([]);
  const navigate = useNavigate();
  const [model, setModel] = useState(null);

  const handleChange = (event) => {
    setModel({ ...model, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    const fetchManufacturers = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/manufacturers"
      );
      setManufacturers(response.data);
      setModel({ ...model, manufacturer: response.data[0]._id });
    };

    fetchManufacturers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(
      "http://localhost:3001/api/models",
      {
        ...model,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate("/models");
  };
  if (user && !user.isAdmin) {
    return <div>Access denied</div>;
  }

  if (!user) {
    return <div>Access denied</div>;
  }

  return (
    // JSX code for the component's UI goes here
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={model?.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={model?.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Image link:
        <input
          type="text"
          name="image"
          value={model?.image}
          onChange={handleChange}
        />
      </label>
      <select name="manufacturer" onChange={handleChange}>
        {manufacturers?.map((manufacturer) => (
          <option value={manufacturer._id}>{manufacturer.name}</option>
        ))}
      </select>
      <button type="submit">Add Model</button>
    </form>
  );
};

export default NewModel;
