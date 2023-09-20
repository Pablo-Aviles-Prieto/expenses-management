/* eslint-disable max-len */
import { Schema, model, Document, ObjectId, Model } from 'mongoose'
import { modelExists } from '@/utils/checkModelExist'

export interface ITransaction extends Document {
  _id: ObjectId
  amount: number
  categories: ObjectId[]
  date: string
  name: string
  userId: ObjectId
  createdAt: Date
  updatedAt: Date
  notes?: string
}

const TransactionSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    date: { type: String, required: true },
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    notes: String
  },
  { timestamps: true }
)

TransactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc: Document, ret: Record<string, any>) => {
    if ('_id' in doc) {
      delete ret._id
    }
  }
})

// eslint-disable-next-line import/no-mutable-exports
let TransactionModel: Model<ITransaction>

if (modelExists('transactions')) {
  TransactionModel = model<ITransaction>('transactions')
} else {
  TransactionModel = model<ITransaction>('transactions', TransactionSchema)
}

export default TransactionModel
