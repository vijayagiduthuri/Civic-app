import bcrypt from "bcrypt";
import { insertRow, selectRows } from "../lib/dbService.js"; 

export const createAdmin = async (req, res) => {
  try {
    const { email, password, department } = req.body;

    // 1. Check if email already exists
    const existingAdmin = await selectRows("admin_logins", { email });
    if (existingAdmin.success && existingAdmin.data.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert into DB using service
    const result = await insertRow("admin_logins", {
      email,
      password: hashedPassword,
      department,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    // 4. Return response (hide password)
    const { password: _, ...adminData } = result.data[0];
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: adminData,
    });
  } catch (err) {
    console.error("Error creating admin:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    // 1. Check if admin exists
    const existingAdmin = await selectRows("admin_logins", { email });

    if (!existingAdmin.success || existingAdmin.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = existingAdmin.data[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Hide password before sending
    const { password: _, ...adminData } = admin;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: adminData,
    });
  } catch (err) {
    console.error("Error logging in admin:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get admin department by email
export const getAdminDepartment = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Query admin table
    const result = await selectRows("admin_logins", { email });

    if (!result.success || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = result.data[0];

    res.status(200).json({
      success: true,
      message: "Admin department retrieved successfully",
      data: { department: admin.department },
    });
  } catch (err) {
    console.error("Error retrieving admin department:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
