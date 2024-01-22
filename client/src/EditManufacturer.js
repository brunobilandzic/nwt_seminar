import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { UserContext } from "./UserContext";

const EditManufacturer = () => {
  const { id } = useParams();

  const [manufacturer, setManufacturer] = useState(null);
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedModels, setSelectedModels] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchManufacturer = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/manufacturers/${id}`
      );
      setManufacturer(response.data);
      setSelectedModels(response.data.models?.map((model) => model._id));
    };
    const fetchModels = async () => {
      const response = await axios.get("http://localhost:3001/api/models");
      setModels(response.data);
    };
    fetchManufacturer();
    fetchModels();
  }, [id]);

  const handleChange = (event) => {
    setManufacturer({
      ...manufacturer,
      [event.target.name]: event.target.value,
    });
  };

  const handleModelSelection = (event) => {
    const { value } = event.target;
    let updatedSelectedModels = [...selectedModels];

    if (selectedModels.includes(value)) {
      updatedSelectedModels = updatedSelectedModels.filter(
        (model) => model !== value
      );
    } else {
      updatedSelectedModels.push(value);
    }

    setSelectedModels(updatedSelectedModels);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.put(
      `http://localhost:3001/api/manufacturers/${id}`,
      {
        ...manufacturer,
        models: selectedModels,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/manufacturers`);
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
          value={manufacturer?.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={manufacturer?.description}
          onChange={handleChange}
        />
      </label>
      <label>
        New logo link:
        <input
          type="text"
          name="image"
          value={manufacturer?.logo}
          onChange={handleChange}
        />
      </label>
      <label>
        Models:
        {models?.map((model) => (
          <div key={model._id}>
            <input
              type="checkbox"
              name="models"
              value={model._id}
              checked={selectedModels.includes(model._id)}
              onChange={handleModelSelection}
            />
            {model?.name}
          </div>
        ))}
      </label>
      <button type="submit">Update Model</button>
    </form>
  );
};

export default EditManufacturer;
