import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { clx } from "../../utils"
import styles from "./navigation.module.css"

interface Props {
  username: string
  onLogout: (e: any) => Promise<void>
}

const Navigation = ({ username, onLogout }: Props) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleToggleClick = () => {
    setShowMenu((prev) => !prev)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                width={128}
                height={34}
                src="/static/netflix.svg"
                alt="Logo netflix"
              />
            </div>
          </a>
        </Link>
        <nav className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/favourites">
              <a>Favourites</a>
            </Link>
          </li>
        </nav>
        <nav className={styles.navContainer}>
          <div>
            <button
              className={clx(
                styles.usernameBtn,
                showMenu ? styles.menuOpen : ""
              )}
              onClick={handleToggleClick}
            >
              <div className={styles.username}>{username}</div>
              <Image
                src="/static/arrow-down.svg"
                alt="play icon"
                width={32}
                height={32}
              />
            </button>
            <div
              className={clx(
                styles.navDropdown,
                showMenu ? styles.open : styles.close
              )}
            >
              <div>
                <button
                  className={styles.linkName}
                  onClick={(e) => onLogout(e)}
                >
                  Sign out
                </button>
                <div className={styles.lineWrapper} />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navigation
