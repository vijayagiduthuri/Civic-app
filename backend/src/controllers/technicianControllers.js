import { insertRow,selectRows } from "../lib/dbService.js";

//Function to register a technician
export const registerTechnician = async (req, res) => {
  try {
    const technicianData = req.body;

    // Call the insertRow function
    const result = await insertRow("technicians", technicianData);

    if (result.success) {
      // Successfully inserted
      return res.status(201).json({
        success: true,
        message: "Technician registered successfully",
        data: result.data
      });
    } else {
      // Validation or DB error
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

  } catch (err) {
    // Unexpected server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

// Get all technicians
export const getAllTechnicians = async (req, res) => {
  try {
    const result = await selectRows("technicians");

    if (result.success && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No technicians found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};