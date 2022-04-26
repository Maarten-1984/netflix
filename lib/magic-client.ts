import { Magic } from "magic-sdk"

const createMagic = () => {
  return (
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY || "")
  )
}

const magic = createMagic ? createMagic() : null

const loginWithMagic = async (email: string) => {
  if (magic)
    try {
      const token = await magic?.auth.loginWithMagicLink({ email })
      return token
    } catch {
      console.log("Error logging in with magic")
    }
}

export { magic, loginWithMagic }
