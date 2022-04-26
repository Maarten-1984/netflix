export const queryHasura = async (
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>,
  token: string
) => {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "X-Hasura-Access-Key": process.env.NEXT_PUBLIC_HASURA_ACCESS_KEY || "",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables,
      operationName,
    }),
  })

  return await result.json()
}
