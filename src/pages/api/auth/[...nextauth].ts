import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/config/mongoDB'
import { MongoClient } from 'mongodb'
import { IUser } from '@/models'

export default NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>),
  // adapter: MongooseAdapter(connectDb()).getAdapter,
  providers: [
    CredentialsProvider({
      id: 'user-pw',
      name: 'user/password',
      async authorize(credentials, req) {
        const client = await clientPromise
        const user = (await client.db().collection('users').findOne({ email: credentials?.email })) as IUser | null
        if (!user) return null

        const returnedUser = {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        }
        console.log('returnedUser', returnedUser)

        return returnedUser
      },
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? ''
    })
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt'
  },
  theme: {
    colorScheme: 'light'
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  debug: false
})
