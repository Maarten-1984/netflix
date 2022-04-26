import { NextApiRequest, NextApiResponse } from "next"
import { useRouter } from "next/router"

import { CardSection, Hero, Layout } from "../components"
import useRedirectUser from "../utils/redirectUser"

import { getAllWatchedVideos, getPopularVideos, getVideos } from "../lib/videos"
import redirectUser from "../utils/redirectUser"

interface Props {
  hero: any
  videos: {
    largeVideos: []
    smallVideos: []
    mediumVideos: []
    watchedVideos: []
  }
}

const Home = ({
  hero,
  videos: {
    largeVideos = [],
    mediumVideos = [],
    smallVideos = [],
    watchedVideos = [],
  },
}: Props) => {
  const router = useRouter()

  const handleHeroClick = () => {
    router.push(`/video/${hero.id}`)
  }

  return (
    <Layout title="Home">
      <Hero
        title={hero.title.slice(0, 30)}
        description={hero.description.slice(0, 100)}
        image={{
          src: "https://i.ytimg.com/vi/" + hero.id + "/maxresdefault.jpg",
          width: 1280,
          height: 720,
        }}
        onClick={handleHeroClick}
      />
      <CardSection title="Uitgelicht" cards={largeVideos} />
      {/* <CardSection title="Kleine videos" cards={smallVideos} /> */}
      {watchedVideos.length > 0 && (
        <CardSection title="Eerder bekeken" cards={watchedVideos} />
      )}
      <CardSection title="Popular" cards={mediumVideos} />
    </Layout>
  )
}

export async function getServerSideProps({
  req,
}: {
  req: NextApiRequest
  res: NextApiResponse
}) {
  const { token, issuer } = await redirectUser(req)

  const largeVideos = await getVideos("lg", "disney")
  const mediumVideos = await getPopularVideos("md")

  if (!issuer) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  const watchedVideos = token ? await getAllWatchedVideos(token, issuer) : []

  return {
    props: {
      hero: mediumVideos[0],
      videos: {
        largeVideos,
        mediumVideos,
        smallVideos: null,
        watchedVideos,
      },
    },
  }
}

export default Home
