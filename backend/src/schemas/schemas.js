import { userSchema } from "./userSchema.js";
import { issueSchema } from "./issuesSchema.js";
import { technicianSchema } from "./technicianSchema.js";
import {pendingIssueSchema} from './pendingIssuesSchema.js'

export const schemas = {
  users: userSchema,
  issues : issueSchema,
  technicians : technicianSchema,
  assigned : pendingIssueSchema,
}