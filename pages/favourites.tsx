import { NextApiRequest, NextApiResponse } from "next"

import { CardSection, Layout } from "../components"
import { getFavouriteVideos } from "../lib/videos"
import redirectUser from "../utils/redirectUser"

import styles from "../styles/Favourites.module.css"

interface Props {
  favourites: []
}

const Favourites = ({ favourites }: Props) => {
  return (
    <Layout title="Favourites">
      {favourites && favourites?.length > 0 ? (
        <CardSection title="Favourites" cards={favourites} wrap />
      ) : (
        <div className={styles.main}>
          <div className={styles.sectionWrapper}>
            <h1>No favourites yet</h1>
          </div>
        </div>
      )}
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
  const favourites = token ? await getFavouriteVideos(token, issuer) : []

  return {
    props: {
      favourites,
    },
  }
}

export default Favourites
