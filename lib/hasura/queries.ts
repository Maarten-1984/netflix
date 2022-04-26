const operationsDocCreateUser = `
  mutation createMutation($email: String!, $issuer: String!, $publicAddress: String!) {
    insert_users(objects: { email: $email, issuer: $issuer, publicAddress: $publicAddress }) {
      affected_rows
    }
  }
`

const operationsDocGetVideo = `
  query getVideoByUser($video: String!, $user: String!) {
    stats(where: {videoId: {_eq: $video}, userId: {_eq: $user}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`

const operationsDocGetWatchedVideos = `
  query getWatchedVideosByUser($userId: String!) {
    stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`

const operationsDocGetFavourites = `
  query getFavouriteVideosByUser($userId: String!) {
    stats(where: {userId: {_eq: $userId}, favourited: {_eq: 1}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`

const operationsDocUpdate = `
  mutation updateStatsByUser($issuer: String!, $videoId: String!, $watched: Boolean!, $favourited: Int!) {
    update_stats(where: {userId: {_eq: $issuer}, videoId: {_eq: $videoId}}, _set: {
      watched: $watched,
      favourited: $favourited
    }) {
      affected_rows
    }
  }
`

const operationsDocInsert = `
  mutation addStatsByUser($issuer: String!, $videoId: String!, $watched: Boolean!, $favourited: Int!) {
    insert_stats_one(object: {userId: $issuer, videoId: $videoId, watched: $watched, favourited: $favourited}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`

const operationsDocIsUser = `
  query IsUser($issuer: String!) {
    users(where: { issuer: { _eq: $issuer }} ) {
      id
      email
      issuer
      publicAddress
    }
  }
`

export {
  operationsDocGetWatchedVideos,
  operationsDocGetFavourites,
  operationsDocCreateUser,
  operationsDocGetVideo,
  operationsDocUpdate,
  operationsDocInsert,
  operationsDocIsUser,
}
