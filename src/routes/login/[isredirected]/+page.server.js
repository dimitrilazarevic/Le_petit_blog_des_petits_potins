import { API_URL } from "$lib/config";
import { redirect, fail } from '@sveltejs/kit';
import { formToJson } from "$lib/functions";
import { cookieOptions } from '$lib/config'

// Je déclare cette variable pour que l'username ou l'email de l'user reste affiché si il se trompe de mot de passe

export const actions = {
    submit: async ({request,cookies}) => {
        let usernameoremail;
        let user ;
        try
        {
            let userData = await request.formData();
            let reqBody = formToJson(userData);
            let reqBodyJS = JSON.parse(reqBody);

            let res = 
            await 
            fetch(API_URL+'/login',
            {
                method : 'POST',
                body : reqBody,
                headers : {
                    'Content-Type':'application/json'
                }
            });

            if(!res.ok){
                usernameoremail = reqBodyJS.usernameoremail;
                throw new Error(await res.json().then((res)=>res.message))
            }else
            {
                user = await res.json();
                cookies.set('sessionID',user.sessionID,cookieOptions);
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

export function load({cookies,params}){
    if(!['normal','redirected','passwordchanged'].includes(params.isredirected)){
        redirect(302,'/login/normal');
    }
    return {
        userIsRedirectedFromCreatePost : (params.isredirected=='redirected'),
        userJustChangedPassword : (params.isredirected=='changedpassword')
    }
}
