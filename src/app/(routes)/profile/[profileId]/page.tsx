import { user } from '@/db/schema'
import Profile from '@/files/Profile'
import { db } from '@/index'
import { eq } from 'drizzle-orm'

interface PageProps{
        params: {
            profileId: string
        }
    }
const page = async({params}: PageProps) => {
    const {profileId} = await params

    console.log(`id in profile page ${profileId}`)
  return (
    <div className='w-full flex items-center mb-10 justify-center'>
      <Profile id={profileId} />
    </div>
  )
} 

export default page
