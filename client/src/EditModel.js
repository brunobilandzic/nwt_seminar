import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { UserContext } from "./UserContext";

const EditModel = () => {
  const { id } = useParams();
  const [model, setModel] = useState({
    name: "",
    description: "",
    manufacturer: "",
    image: "",
  });
  const { user, token } = useContext(UserContext);
  const [manufacturers, setManufacturers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchModel = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/models/${id}`
      );
      setModel(response.data);
    };
    const fetchManufacturers = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/manufacturers"
      );
      setManufacturers(response.data);
    };

    fetchManufacturers();
    fetchModel();
  }, [id]);

  const handleChange = (event) => {
    setModel({ ...model, [event.target.name]: event.target.value });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.put(
      `http://localhost:3001/api/models/${id}`,
      {
        ...model,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/models`);
  };

  if (user && !user.isAdmin) {
    return <div>Access denied</div>;
  }

  if (!user) {
    return <div>Access denied</div>;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={model.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={model.description}
          onChange={handleChange}
        />
      </label>
      <label>
        New image link:
        <input
          type="text"
          name="image"
          value={model.image}
          onChange={handleChange}
        />
      </label>
      <label>
        Manufacturer:
        <select name="manufacturer" onChange={handleChange}>
          {manufacturers?.map((manufacturer) => (
            <option
              selected={manufacturer._id == model.manufacturer}
              value={manufacturer._id}>
              {manufacturer.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Update Model</button>
    </form>
  );
};

export default EditModel;
