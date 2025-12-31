import { authClient } from "@/lib/auth-client"; //import the auth cliente
import type { formDataProps } from "./Sign-up";

export async function SignUp(formData: formDataProps){
    const {email, password1, fullName} = formData
    console.log(`email in signup function ${email}`)
    const {data, error} = await authClient.signUp.email({
        email, 
        password: password1, 
        name: fullName,
        callbackURL: "/" 
    }, {
        onRequest: (ctx) => {
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
return {data, error};
}

export async function SignIn(email: string, password: string){

    const {data, error} = await authClient.signIn.email({
        email, // user email address
        password, // user password})*asReact 
        callbackURL: "/" // A URL to redirect to after the user signs in (optional)
});
return {data, error};
}

export async function SignOut(){
    const {error} = await authClient.signOut();
    if(error){
        alert(`there is an error on sign out: ${error.message}`);
    }
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