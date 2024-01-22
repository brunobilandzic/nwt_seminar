import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const Model = () => {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchModel = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/models/${id}`
      );
      setModel(response.data);
    };

    fetchModel();
  }, [id]);

  const deleteModel = async () => {
    await axios.delete(`http://localhost:3001/api/models/${id}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    navigate("/models");
  };

  if (!model) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{model.name}</h2>
      <p>{model.description}</p>
      <img src={model.image} alt={model.name} />
      <br/>
      {user && user.isAdmin && (
        <>
          <Link to={`/models/edit/${id}/`}>
            <button>Edit Model</button>
          </Link>
          <button onClick={deleteModel}>Delete Model</button>
        </>
      )}
    </div>
  );
};

export default Model;
