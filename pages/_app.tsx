import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { magic } from "../lib/magic-client"

import ReactModal from "react-modal"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ReactModal.setAppElement("body")
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isLoggedIn = magic ? await magic.user.isLoggedIn() : null

        if (isLoggedIn) {
          router.push("/")
        } else {
          router.push("/login")
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

  useEffect(() => {
    const handleOnComplete = () => setIsLoading(false)

    router.events.on("routeChangeComplete", handleOnComplete)

    return () => {
      router.events.off("routeChangeComplete", handleOnComplete)
    }
  }, [router.events])

  return isLoading ? <div>Loading...</div> : <Component {...pageProps} />
}

export default MyApp
