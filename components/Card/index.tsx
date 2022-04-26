import { motion } from "framer-motion"
import NextImage from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Image } from "../../types"
import styles from "./card.module.css"

export type CardType = "sm" | "md" | "lg"

export interface Props {
  id?: string
  type: CardType
  title: string
  image?: Image
  onClick?: () => void
}

const Card = ({
  id,
  image = {
    src: "/static/fallback.png",
    alt: "alt",
  },
  title,
  type = "md",
  onClick,
}: Props) => {
  const [imgSrc, setImgSrc] = useState(image?.src)

  const handleOnError = () => {
    setImgSrc("/static/fallback.png")
  }

  return (
    <div className={styles.container} onClick={onClick}>
      <Link href={`/video/${id}`}>
        <a>
          <motion.div
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.3 },
            }}
            className={styles.imgMotionWrapper}
            layoutId="card"
          >
            <div className={styles[`${type}Item`]}>
              <h2>{title}</h2>
              <NextImage
                src={imgSrc}
                alt={image.alt}
                width={image.width}
                height={image.height}
                layout="fill"
                objectFit="cover"
                className={styles.cardImg}
                onError={handleOnError}
              />
            </div>
          </motion.div>
        </a>
      </Link>
    </div>
  )
}

export default Card
