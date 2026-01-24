
export async function LoginUser(input: {
    email:string;
    password: string;
    callbackUrl?: string;

}) {
    const res = await fetch('http://localhost:3000/api/authentication/login',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({ email: input.email, password: input.password})
    })
    const result = await res.json()
    if(res.ok){
      if(typeof window !== 'undefined' && input.callbackUrl){
        window.location.href = input.callbackUrl
      }
        return {success: true, message: result.message}
    }
    
    return {success: false, message: result.message}
}

export async function sign_up(
  input: {email: string, 
    password: string, 
    callbackUrl?: string,
    kebele: string,
    phoneNumber: string,
    shopName: string,
    subCity: string,
    tinNumber: string,
    woreda: string,
    image: string | null, 
    name: string}){
  const res = await fetch('http://localhost:3000/api/authentication/sign-up',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password, 
      name: input.name,
      kebele: input.kebele,
      phoneNumber: input.phoneNumber,
      shopName: input.shopName,
      subCity: input.subCity,
      tinNumber: input.tinNumber,
      woreda: input.woreda,
      image: input.image,
    })
  })
  const result = await res.json()
    if(res.ok){
      if(typeof window !== 'undefined' && input.callbackUrl){
        window.location.href = input.callbackUrl
      }
        return {success: true, message: result.message, data: result.data}
    }
    
    return {success: false, message: result.message, data: result.data}

}