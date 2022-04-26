import { queryHasura } from "./baseQuery"
import {
  operationsDocGetFavourites,
  operationsDocGetVideo,
  operationsDocGetWatchedVideos,
} from "./queries"

export async function getVideoByUser(
  token: string,
  user: string,
  video: string
) {
  const response = await queryHasura(
    operationsDocGetVideo,
    "getVideoByUser",
    {
      user,
      video,
    },
    token
  )

  return response?.data?.stats.length > 0 ? response.data.stats[0] : null
}

export async function getWatchedVideosByUser(token: string, userId: string) {
  const response = await queryHasura(
    operationsDocGetWatchedVideos,
    "getWatchedVideosByUser",
    {
      userId,
    },
    token
  )

  return response?.data
}

export async function getFavouriteVideosByUser(token: string, userId: string) {
  const response = await queryHasura(
    operationsDocGetFavourites,
    "getFavouriteVideosByUser",
    {
      userId,
    },
    token
  )

  return response?.data
}
