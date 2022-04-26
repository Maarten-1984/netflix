import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import ReactModal from "react-modal"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ReactModal.setAppElement("body")
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
