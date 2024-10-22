import bcrypt from 'bcryptjs';

const hashString = async (s: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(s, salt);
}

const verifyHash = async (s: string, hash: string) => {
  return await bcrypt.compare(s, hash);
}

export {
  hashString,
  verifyHash
}