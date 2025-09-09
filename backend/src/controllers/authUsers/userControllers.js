import { insertRow } from "../../lib/dbService.js";
export const registerUser = async (req, res) => {
  try {
    const userData = req.body;

    // Call the insertRow function
    const result = await insertRow("users", userData);

    if (result.success) {
      // Successfully inserted
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
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