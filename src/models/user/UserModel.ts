/* eslint-disable max-len */
import { Schema, model, Document, ObjectId, Model } from 'mongoose'
import { modelExists } from '@/utils/checkModelExist'

export interface IUser extends Document {
  _id: ObjectId
  image: string
  name: string
  email: string
  password: string
  signupDate: string
  categories: ObjectId[]
}

const UserSchema: Schema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { type: String, required: true },
  signupDate: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }]
})

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  // transform(doc: IUser, ret: Partial<IUser>) {
  //   delete ret.password
  //   delete ret._id
  // }
  transform: (doc: Document, ret: Record<string, any>) => {
    if ('_id' in doc && 'password' in doc) {
      // rudimentary type check
      delete ret._id
      delete ret.password
    }
  }
})

// eslint-disable-next-line import/no-mutable-exports
let UserModel: Model<IUser>

if (modelExists('users')) {
  UserModel = model<IUser>('users')
} else {
  UserModel = model<IUser>('users', UserSchema)
}

export default UserModel

// currency: To store the user's preferred currency for displaying expenses and incomes. This could be an ISO 4217 currency code, like "USD", "EUR", or "JPY".
// timezone: To store the user's timezone, which can be helpful for displaying date and time information correctly.
// dateFormat: To store the user's preferred date format, like "MM/DD/YYYY" or "DD/MM/YYYY".
// categories: An array of custom categories that the user can define for categorizing their expenses (e.g., "groceries", "entertainment", "bills", etc.).
// roles: If you plan to implement different access levels or roles within the application (e.g., admin, user, guest), storing roles in the user schema can help manage user permissions.
// notificationPreferences: User preferences for receiving notifications or reminders about important events, such as upcoming bills or recurring expenses.
// lastLogin: Timestamp of the user's last login, which can be useful for tracking user engagement or detecting inactive accounts.
