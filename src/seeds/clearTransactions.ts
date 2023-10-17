import mongoose from 'mongoose'
import connectDb from '../config/mongooseDB'
import TransactionModel from '../models/transaction/TransactionModel'

async function clearCollection() {
  try {
    await connectDb()
    await TransactionModel.deleteMany({})
    console.log('Transactions cleared successfully.')
  } catch (error) {
    console.error('Error clearing collection:', error)
  } finally {
    await mongoose.connection.close()
  }
}

// eslint-disable-next-line no-void
void clearCollection()
