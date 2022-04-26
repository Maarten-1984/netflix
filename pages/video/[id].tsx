import { GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"
import Modal from "react-modal"

import { Icon, Layout } from "../../components"

import styles from "../../styles/Video.module.css"
import { getPopularVideos, getVideoById } from "../../lib/videos"
import { clx } from "../../utils"
import { Image } from "../../types"
import { useEffect, useState } from "react"

type Video = {
  channelTitle?: string
  description: string
  id: string
  image: Image
  publishTime: string
  statistics?: any
  title: string
}

interface Props {
  video: Video
}

const Video = ({ video }: Props) => {
  const [toggleLike, setToggleLike] = useState(false)
  const [toggleDislike, setToggleDislike] = useState(false)

  const router = useRouter()
  const videoId = router.query.id

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = "",
  } = video || {}

  const handleOnClose = () => {
    router.back()
  }

  const handleOnFetchStats = async (favourited: boolean) => {
    const stats = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        favourited: favourited ? 1 : 0,
      }),
    })

    const statsResponse = await stats.json()
    console.log({ statsResponse })
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3000/api/stats?videoId=${videoId}`,
        {
          method: "GET",
        }
      )
      const stats = await response.json()

      if (stats?.favourited === 1) {
        setToggleLike(true)
      } else if (stats?.favourited === 0) {
        setToggleDislike(true)
      }
    }

    fetchData()
  }, [videoId])

  const handleToggleLike = async () => {
    const val = !toggleLike

    setToggleLike(val)
    setToggleDislike(toggleLike)

    await handleOnFetchStats(val)
  }

  const handleToggleDislike = async () => {
    setToggleDislike(!toggleDislike)
    setToggleLike(toggleDislike)

    await handleOnFetchStats(toggleDislike)
  }

  return (
    <Layout title={`Video `}>
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={handleOnClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          <iframe
            id="ytplayer"
            className={styles.videoPlayer}
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
            frameBorder="0"
          ></iframe>
          <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={handleToggleLike}>
                <div className={styles.btnWrapper}>
                  <Icon.Like selected={toggleLike} />
                </div>
              </button>
            </div>
            <button onClick={handleToggleDislike}>
              <div className={styles.btnWrapper}>
                <Icon.DisLike selected={toggleDislike} />
              </div>
            </button>
          </div>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const video = params?.id ? await getVideoById(params.id[0]) : undefined

  return {
    props: {
      video: video || null,
      revalidate: 10,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const videos = await getPopularVideos("lg")

  const paths = videos.map((video) => ({
    params: { id: video.id },
  }))

  return { paths, fallback: "blocking" }
}

export default Video
