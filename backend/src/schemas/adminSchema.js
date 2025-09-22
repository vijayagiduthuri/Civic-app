import Joi from "joi";

export const adminLoginSchema = Joi.object({
  id: Joi.string()
    .guid({ version: "uuidv4" })
    .optional(), // DB auto-generates

  email: Joi.string()
    .email()
    .required(), // unique & not null

  password: Joi.string()
    .min(6) // recommended minimum length
    .required(), // not null

  department: Joi.string()
    .min(2)
    .optional(), // nullable in DB

  created_at: Joi.date()
    .optional(), // default now()

  updated_at: Joi.date()
    .optional() // default now(), updated on row change
});
