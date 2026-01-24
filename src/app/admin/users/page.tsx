export const dynamic = "force-dynamic";
import MannageUser from "@/files/admin/users/MannageUser"
import { db } from "@/index"
import { userProfileProps } from "@/types/types"

const page = async() => {
  const users: userProfileProps[] = await db.query.user.findMany({
    with: {
      profile: true
    }
  })
  return (
    <div className='w-full h-full mt-5 text-white'>
      <MannageUser usersData = {users}/>
    </div>
  )
}

export default page
