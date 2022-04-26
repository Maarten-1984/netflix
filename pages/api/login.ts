import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"

import { createUser, isUser } from "../../lib/hasura"
import { setTokenCookie } from "../../lib/cookies"
import { mAdmin } from "../../lib/magic"

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const DIDToken = req.headers.authorization?.substring(7) || ""
      const metadata = await mAdmin.users.getMetadataByToken(DIDToken)

      const token = await jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          eat: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["admin", "user"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.JWT_SECRET || ""
      )

      const user = await isUser(token, metadata?.issuer || "")

      !user && (await createUser(token, metadata))
      setTokenCookie(token, res)
      res.send({ done: true })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 500, message: "error" })
    }
  } else {
    res.send({ message: "hello" })
  }
}
