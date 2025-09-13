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

// Get technicians by department
export const getTechniciansByDepartment = async (req, res) => {
  try {
    const { department } = req.body; // expect { "department": "water" }

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const result = await selectRows("technicians", { department });

    if (result.success && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `No technicians found for department: ${department}`,
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

//Get unassigned technicians
export const getUnassignedTechnicians = async (req, res) => {
  try {
    // 1. Fetch all technicians
    const allTechsRes = await selectRows("technicians");
    if (!allTechsRes.success) {
      return res.status(400).json({ message: allTechsRes.error });
    }

    // 2. Fetch all technician_ids from pending_issues
    const assignedTechsRes = await selectRows("pending_issues", {}, ["technician_id"]);
    if (!assignedTechsRes.success) {
      return res.status(400).json({ message: assignedTechsRes.error });
    }

    const assignedSet = new Set(assignedTechsRes.data.map(row => row.technician_id));

    // 3. Subtract assigned
    const unassignedTechnicians = allTechsRes.data.filter(
      tech => !assignedSet.has(tech.id)
    );

    // 4. Send response
    return res.status(200).json({
      success: true,
      message: "Unassigned technicians fetched successfully",
      unassigned: unassignedTechnicians,
    });
  } catch (err) {
    console.error("Error in getUnassignedTechnicians:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
