import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App";
import AllUsers from "./AllUsers";
import UpdateUser from "./UpdateUser";
import Register from "./Register";
import Layout from "./Layout";
import Login from "./Login";
import ManufacturersList from "./ManufacturersList";
import Manufacturer from "./Manufacturer";
import ModelsList from "./ModelsList";
import Model from "./Model";
import NewModel from "./NewModel";
import EditModel from "./EditModel";
import User from "./User";
import EditManufacturer from "./EditManufacturer";


function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="register" element={<Register />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/models" element={<ModelsList />} />
          <Route path="/models/:id" element={<Model />} />
          <Route path="/models/new" element={<NewModel />} />
          <Route path="/models/edit/:id" element={<EditModel />} />
          <Route path="/manufacturers" element={<ManufacturersList />} />
          <Route path="/manufacturers/:id" element={<Manufacturer />} />
          <Route path="manufacturers/edit/:id" element={<EditManufacturer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppRouter;
