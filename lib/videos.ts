import { CardType } from "../components/Card"
import Video from "../pages/video/[id]"

import mockVideos from "../data/videos.json"
import {
  getFavouriteVideosByUser,
  getWatchedVideosByUser,
} from "./hasura/video"

type Videos = {
  items: any[]
  error?: any
}

interface FormattedVideo extends Video {
  type: CardType
}

const fetchVideos = async (url: string): Promise<Videos> => {
  const BASE_URL = `https://youtube.googleapis.com/youtube/v3`
  const videosResponse = await fetch(
    `${BASE_URL}/${url}&maxResults=6&type=video&key=${process.env.YOUTUBE_API_KEY}`,
    {
      method: "GET",
    }
  )

  return await videosResponse.json()
}

export const getCommonVideos = async (type: CardType, url: string) => {
  const devEnv = process.env.NODE_ENV === "development"

  try {
    const videos = devEnv ? mockVideos : await fetchVideos(url)

    if (videos?.error) {
      console.log(videos.error.message)
      return []
    }

    const formattedVideos = videos.items.map((video): FormattedVideo => {
      const id = typeof video.id === "string" ? video.id : video.id.videoId
      return {
        id: id || "",
        channelTitle: video.snippet?.channelTitle || "",
        title: video?.snippet?.title,
        description: video?.snippet.description,
        image: {
          alt: "",
          src: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        },
        publishTime: video?.snippet?.publishAt || "",
        statistics: video?.statistics ? video.statistics : { viewCount: 0 },
        type,
      }
    })

    return formattedVideos
  } catch (error) {
    console.log(`Error fetching videos: ${error}`)
    return []
  }
}

export const getVideos = (type: CardType, query: string = "disney") => {
  const url = `search?part=snippet&q=${query}&type=${type}`

  return getCommonVideos(type, url)
}

export const getPopularVideos = (type: CardType) => {
  const url = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=NL`

  return getCommonVideos(type, url)
}

export const getVideoById = async (id: string) => {
  const url = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}`
  const videos = await getCommonVideos("lg", url)

  return videos[0]
}

export const getAllWatchedVideos = async (token: string, userId: string) => {
  const response = await getWatchedVideosByUser(token, userId)
  const formattedResponse = response?.stats.map((video: any) => ({
    ...video,
    id: video.videoId,
    type: "md",
    image: {
      src: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
    },
  }))

  return formattedResponse
}

export const getFavouriteVideos = async (token: string, userId: string) => {
  const response = await getFavouriteVideosByUser(token, userId)
  const formattedResponse = response?.stats.map((video: any) => ({
    ...video,
    id: video.videoId,
    type: "lg",
    image: {
      src: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
    },
  }))

  return formattedResponse
}
