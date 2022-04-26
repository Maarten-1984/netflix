import { NextApiRequest } from "next"

import { verifyToken } from "./verifyToken"

const get_cookies = function (request: NextApiRequest) {
  const cookies: { [key: string]: string } = {}
  request.headers &&
    request.headers.cookie?.split(";").forEach(function (cookie: any) {
      const parts = cookie.match(/(.*?)=(.*)$/)
      cookies[parts[1].trim()] = (parts[2] || "").trim()
    })
  return cookies
}

const redirectUser = async (req: NextApiRequest) => {
  const token = get_cookies(req)["token"] || ""

  console.log({ token })
  const issuer = await verifyToken(token)

  return {
    token,
    issuer,
  }
}

export default redirectUser
