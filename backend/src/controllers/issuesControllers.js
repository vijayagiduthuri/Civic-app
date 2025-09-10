import { insertRow } from "../lib/dbService.js";

export const createIssue = async (req, res) => {
  try {
    const issueData = req.body;

    // Validate request body with Joi
    const { error, value } = issueSchema.validate(issueData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((d) => d.message)
      });
    }

    // Insert validated data into DB
    const result = await insertRow("issues", value);

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