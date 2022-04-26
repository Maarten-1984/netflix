import { NextApiRequest } from "next"

import { verifyToken } from "./verifyToken"

const redirectUser = async (req: NextApiRequest) => {
  const tokenFromCookie = req?.headers?.cookie ?? ""
  const token = tokenFromCookie.replace("token=", "")

  const issuer = await verifyToken(token)

  return {
    token,
    issuer,
  }
}

export default redirectUser
