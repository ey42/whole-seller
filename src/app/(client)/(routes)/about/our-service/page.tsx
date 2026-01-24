
const page = () => {
  return (
    <div className='w-full justify-center flex h-full relative backdrop-blur-2xl text-white'>
        <div className=' inset-0 flex px-5 py-5 max-w-3xl items-center justify-center flex-col gap-10'>
                <h1 className="self-center text-4xl mt-10 font-bold">EN Wholesale Distributor</h1>
            <div className='mt-10 gap-4 flex flex-col'>
                <h2 className="font-medium text-xl">Our Services</h2>
                <p className="font-medium text-lg">At EN Wholesale Distributor, we provide reliable and efficient services designed to support suppliers, retailers, and business partners across the distribution process.
                </p>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h2 className='font-medium text-xl'>Wholesale Distribution</h2>
                <p>Our wholesale distribution service ensures consistent product availability and dependable delivery to retailers and businesses.
                </p>
                <p>We work directly with suppliers and manufacturers to distribute products efficiently while maintaining quality, accurate order handling, and competitive pricing. Our focus is on minimizing delays and helping our partners maintain steady inventory levels.
                </p>
                <p className="font-medium">
                Key focus areas include:
                </p>
                <ul className='list-item list-disc ml-10'>
                    <li>Bulk product distribution</li>
                    <li>Reliable order fulfillment</li>
                    <li>Consistent supply management</li>
                    <li>Long-term supplier and retailer partnerships</li>
                </ul>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h1 className='font-medium text-xl'>Logistics & Supply Chain</h1>
                <h2 className='font-medium'>We manage logistics and supply chain coordination to ensure smooth movement of goods from source to destination.</h2>
                <p>Our logistics approach emphasizes efficiency, coordination, and reliability. By optimizing transportation and inventory flow, we help reduce operational challenges and improve delivery performance.
                </p>
                <p className="font-medium">Key focus areas include:</p>
                <ul className='list-item list-disc ml-10'>
                    <li>Transportation coordination</li>
                    <li>Inventory flow management</li>
                    <li>Delivery scheduling and tracking</li>
                    <li>Operational efficiency and cost control</li>
                </ul>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h1 className='font-medium text-xl'>Market Access</h1>
                <h2 className='font font-medium'>Our market access service helps suppliers and producers reach retailers and business customers more effectively.
                </h2>
                <p>By leveraging local market knowledge and established distribution networks, EN Wholesale Distributor supports product visibility and accessibility, especially during market entry and expansion phases.</p>
                <p className="font-medium">Key focus areas include:</p>
                <ul className='list-item list-disc ml-10'>
                    <li>Connecting suppliers with retailers</li>
                    <li>Supporting product market entry</li>
                    <li>Expanding distribution reach</li>
                    <li>Strengthening local trade networks</li>
                </ul>
                <p>Led by Eyob Taffa, the team is committed to maintaining high service standards, meeting delivery timelines, and ensuring smooth day-to-day operations for our partners.
                </p>
            </div>
            <div className='flex flex-col border shadow-md shadow-white p-4 gap-4'>
                <h1 className='font-medium text-xl'>EN Wholesale Distributor</h1>
                <h2 className='font-medium'>
                    Connecting Products to Markets with Reliability and Efficiency
                </h2>
            </div>
        </div>
    </div>
  )
}

export default page
