import { motion } from "framer-motion"
import { clx } from "../../utils"
import Card, { Props as CardProps } from "../Card"

import styles from "./CardSection.module.css"

interface Props {
  cards: CardProps[]
  title?: string
  wrap?: boolean
}

const CardSection = ({ cards, title, wrap }: Props) => (
  <div className={styles.container}>
    {title && <h2 className={styles.title}>{title}</h2>}
    {cards?.length > 0 && (
      <motion.div className={clx(styles.cardWrapper, wrap ? styles.wrap : "")}>
        {cards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </motion.div>
    )}
  </div>
)

export default CardSection
