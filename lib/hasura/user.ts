import { queryHasura } from "./baseQuery"
import { operationsDocCreateUser, operationsDocIsUser } from "./queries"

export async function isUser(token: string, issuer: string) {
  const response = await queryHasura(
    operationsDocIsUser,
    "IsUser",
    { issuer },
    token
  )

  return response?.data?.users?.length > 0
}

export async function createUser(token: string, user: any) {
  await queryHasura(
    operationsDocCreateUser,
    "createMutation",
    {
      email: user.email,
      issuer: user.issuer,
      publicAddress: user.publicAddress,
    },
    token
  )
}
