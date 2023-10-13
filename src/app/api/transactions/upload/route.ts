import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import csv from 'csv-parser'
import { FIELDS_FROM_CSV, errorMessages } from '@/utils/const'
import { TransactionBulk } from '@/features/Transactions/AddTransactions/interfaces/TransactionBulk'

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const objFile = Object.fromEntries(formData)
  const csvFile: File = objFile.filepond as File

  if (!csvFile || csvFile.type !== 'text/csv') {
    return NextResponse.json({ ok: false, error: errorMessages.fileType }, { status: 400 })
  }

  const results: TransactionBulk[] = []

  return new Promise<NextResponse>(resolve => {
    const csvReadableStream = new Readable()
    csvReadableStream._read = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

    csvFile
      .arrayBuffer()
      .then(buffer => {
        csvReadableStream.push(Buffer.from(buffer))
        csvReadableStream.push(null)

        csvReadableStream
          .pipe(csv({ separator: ';' }))
          .on('data', data => results.push(data as TransactionBulk))
          .on('end', () => {
            const parsedResults = results.map(originalObject => {
              return (FIELDS_FROM_CSV as (keyof TransactionBulk)[]).reduce(
                (acc: Partial<TransactionBulk>, field: keyof TransactionBulk) => {
                  acc[field] = originalObject[field]
                  return acc
                },
                {}
              )
            })
            resolve(NextResponse.json({ ok: true, data: parsedResults }, { status: 200 }))
          })
      })
      .catch(err => {
        resolve(NextResponse.json({ ok: false, error: errorMessages.fileParsing }, { status: 500 }))
      })
  })
}
