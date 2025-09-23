import { insertRow, selectRows } from "../lib/dbService.js";

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
      console.log(result.error);
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

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required in request body",
      });
    }

    // Use selectRows with eq filter
    const result = await selectRows("users", { email: { op: "eq", value: email } });

    if (result.success && result.data && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.data[0], // single user
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
