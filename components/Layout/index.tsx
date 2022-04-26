import Head from "next/head"
import Navigation from "../Navigation"
import { useEffect, useState } from "react"
import { magic } from "../../lib/magic-client"

import styles from "../../styles/Home.module.css"
import { useRouter } from "next/router"

interface Props {
  children: React.ReactNode
  title: string
  footertxt?: string
}

const Layout: React.FC<Props> = ({ children, title }) => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [didToken, setDidToken] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { email } = magic ? await magic.user.getMetadata() : { email: "" }
        const didToken = magic ? await magic.user.getIdToken() : ""

        if (email) {
          setEmail(email)
          setDidToken(didToken)
        }
      } catch (error) {
        // Handle errors if required!
        console.log("error: ", error)
      }
    }

    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  const handleSignout = async (e: any) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      })

      const res = await response.json()
    } catch (error) {
      console.error("Error logging out", error)
      router.push("/login")
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.container}>
        <Navigation username={email} onLogout={handleSignout} />
        <div className={styles.main}>{children}</div>
      </div>
    </>
  )
}

export default Layout
