import Joi from "joi";

export const userSchema = Joi.object({
  id: Joi.string()
    .guid({ version: "uuidv4" }) // PostgreSQL uses uuid_generate_v4()
    .optional(), // Supabase/Postgres will auto-generate if not provided

  name: Joi.string()
    .min(1)
    .required(), // not null

  email: Joi.string()
    .email()
    .required(), // unique enforced at DB level, but Joi validates format

  age: Joi.number()
    .integer()
    .optional(), // nullable in DB

    
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // 10–15 digit phone number
    .required(), // not null in DB
  created_at: Joi.date()
    .optional() // default now(), so usually backend generates it
});
