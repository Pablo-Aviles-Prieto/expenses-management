import mongoose from 'mongoose'

interface DBENVI {
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_HOST: string
  DB_NAME: string
  DB_PROTOCOL: string
}

export async function connectDb(): Promise<void> {
  if (mongoose.connection.readyState) {
    return
  }

  const {
    NODE_ENV,
    DB_USERNAME_PROD,
    DB_USERNAME_DEV,
    DB_PASSWORD_PROD,
    DB_PASSWORD_DEV,
    DB_HOST_DEV,
    DB_HOST_PROD,
    DB_NAME
  } = process.env

  const OVERRIDE_NODE_ENV = NODE_ENV === 'development' ? 'production' : 'development'

  const environmentVariables: DBENVI = {
    DB_USERNAME: OVERRIDE_NODE_ENV === 'development' ? DB_USERNAME_DEV! : DB_USERNAME_PROD!,
    DB_PASSWORD: OVERRIDE_NODE_ENV === 'development' ? DB_PASSWORD_DEV! : DB_PASSWORD_PROD!,
    DB_HOST: OVERRIDE_NODE_ENV === 'development' ? DB_HOST_DEV! : DB_HOST_PROD!,
    DB_NAME: DB_NAME!,
    DB_PROTOCOL: OVERRIDE_NODE_ENV === 'development' ? 'mongodb' : 'mongodb+srv'
  }

  // eslint-disable-next-line max-len
  const databaseUrl = `${environmentVariables.DB_PROTOCOL}://${environmentVariables.DB_USERNAME}:${environmentVariables.DB_PASSWORD}@${environmentVariables.DB_HOST}/${environmentVariables.DB_NAME}?retryWrites=true&w=majority`

  const connection = await mongoose.connect(databaseUrl)

  console.log(
    `Connected to Mongo! (${OVERRIDE_NODE_ENV === 'development' ? 'DEV DB' : 'PROD DB'}) Database name: ${
      connection.connection.db.namespace ?? 'NONE'
    }`
  )
}
