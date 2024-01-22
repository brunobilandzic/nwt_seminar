import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";

const ModelsList = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const response = await axios.get("http://localhost:3001/api/models");
      setModels(response.data);
    };

    fetchModels();
  }, []);

  return (
    <>
      {models.map((model) => {
        if (!model) return <div>Loading...</div>;
        return (
          <>
            <Card key={model._id} className="item-in-list">
              <div>
                <Link to={`/models/${model._id}`}>
                  <div>
                    {model.name}
                    <br />
                    <img
                      className="model-image"
                      src={model.image}
                      alt="model"
                    />
                  </div>
                </Link>
              </div>
              <div>
                <Link to={`/manufacturers/${model.manufacturer?._id}`}>
                  <div>Manufacturer: {model.manufacturer?.name}</div>
                </Link>
              </div>
            </Card>
          </>
        );
      })}
    </>
  );
};

export default ModelsList;
