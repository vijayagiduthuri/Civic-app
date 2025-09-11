import { insertRow, selectRows ,dropRows} from "../lib/dbService.js";

// Assign an issue to a technician (create a pending issue)
export const assignPendingIssue = async (req, res) => {
  try {
    const pendingData = req.body;

    // Insert into pending_issues
    const result = await insertRow("pending_issues", pendingData);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "Pending issue assigned successfully",
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

// Fetch all pending issues
export const getAllPendingIssues = async (req, res) => {
  try {
    const result = await selectRows("pending_issues");

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

// Delete resolved pending issues
export const deleteResolvedPendingIssues = async (req, res) => {
  try {
    // Delete rows from pending_issues where status = resolved
    const result = await dropRows("pending_issues", { status: "resolved" });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Resolved pending issues deleted successfully",
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
