

interface pageProps {
    params: {
        adminId: string
    }
}
const page = async({params}: pageProps) => {
    const {adminId} = await params
  return (
    <div>
      hy
    </div>
  )
}

export default page
