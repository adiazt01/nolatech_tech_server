/**
 * Validate request body against a zod schema
 * 
 * @param schema - Zod schema object
 * @returns Express middleware function
 */
export const validateSchema = (schema) => (req, res, next) => {
    const validationResult = schema.safeParse(req.body);
  
    if (!validationResult.success) {
      return res.status(400).json(validationResult.error);
    }
  
    next();
  };