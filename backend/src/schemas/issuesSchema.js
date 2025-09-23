import Joi from "joi";

export const issueSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).optional(), // auto-generated in DB

  user_id: Joi.string().guid({ version: "uuidv4" }).required(), // must reference users(id)

  title: Joi.string().min(1).required(), // not null

  description: Joi.string()
    .allow(null, "") // optional in DB
    .optional(),

  image_url: Joi.string()
    .uri()
    .allow(null, "") // optional in DB
    .optional(),

  latitude: Joi.number().min(-90).max(90).allow(null).optional(), // valid range for lat

  longitude: Joi.number().min(-180).max(180).allow(null).optional(), // valid range for lon

  status: Joi.string()
    .valid("pending", "in_progress", "resolved", "closed") // enforce possible values
    .default("pending"),

  priority: Joi.string().valid("low", "medium", "high").default("medium"),

  department: Joi.string().min(1).optional(),

  resolution_image: Joi.string()
    .uri()
    .allow(null, "") // optional, can be empty or null
    .optional(),

  created_at: Joi.date().optional(), // DB default = now()
  updated_at: Joi.date().optional(), // DB default = now()
});
