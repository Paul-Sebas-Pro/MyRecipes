import { StatusCodes } from "http-status-codes";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errors = error.details.map((d) => d.message).join(", ");
    return res.status(StatusCodes.BAD_REQUEST).json({ error: errors });
  }
  next();
};
