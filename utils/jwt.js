import jwt from "jsonwebtoken";

export const jsontoken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY);
};
