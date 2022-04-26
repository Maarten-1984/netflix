import NextImage from "next/image"
import { Image } from "../../types"
import styles from "./Hero.module.css"

interface Props {
  title: string
  description?: string
  image?: Image
  videoId?: string
  onClick: () => void
}

const Hero = ({ description, image, title, onClick }: Props) => (
  <div className={styles.container} onClick={onClick}>
    <div className={styles.leftWrapper}>
      <div className={styles.left}>
        <h2 className={styles.title}>{title}</h2>
        <h3 className={styles.subTitle}>{description}</h3>
        <div className={styles.buttonWrapper}>
          <button
            onClick={onClick}
            type="button"
            className={styles.btnWithIcon}
          >
            <NextImage
              src="/static/play.svg"
              alt="play icon"
              width={32}
              height={32}
            />
            <span className={styles.playText}>Play</span>
          </button>
        </div>
      </div>
    </div>
    <div className={styles.imageWrapper}>
      {image?.src && (
        <NextImage
          alt={image?.alt}
          src={image.src}
          width={image?.width}
          height={image?.height}
        />
      )}
    </div>
  </div>
)

export default Hero
