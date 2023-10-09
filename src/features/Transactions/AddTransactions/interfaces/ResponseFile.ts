import { TransactionBulk } from './TransactionBulk'

export type ResponseFile = {
  ok: boolean
  data?: TransactionBulk
  error?: string
}
