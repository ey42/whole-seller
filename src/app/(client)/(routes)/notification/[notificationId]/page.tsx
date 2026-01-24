import Notification from '@/files/Notification';

interface notificationProps{
    params: {
        notificationId: string
    }
}

const page = async({params}: notificationProps) => {
    const {notificationId} = await params;


  return (
    <div className='w-full flex items-center mb-10 justify-center'>
      <Notification notificationId = {notificationId}/>
    </div>
  )
}

export default page
