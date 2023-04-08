// import { useQuery } from '@/hooks/useQuery'
// import { useRouter } from 'next/router'
// import { ResponseUserI } from '@/interfaces'
// import { URL_API } from '@/utils/const'

// const URL = `${URL_API || ''}/api/user`

// type ResponseI = {
//   user: ResponseUserI
// }

const UserDetails = () => {
  console.log('check1')
  // const router = useRouter()
  // const { userId } = router.query
  // const { data } = useQuery<ResponseI>({ url: `${URL}/${userId as string}` })
  // console.log('data', data)
  // console.log('loading', loading)

  // if (loading) {
  //   return <div className="text-9xl">Loading details ...</div>
  // }

  // if (error) {
  //   console.log('ERROR', error)
  //   // eslint-disable-next-line no-void
  //   void router.push('/')
  // }

  return (
    <div>
      <h1>{/* Welcome back {data?.user.name} ({userId}) */}</h1>
      {/* Render user details here */}
    </div>
  )
}

export default UserDetails
