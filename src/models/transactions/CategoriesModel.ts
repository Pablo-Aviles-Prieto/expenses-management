/* eslint-disable max-len */
import { Schema, model, Document, ObjectId, Model } from 'mongoose'
import { modelExists } from '@/utils'

export interface ICategories extends Document {
  _id: ObjectId
  name: string
  common?: boolean
}

const CategoriesSchema: Schema = new Schema({
  name: { type: String, required: true },
  common: Boolean
})

CategoriesSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc: ICategories, ret: Partial<ICategories>) {
    delete ret._id
  }
})

// eslint-disable-next-line import/no-mutable-exports
let CategoriesModel: Model<ICategories>

if (modelExists('categories')) {
  CategoriesModel = model<ICategories>('categories')
} else {
  CategoriesModel = model<ICategories>('categories', CategoriesSchema)
}

export default CategoriesModel
