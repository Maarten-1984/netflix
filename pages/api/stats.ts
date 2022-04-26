import { verifyToken } from "../../utils/verifyToken"
import jwt from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next"
import { getVideoByUser, updateStatsByUser } from "../../lib/hasura"

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token || ""

  if (!token) {
    res.status(403).json({ status: 403, message: "no token" })
  } else {
    const issuer = await verifyToken(token)

    const inputParams = req.method === "POST" ? req.body : req.query
    const { videoId } = inputParams

    if (videoId) {
      const findVideo = await getVideoByUser(token, issuer, videoId as string)
      const { watched = true, favourited } = req.body

      if (req.method === "POST") {
        const args = {
          token,
          issuer,
          videoId: videoId,
          favourited: favourited || 0,
          watched: watched,
        }

        if (findVideo) {
          const updatedStats = await updateStatsByUser({
            ...args,
          })

          res.json({
            status: 200,
            message: "Updated the existing video",
            stats: updatedStats,
          })
        } else {
          const addNewStats = await updateStatsByUser({
            ...args,
            operation: "insert",
          })

          res.json({
            status: 200,
            message: "Added the new stats",
            stats: addNewStats,
          })
        }
      } else if (req.method === "GET") {
        if (findVideo) {
          res.json({
            message: "that went well",
            favourited: findVideo.favourited,
          })
        } else {
          res.json({
            status: 200,
            message: "Could not find the video",
          })
        }
      }
    } else {
      res.json({
        status: 200,
        message: "Could not find the video",
      })
    }
  }
}
