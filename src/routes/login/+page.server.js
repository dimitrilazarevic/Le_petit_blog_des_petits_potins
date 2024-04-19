import { API_URL } from "$lib/config";
import { redirect, fail } from '@sveltejs/kit';
import { formToJson,setCookies } from "../../lib/functions";

// Je déclare cette variable pour que l'username ou l'email de l'user reste affiché si il se trompe de mot de passe

export const actions = {
    submit: async ({request,cookies}) => {
        let usernameoremail;
        let user ;
        try{
            let userData = await request.formData();
            let reqBody = formToJson(userData);
            let reqBodyJS = JSON.parse(reqBody)
            let res = await fetch(API_URL+'/api/login',{
                method : 'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body : reqBody 
            });
            if(!res.ok){
                usernameoremail = reqBodyJS.usernameoremail;
                throw new Error(await res.json().then((res)=>res.message))
            }else{
                user = await res.json();
                console.log(user);
                setCookies(user,{cookies});
            }
        }catch(err){
            return fail(422,{
                error: err.message,
                usernameoremail : usernameoremail
            })
        }
        redirect(302,'/home');
    }
};

export function load({cookies}){
    
    return {
        userIsRedirectedFromCreatePost : cookies.get('pageFrom')=='/create-post',
        userJustChangedPassword : cookies.get('pageFrom')=='/forgotten-password'
    } ;
}
