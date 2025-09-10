import { userSchema } from "./userSchema.js";
import { issueSchema } from "./issuesSchema.js";

export const schemas = {
  users: userSchema,
  issues : issueSchema
}