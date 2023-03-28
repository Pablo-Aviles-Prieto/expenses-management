import mongoose from 'mongoose'

interface DBENVI {
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_HOST: string
  DB_NAME: string
  DB_PROTOCOL: string
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

const environmentVariables = {
  DB_USERNAME: OVERRIDE_NODE_ENV === 'development' ? DB_USERNAME_DEV! : DB_USERNAME_PROD!,
  DB_PASSWORD: OVERRIDE_NODE_ENV === 'development' ? DB_PASSWORD_DEV! : DB_PASSWORD_PROD!,
  DB_HOST: OVERRIDE_NODE_ENV === 'development' ? DB_HOST_DEV! : DB_HOST_PROD!,
  DB_NAME: DB_NAME!,
  DB_PROTOCOL: OVERRIDE_NODE_ENV === 'development' ? 'mongodb' : 'mongodb+srv'
}

export const mongodbConnection = (envVariables: DBENVI) => {
  // eslint-disable-next-line max-len
  const databaseUrl = `${envVariables.DB_PROTOCOL}://${envVariables.DB_USERNAME}:${envVariables.DB_PASSWORD}@${envVariables.DB_HOST}/${envVariables.DB_NAME}?retryWrites=true&w=majority`
  return mongoose.connect(databaseUrl)
}

export const bootstrapMongoDB = async () => {
  try {
    const mongoConnection = await mongodbConnection(environmentVariables)
    const { databaseName } = mongoConnection.connections[0].db
    console.log(
      `Connected to Mongo! (${
        OVERRIDE_NODE_ENV === 'development' ? 'DEV DB' : 'PROD DB'
      }) Database name: ${databaseName}`
    )
  } catch (error) {
    console.error(`Error connecting to mongo database, Error description: ${(error as Error).message}`)
  }
}
