import { authClient } from "@/lib/auth-client"; //import the auth cliente
import { bekaAuth } from "@/lib/auth/authentication";
import { formDataProp } from "@/types/types";

type updatedUser = Omit <formDataProp, 'image' | 'password2' > &{
    image: string | null 
}
export async function SignUp(formData: updatedUser){
    const {email, password1, fullName,kebele,phoneNumber,shopName,subCity,tinNumber,woreda,image} = formData
    console.log(`email in signup function ${email}`)
    const {message, success, data} = await bekaAuth().signUpEmail({
        email, 
        password: password1, 
        name: fullName,
        kebele,
        phoneNumber,
        shopName,
        subCity,
        tinNumber,
        woreda,
        image,
        callbackUrl: "/login" 
    }, {
        onRequest: () => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
});
return {message, success, data};
}

export async function SignIn(email: string, password: string){

    const {data, error} = await authClient.signIn.email({
        email, // user email address
        password, // user password})*asReact 
        callbackURL: '/',
});
return {data, error};
}

export async function SignOut(){
    // const {error} = await authClient.signOut();
    // if(error){
    //     alert(`there is an error on sign out: ${error.message}`);
    // }
    const {message, success} = await bekaAuth().Logout()
}
export async function requestPasswordReset(email: string, redirectUrl: string){
    const {data, error} = await authClient.requestPasswordReset({
        email,
        redirectTo: redirectUrl,
    });
    return {data, error};
}

export async function resetPassword(token: string, newPassword: string){
    const {data, error} = await authClient.resetPassword({
        token,
        newPassword,
    });
    return {data, error};
}