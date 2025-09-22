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
