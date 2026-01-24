
import { LoginEmail, Logout, signUpEmail } from "../bek/bek-client"



    export const bekaAuth = () => {
    const auth = {
       async getSesssion(){
    const res = await fetch('http://localhost:3000/api/authentication/get-session',{
        cache: "no-store",
        credentials: "include"
    })
    if(!res.ok){
        return null
    }
    const data = await res.json()
    const activeUser = data.activeUser
    if(!activeUser) return null

    return activeUser; 
        },
      LoginEmail,
      signUpEmail,
      Logout

    }
    return auth
    
        }
    
    
