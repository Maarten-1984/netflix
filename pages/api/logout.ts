import { NextApiRequest, NextApiResponse } from "next"

import { removeTokenCookie } from "../../lib/cookies"
import { mAdmin } from "../../lib/magic"
import { verifyToken } from "../../utils/verifyToken"

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      if (!req.cookies.token)
        return res.status(401).json({ message: "User is not logged in" })

      const token = req.cookies.token
      const userId = await verifyToken(token)
      removeTokenCookie(res)

      try {
        await mAdmin.users.logoutByIssuer(userId)
      } catch (error) {
        console.log("User's session with Magic already expired")
        console.error("Error occurred while logging out magic user", error)
      }
      //redirects user to login page
      res.setHeader("location", "/login")
      res.statusCode = 302
      res.end()
    } catch (error) {
      console.error({ error })
      res.status(401).json({ message: "User is not logged in" })
    }
  }
}
