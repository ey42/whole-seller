import SendToEmail from "@/files/SendToEmail"

const page = () => {
  return (
    <div className='w-full justify-center flex h-full relative backdrop-blur-2xl text-white'>
        <div className=' inset-0 flex px-5 py-5 max-w-3xl  flex-col gap-10'>
                <h1 className="self-center text-4xl mt-10 font-bold">EN Wholesale Distributor</h1>
            <div className='mt-10 gap-4 flex flex-col'>
                <h2 className="font-medium text-xl">contact-us</h2>
                <p className="font-medium text-lg">We are always ready to connect with partners, suppliers, and clients.
                For inquiries, partnerships, or service information, please reach out using the details below.
                </p>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h2 className='font-medium text-xl'>Address:</h2>
                <address>
                    T/Haymanot, Merkato
                </address>
                <address>
                    Addis Ababa, Ethiopia
                </address>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h1 className='font-medium text-xl'>Call:</h1>
                <address className='font-medium'>0967 283 176</address>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h1 className='font-medium text-xl'>Email:</h1>
                <h2 className='font font-medium'>eyobtaffa@gmail.com
                </h2>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h1 className='font-medium text-xl'>you can contact us directly here</h1>
                <SendToEmail/>
            </div>
        </div>
    </div>
  )
}

export default page
