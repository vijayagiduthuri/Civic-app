import {
  insertRow,
  selectRows,
  selectById,
  dropRowById,
} from "../lib/dbService.js";

// Create Issue
export const createIssue = async (req, res) => {
  try {
    const issueData = req.body;

    const result = await insertRow("issues", issueData);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "Issue created successfully",
        data: result.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
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
        data: result.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
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
        data: result.data
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
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
        data: result.data
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
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
