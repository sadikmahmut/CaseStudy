import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./Configuration.css";
import Modal from "@material-ui/core/Modal";

function Configuration({ userId }) {
  const [open, setOpen] = React.useState(false);
  const [buildingType, setBuildingType] = useState("");
  const [buildingCost, setBuildingCost] = useState("");
  const [constructionTime, setConstructionTime] = useState("");
  const [configurations, setConfigurations] = useState([]); // State to store configurations
  const [availableBuildingTypes, setAvailableBuildingTypes] = useState([
    "Farm",
    "Academy",
    "Headquarters",
    "LumberMill",
    "Barracks",
  ]); // State to store available building types
  const [buildingTypeError, setBuildingTypeError] = useState(""); // State to store building type error message
  const [buildingCostError, setBuildingCostError] = useState(""); // State to store building cost error message
  const [constructionTimeError, setConstructionTimeError] = useState(""); // State to store construction time error message

  const handleClose = () => {
    setOpen(false);
    // Clear error messages when the modal is closed
    setBuildingTypeError("");
    setBuildingCostError("");
    setConstructionTimeError("");
  };

  const handleOpen = () => {
    setOpen(true);
  
    // Reset the input fields when the modal is opened
    setBuildingType("");
    setBuildingCost("");
    setConstructionTime("");
  
    // Clear error messages when the modal is opened
    setBuildingTypeError("");
    setBuildingCostError("");
    setConstructionTimeError("");
  };

  const handleCreateConfiguration = () => {
    // Clear existing error messages
    setBuildingTypeError("");
    setBuildingCostError("");
    setConstructionTimeError("");

    if (!buildingType || !buildingCost.trim() || !constructionTime.trim()) {
      if (!buildingType) {
        setBuildingTypeError("Please select a building type.");
      }
      if (!buildingCost.trim()) {
        setBuildingCostError("Please fill in building cost.");
      }
      if (!constructionTime.trim()) {
        setConstructionTimeError("Please fill in construction time.");
      }
      return;
    }

    const cost = parseFloat(buildingCost);
    const time = parseFloat(constructionTime);

    if (isNaN(cost) || cost <= 0) {
      setBuildingCostError("Building cost must be a number greater than 0");
      return;
    }

    if (isNaN(time) || time < 30 || time > 1800) {
      setConstructionTimeError("Construction time must be a number between 30 and 1800");
      return;
    }

    const data = {
      UserId: userId,
      BuildingType: buildingType,
      BuildingCost: parseFloat(buildingCost),
      ConstructionTime: parseFloat(constructionTime),
    };

    axios
      .post("http://40.114.196.124:5000/api/Auth/CreateConfiguration", data)
      .then((response) => {
        handleClose();
        // Reload configurations after creating one
        loadConfigurations();
      })
      .catch((error) => {
        alert("Error creating configuration: " + error.message);
      });
  };

  // Function to load configurations from the API
  const loadConfigurations = () => {
    axios
      .get(`http://40.114.196.124:5000/api/Auth/ListConfigurations/${userId}`)
      .then((response) => {
        setConfigurations(response.data);
        // Extract existing building types from configurations
        const existingBuildingTypes = response.data.map((config) => config.buildingType);
        // Filter available building types
        const filteredBuildingTypes = availableBuildingTypes.filter(
          (type) => !existingBuildingTypes.includes(type)
        );
        setAvailableBuildingTypes(filteredBuildingTypes);
      })
      .catch((error) => {
        // Handle the error, e.g., by displaying an error message
      });
  };

  useEffect(() => {
    loadConfigurations(); // Load configurations when the component mounts
  }, []);

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="configuration-container">
      <h2>Configuration Page</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Building Type</th>
            <th>Building Cost</th>
            <th>Construction Time</th>
          </tr>
        </thead>
        <tbody>
          {configurations.map((config, index) => (
            <tr key={config.id}>
              <td>{index + 1}</td>
              <td>{config.buildingType}</td>
              <td>{config.buildingCost}</td>
              <td>{config.constructionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-building-button">
        <button type="button" onClick={handleOpen}>
          Add Building
        </button>
      </div>
      <Modal onClose={handleClose} open={open} className="modal-container">
        <div className="modal-content">
          <div className="modal-row">
            <label>Building Type</label>
            <select onChange={(e) => setBuildingType(e.target.value)}>
              <option value="">Select Building Type</option>
              {availableBuildingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="error-message">{buildingTypeError}</div>
          </div>
          <div className="modal-row">
            <label>Building Cost</label>
            <input type="text" onChange={(e) => setBuildingCost(e.target.value)} />
            <div className="error-message">{buildingCostError}</div>
          </div>
          <div className="modal-row">
            <label>Construction Time</label>
            <input type="text" onChange={(e) => setConstructionTime(e.target.value)} />
            <div className="error-message">{constructionTimeError}</div>
          </div>
          <div className="modal-row">
            <button onClick={handleCreateConfiguration}>OK</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Configuration;
