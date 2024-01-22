import React, { useEffect, useState ,useContext} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const Manufacturer = () => {
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(UserContext); 

  useEffect(() => {
    const fetchManufacturer = async () => {
      if (!id) return;
      if (manufacturer) return;
      const response = await axios.get(
        `http://localhost:3001/api/manufacturers/${id}`
      );
      console.log(response.data);
      setManufacturer(response.data);
    };

    fetchManufacturer();
  }, [id]);

  const deleteManufacturer = async () => {
    await axios.delete(`http://localhost:3001/api/manufacturers/${id}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    navigate("/manufacturers");
  }

  if (!manufacturer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{manufacturer.name}</h2>
      <p>{manufacturer.description}</p>
      <img
        src={manufacturer.logo}
        className="main-image"
        alt={manufacturer.name}
      />
      {user && user.isAdmin && (
        <>
          <Link to={`/manufacturers/edit/${id}/`}>
            <button>Edit Manufacturer</button>
          </Link>
          <button onClick={deleteManufacturer}>Delete Manufacturer</button>
        </>
      )}
    </div>
  );
};

export default Manufacturer;
