import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  try {
    const salt = 10;
    const hashPass = await bcrypt.hash(password, salt);
    return hashPass;
  } catch (error) {
    error
  }
};

export const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
