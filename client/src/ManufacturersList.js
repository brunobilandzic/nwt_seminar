import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";

const ManufacturersList = () => {
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      const response = await axios.get(
        "http://localhost:3001/api/manufacturers"
      );
      setManufacturers(response.data);
    };

    fetchManufacturers();
  }, []);

  return (
    <ul>
      {manufacturers.map((manufacturer) => (
        <Card key={manufacturer._id} className="item-in-list">
          <Link key={manufacturer.id} to={`/manufacturers/${manufacturer._id}`}>
            <li>{manufacturer.name}</li>
            <br />
            <img className="model-image" src={manufacturer.logo} alt="logo" />
          </Link>
        </Card>
      ))}
    </ul>
  );
};

export default ManufacturersList;
