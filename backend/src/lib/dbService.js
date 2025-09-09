import { supabase } from  "../config/supabaseClient.js";
import { schemas } from "../schemas/schemas.js";

export async function insertRow(tableName, values) {
  try {
    const schema = schemas[tableName];
    if (!schema) {
      return { success: false, error: `No schema defined for table: ${tableName}` };
    }
    const { error } = schema.validate(values);
    if (error) {
      return { success: false, error: error.details[0].message };
    }
    const { data,  error: dbError } = await supabase
      .from(tableName)
      .insert(Array.isArray(values) ? values : [values])
      .select();

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function selectById(tableName, primaryKey, columns = []) {
  try {
    const schema = schemas[tableName];
    if (!schema) {
      return { success: false, error: `No schema defined for table: ${tableName}` };
    }

    // Build select query
    const selectColumns = columns.length > 0 ? columns.join(",") : "*";

    let query = supabase.from(tableName).select(selectColumns);

    // Apply primary key filter (object like { uuid: "1234" })
    if (primaryKey && Object.keys(primaryKey).length > 0) {
      const [key, value] = Object.entries(primaryKey)[0];
      query = query.eq(key, value).single(); // fetch single row
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


export async function selectRows(tableName, filters = {}, columns = [], sort = null) {
  try {
    if (!tableName) {
      return { success: false, error: "Table name is required." };
    }

    const selectColumns = columns.length > 0 ? columns.join(",") : "*";
    let query = supabase.from(tableName).select(selectColumns);

    // Apply filters with operators
    for (const [key, condition] of Object.entries(filters)) {
      if (typeof condition === "object" && condition.op && condition.value !== undefined) {
        switch (condition.op) {
          case "eq":   query = query.eq(key, condition.value); break;
          case "neq":  query = query.neq(key, condition.value); break;
          case "gt":   query = query.gt(key, condition.value); break;
          case "lt":   query = query.lt(key, condition.value); break;
          case "gte":  query = query.gte(key, condition.value); break;
          case "lte":  query = query.lte(key, condition.value); break;
          case "like": query = query.like(key, condition.value); break;
          case "ilike":query = query.ilike(key, condition.value); break;
          case "in":   query = query.in(key, condition.value); break;
          case "is":   query = query.is(key, condition.value); break;
          default: throw new Error(`Unsupported operator: ${condition.op}`);
        }
      } else {
        query = query.eq(key, condition); // default equality
      }
    }

    // Apply sorting if provided
    if (sort && sort.column) {
      const order = sort.order && ["asc", "desc"].includes(sort.order.toLowerCase())
        ? sort.order.toLowerCase()
        : "asc"; // default asc
      query = query.order(sort.column, { ascending: order === "asc" });
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true, data };

  } catch (err) {
    return { success: false, error: err.message };
  }
}


export async function updateRowById(tableName, primaryKey, updates) {
  try {
    const schema = schemas[tableName];
    if (!schema) {
      return { success: false, error: `No schema defined for table: ${tableName}` };
    }

    if (!primaryKey || Object.keys(primaryKey).length === 0) {
      return { success: false, error: "Primary key is required." };
    }

    // Make all fields optional for partial updates
    // Do NOT allow unknown keys
    const { error, value: validatedUpdates } = schema
      .fork(Object.keys(schema.describe().keys), (field) => field.optional())
      .validate(updates, { abortEarly: true, allowUnknown: false }); // <-- unknown fields will raise error

    if (error) {
      return { success: false, error: error.details[0].message };
    }

    const [key, value] = Object.entries(primaryKey)[0];

    const { data, error: dbError } = await supabase
      .from(tableName)
      .update(validatedUpdates)
      .eq(key, value)
      .select()
      .single();

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true, data };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function dropRowById(tableName, primaryKey) {
  try {
    const schema = schemas[tableName];
    if (!schema) {
      return { success: false, error: `No schema defined for table: ${tableName}` };
    }

    if (!primaryKey || Object.keys(primaryKey).length === 0) {
      return { success: false, error: "Primary key is required." };
    }

    const [key, value] = Object.entries(primaryKey)[0];

    const { data, error: dbError } = await supabase
      .from(tableName)
      .delete()
      .eq(key, value)
      .select()
      .single(); // fetch deleted row for confirmation

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true, data };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function dropRows(tableName, filters = {}) {
  try {
    const schema = schemas[tableName];
    if (!schema) {
      return { success: false, error: `No schema defined for table: ${tableName}` };
    }

    if (Object.keys(filters).length === 0) {
      return { success: false, error: "Filters are required to prevent accidental deletion of all rows." };
    }

    let query = supabase.from(tableName).delete().select(); // select() to return deleted rows

    // Apply filters
    for (const [key, condition] of Object.entries(filters)) {
      if (typeof condition === "object" && condition.op && condition.value !== undefined) {
        switch (condition.op) {
          case "eq":    query = query.eq(key, condition.value); break;
          case "neq":   query = query.neq(key, condition.value); break;
          case "gt":    query = query.gt(key, condition.value); break;
          case "lt":    query = query.lt(key, condition.value); break;
          case "gte":   query = query.gte(key, condition.value); break;
          case "lte":   query = query.lte(key, condition.value); break;
          case "like":  query = query.like(key, condition.value); break;
          case "ilike": query = query.ilike(key, condition.value); break;
          case "in":    query = query.in(key, condition.value); break;
          case "is":    query = query.is(key, condition.value); break;
          default: throw new Error(`Unsupported operator: ${condition.op}`);
        }
      } else {
        // default equality
        query = query.eq(key, condition);
      }
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return { success: true, data };

  } catch (err) {
    return { success: false, error: err.message };
  }
}