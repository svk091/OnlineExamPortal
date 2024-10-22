import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";

interface JwtPayload {
  examinerId: number
}

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized"
    })
  }
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!decoded) {
    return res.status(401).json({
      error: "Unauthorized"
    })
  }
  req.examinerId = decoded.examinerId;
  next()
}
export default authMiddleware;