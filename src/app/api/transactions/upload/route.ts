import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const objFile = Object.fromEntries(formData)
  console.log('formData', formData)
  console.log('objFile', objFile)

  return NextResponse.json({ ok: true, data: 'test' }, { status: 200 })
}
