import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import csv from 'csv-parser'

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const objFile = Object.fromEntries(formData)
  const csvFile: File = objFile.filepond as File

  if (!csvFile || csvFile.type !== 'text/csv') {
    return NextResponse.json({ ok: false, message: 'Wrong file type' }, { status: 400 })
  }

  const results: any[] = []

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
          .on('data', data => results.push(data))
          .on('end', () => {
            console.log('results', results)
            // const parsedResult = results.map(row => ({ date: row.date }))
            resolve(NextResponse.json({ ok: true, data: results }, { status: 200 }))
          })
      })
      .catch(err => {
        resolve(
          NextResponse.json({ ok: false, message: 'File processing failed' }, { status: 500 })
        )
      })
  })
}
