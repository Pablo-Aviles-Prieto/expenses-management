/* eslint-disable max-len */
import { Schema, model, Document, ObjectId, Model } from 'mongoose'
import { modelExists } from '@/utils'

export interface ITransaction extends Document {
  _id: ObjectId
  amount: number
  categories: ObjectId[]
  creationDate: string
  date: string
  name: string
  notes?: string
}

const TransactionSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
  creationDate: { type: String, required: true },
  date: { type: String, required: true },
  name: { type: String, required: true },
  notes: String
})

TransactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc: ITransaction, ret: Partial<ITransaction>) {
    delete ret._id
  }
})

// eslint-disable-next-line import/no-mutable-exports
let TransactionModel: Model<ITransaction>

if (modelExists('transaction')) {
  TransactionModel = model<ITransaction>('transaction')
} else {
  TransactionModel = model<ITransaction>('transaction', TransactionSchema)
}

export default TransactionModel
