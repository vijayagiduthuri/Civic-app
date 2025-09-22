import {
  insertRow,
  selectRows,
  selectById,
  dropRowById,
  updateRowById,
} from "../lib/dbService.js";
import { supabase } from "../config/supabaseClient.js";
import { decode as b64Decode } from "base64-arraybuffer";

// Create Issue
  export const createIssue = async (req, res) => {
    try {
      const issueData = req.body;

      const result = await insertRow("issues", issueData);

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: "Issue created successfully",
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.error,
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

// Get All Issues
export const getAllIssues = async (req, res) => {
  try {
    const result = await selectRows("issues");

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error,
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

// Get Issue by ID
export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await selectById("issues", { id });

    if (result.success && result.data) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
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

// Delete Issue by ID
export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dropRowById("issues", { id });

    if (result.success && result.data) {
      return res.status(200).json({
        success: true,
        message: "Issue deleted successfully",
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
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

// function to fetch all issues created by a specific user_id
export const getIssuesByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    //console.log("Fetching issues for user_id:", id);

    const result = await selectRows("issues", { user_id: id });

    if (result.success && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No issues found for this user",
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

// Fetch pending issue coordinates by department
export const getPendingIssuesByDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    //console.log(department)
    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required in request body",
      });
    }

    // Query issues with department filter and status = pending
    const result = await selectRows(
      "issues",
      { department, status: "pending" }, // filters
      ["latitude", "longitude", "status"] // select only required columns
    );

    if (result.success && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `No pending issues found for department: ${department}`,
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

// Fetch all issues except resolved issue coordinates by department
export const getActiveIssueCoordinatesByDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required in request body",
      });
    }

    // Fetch only lat & lon where department matches AND status != resolved
    const result = await selectRows(
      "issues",
      {
        department,
        status: { op: "neq", value: "resolved" },
      },
      ["latitude", "longitude", "status"]
    );

    if (result.success && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        coordinates: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `No active (pending/in_progress) issues found for department: ${department}`,
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

// Get issues in 200m radius filtered by department
export const getNearbyIssuesByIdAndDept = async (req, res) => {
  try {
    const { issue_id, department } = req.body;

    if (!issue_id || !department) {
      return res.status(400).json({
        success: false,
        message: "issue_id and department are required",
      });
    }

    // Fetch all issues
    const result = await selectRows("issues");
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const issues = result.data;

    // Find the main issue by id
    const mainIssue = issues.find((i) => i.id === issue_id);
    if (!mainIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // Haversine distance function
    function haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // meters
      const toRad = (deg) => (deg * Math.PI) / 180;

      const φ1 = toRad(lat1);
      const φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1);
      const Δλ = toRad(lon2 - lon1);

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Now filter issues within 200m, same department, and not the same issue
    const nearbyIssues = issues.filter((issue) => {
      if (!issue.latitude || !issue.longitude) return false;

      const distance = haversineDistance(
        mainIssue.latitude,
        mainIssue.longitude,
        issue.latitude,
        issue.longitude
      );

      return (
        issue.id !== issue_id &&
        issue.department === department &&
        issue.status !== "closed" &&
        distance <= 200
      );
    });

    return res.status(200).json({
      success: true,
      count: nearbyIssues.length,
      data: nearbyIssues,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update issue status by ID
export const updateIssueStatus = async (req, res) => {
  try {
    const { issue_id, status } = req.body;

    if (!issue_id || !status) {
      return res.status(400).json({
        success: false,
        message: "issue_id and status are required",
      });
    }

    // Step 1: Fetch the issue by ID
    const existing = await selectById("issues", { id: issue_id });
    if (!existing.success || !existing.data) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // Step 2: Update the status
    const updated = await updateRowById("issues", { id: issue_id }, { status });

    if (updated.success) {
      return res.status(200).json({
        success: true,
        message: "Issue status updated successfully",
        data: updated.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: updated.error,
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

// controllers/uploadController.js


export const uploadImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Unique filename
    const fileName = `issues/${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("issues") // bucket name
      .upload(fileName, b64Decode(imageBase64), { contentType: "image/jpeg" });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("issues")
      .getPublicUrl(fileName);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: publicData.publicUrl,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
