import { UserModel, IUser } from '@/models'
import mongoose, { Document, ObjectId } from 'mongoose'
import type { AdapterUser, DefaultAdapter } from 'next-auth/adapters'

interface AppOptions {
  debug: boolean
}

type AdapterInstance = Omit<DefaultAdapter, 'createUser' | 'updateUser'> & {
  createUser(profile: IUser): Promise<AdapterUser>
  getUser(id: string): Promise<AdapterUser | null>
  getUserByEmail(email: string): Promise<AdapterUser | null>
  getUserByProviderAccountId(providerId: string, providerAccountId: string): Promise<any>
  updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser | null>
  linkAccount(
    userId: string,
    providerId: string,
    providerType: string,
    providerAccountId: string,
    refreshToken: string,
    accessToken: string,
    accessTokenExpires: any
  ): Promise<any>
  unlinkAccount(userId: string, providerId: string, providerAccountId: string): Promise<any>
  createSession(user: any): Promise<any>
  getSession(sessionToken: string): Promise<any>
  updateSession(session: any, force: boolean): Promise<any>
  deleteSession(sessionToken: string): Promise<any>
  createVerificationRequest(identifier: string, url: string, token: string, secret: string, provider: any): Promise<any>
  getVerificationRequest(identifier: string, token: string, secret: string, provider: any): Promise<any>
  deleteVerificationRequest(identifier: string, token: string, secret: string, provider: any): Promise<any>
}

interface AdapterInstance2 {
  // createUser(profile: IUser): Promise<Document<unknown, any, IUser>>
  // getUser(id: string): Promise<Document<unknown, any, IUser> | null>
  // getUserByEmail(email: string): Promise<Document<unknown, any, IUser> | null>
  // getUserByProviderAccountId(providerId: string, providerAccountId: string): Promise<any>
  // updateUser(user: IUser): Promise<Document<unknown, any, IUser> | null>
  createUser(profile: IUser): Promise<any>
  getUser(id: string): Promise<any>
  getUserByEmail(email: string): Promise<Document<unknown, any, IUser> | null>
  getUserByProviderAccountId(providerId: string, providerAccountId: string): Promise<any>
  updateUser(user: IUser): Promise<any>
  linkAccount(
    userId: string,
    providerId: string,
    providerType: string,
    providerAccountId: string,
    refreshToken: string,
    accessToken: string,
    accessTokenExpires: any
  ): Promise<any>
  unlinkAccount(userId: string, providerId: string, providerAccountId: string): Promise<any>
  createSession(user: any): Promise<any>
  getSession(sessionToken: string): Promise<any>
  updateSession(session: any, force: boolean): Promise<any>
  deleteSession(sessionToken: string): Promise<any>
  createVerificationRequest(identifier: string, url: string, token: string, secret: string, provider: any): Promise<any>
  getVerificationRequest(identifier: string, token: string, secret: string, provider: any): Promise<any>
  deleteVerificationRequest(identifier: string, token: string, secret: string, provider: any): Promise<any>
}

const MongooseAdapter = (connectionDB: Promise<typeof mongoose>): AdapterInstance => {
  return {
    async createUser(profile: IUser) {
      const newUser = new UserModel(profile)
      const savedUser = (await newUser.save()) as IUser & AdapterUser
      const userId: ObjectId = savedUser._id
      return { ...savedUser.toJSON(), id: userId.toString() } as AdapterUser
    },
    async getUser(id: string) {
      const user = await UserModel.findById(id).exec()
      if (!user) return null
      return { ...user.toJSON() } as AdapterUser
    },
    async getUserByEmail(email: string) {
      const user = await UserModel.findOne({ email })
      if (!user) return null
      return { ...user.toJSON() } as AdapterUser
    },
    async getUserByProviderAccountId(providerId, providerAccountId) {
      // Implement this function based on your requirements
    },
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
      const newUser = await UserModel.findByIdAndUpdate(user.id, user, {
        new: true
      })
      if (!newUser) return null
      return { ...newUser.toJSON() } as AdapterUser
    },
    async linkAccount(
      userId,
      providerId,
      providerType,
      providerAccountId,
      refreshToken,
      accessToken,
      accessTokenExpires
    ) {
      // Implement this function based on your requirements
    },
    async unlinkAccount(userId, providerId, providerAccountId) {
      // Implement this function based on your requirements
    },
    async createSession(user) {
      // Implement this function based on your requirements
    },
    async getSession(sessionToken) {
      // Implement this function based on your requirements
    },
    async updateSession(session, force) {
      // Implement this function based on your requirements
    },
    async deleteSession(sessionToken) {
      // Implement this function based on your requirements
    },
    async createVerificationRequest(identifier, url, token, secret, provider) {
      // Implement this function based on your requirements
    },
    async getVerificationRequest(identifier, token, secret, provider) {
      // Implement this function based on your requirements
    },
    async deleteVerificationRequest(identifier, token, secret, provider) {
      // Implement this function based on your requirements
    }
  }
}

export default MongooseAdapter
