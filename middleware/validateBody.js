import z from "zod";

// get schema

// safe parse body with schema

// if success -> next

// if error -> return error

export function validateBody(schema) {
  return (req, res, next) => {
    const body = req.body;
    const result = schema.safeParse(body);

    if (result.success) {
      next();
    } else {
      return res
        .status(422)
        .json({ errors: z.treeifyError(result.error).properties });
    }
  };
}