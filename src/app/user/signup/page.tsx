import SignUp from '@/features/SignUp/SignUp'

// TODO: Check if the user is already signed in, dont load the SignUp component
// using the getServerSession from next-auth
const Page = () => {
  return <SignUp />
}

export default Page
