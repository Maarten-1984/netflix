import { queryHasura } from "./baseQuery"
import { operationsDocUpdate, operationsDocInsert } from "./queries"

interface Props {
  token: string
  issuer: string
  videoId: string
  watched: boolean
  favourited: number
  operation?: "update" | "insert"
}

export async function updateStatsByUser({
  token,
  issuer,
  videoId,
  favourited,
  watched = true,
  operation = "update",
}: Props) {
  const operationsDoc =
    operation === "update" ? operationsDocUpdate : operationsDocInsert

  const response = await queryHasura(
    operationsDoc,
    operation === "update" ? "updateStatsByUser" : "addStatsByUser",
    {
      issuer,
      videoId,
      watched,
      favourited,
    },
    token
  )

  return response
}
