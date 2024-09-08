import bcrypt from "bcrypt";

const saltRounds = 10;

// create a hash
export const createHash = (valueToHash) =>
  bcrypt.hashSync(valueToHash, saltRounds);

export const compareHash = (
  valueToCompare,
  hashValue
) => {
  bcrypt.genSaltSync(saltRounds);
  return bcrypt.compareSync(valueToCompare, hashValue);
};