import Joi from "joi";

export const technicianSchema = Joi.object({
  id: Joi.string()
    .guid({ version: "uuidv4" })
    .optional(), // DB auto-generates

  name: Joi.string()
    .min(1)
    .required(), // not null

  email: Joi.string()
    .email()
    .required(), // unique at DB level

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // allows 10–15 digit phone numbers
    .required(), // nullable in DB

  department: Joi.string()
    .min(2)
    .required(), // required department like "Water", "Electricity"

  created_at: Joi.date()
    .optional() // default now(), backend usually generates
});
