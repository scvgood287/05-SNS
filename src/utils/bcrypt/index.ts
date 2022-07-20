import bcrypt from 'bcrypt';

export const hash = async (plain): Promise<string> => {
  const hashed = await bcrypt(plain, process.env.SALT_ROUNDS);

  return hashed;
};

export const compare = async (plain, hashed): Promise<boolean> => {
  const isCorrect = await bcrypt.compare(plain, hashed);

  return isCorrect;
};
