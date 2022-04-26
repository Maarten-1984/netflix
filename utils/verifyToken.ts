import jwt from "jsonwebtoken"

export const verifyToken = (token: string) => {
  const { issuer } = token
    ? (jwt.verify(token, process.env.JWT_SECRET || "") as {
        issuer: string
      })
    : { issuer: "" }

  return issuer
}
