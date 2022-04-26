import Link from "next/link"
import Image from "next/image"
import styles from "../styles/Login.module.css"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { loginWithMagic } from "../lib/magic-client"

interface Props {
  title: string
}

const Login: React.FC<Props> = ({ title }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [userMsg, setUserMsg] = useState("")
  const [btnDisabled, setBtnDisabled] = useState(true)
  const router = useRouter()

  const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value

    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (email?.match(validRegex)) {
      setUserMsg("")
      setBtnDisabled(false)
      setEmail(email)
    } else {
      if (!btnDisabled) {
        setUserMsg("Typ iets in ofzo")
        setBtnDisabled(true)
      }
    }
  }

  const handleLoginWithEmail = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    if (email) {
      const token = await loginWithMagic(email)

      if (token) {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        })

        const loggedinResponse = await response.json()

        if (loggedinResponse.done) {
          router.push("/")
        } else {
          setIsLoading(false)
          setUserMsg("Dit emailadres is niet bij ons bekend")
        }
      }
    } else {
      console.log("hier?")
      setIsLoading(false)
      setUserMsg("Dit emailadres is niet bij ons bekend")
    }
  }

  useEffect(() => {
    const handleOnComplete = () => setIsLoading(false)

    router.events.on("routeChangeComplete", handleOnComplete)

    return () => {
      router.events.off("routeChangeComplete", handleOnComplete)
    }
  }, [router.events])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href="/">
            <a className={styles.logoLink}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/static/netflix.svg"
                  alt="Netflix logo"
                  width="128px"
                  height="34px"
                />
              </div>
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="email"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button
            onClick={handleLoginWithEmail}
            className={styles.loginBtn}
            disabled={btnDisabled}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login
