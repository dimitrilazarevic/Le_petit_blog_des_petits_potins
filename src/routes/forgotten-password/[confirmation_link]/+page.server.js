import { API_URL } from "$lib/config";
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { formToJson,setCookies } from "$lib/functions";

const regExpPassword = /^([a-zA-Z0-9!$_-éèêà]{7,14})$/

function checkPassword(password,password2){
    if(password.match(regExpPassword)&&password==password2){
        return true ;
    }else if(!password.match(regExpPassword)){
        throw new Error('Mot de passe invalide : il doit être entre 7 et 14 caractères.')
    }else{
        throw new Error('Les deux mots de passe ne correspondent pas.')
    }
}

export const actions = {
    submit: async ({request,cookies,params}) => {
        try{
            let userData = await request.formData();
            let reqBody = formToJson(userData);
            let reqBodyJS = JSON.parse(reqBody);
            checkPassword(reqBodyJS.password,reqBodyJS.password2);
            let res = await fetch(API_URL+'/api/forgotten-password/'+params.confirmation_link,{
                method : 'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body : reqBody 
            });

            if(!res.ok){
                throw new Error(await res.json().then((res)=>res.message))
            }

        }catch(err){
            return fail(422,{
                error: err.message,
                status : 422
            })
        }
        cookies.set('pageFrom','/forgotten-password',{path:'/',maxAge:1})
        redirect(302,'/login');
    }
};

export function load(){
    return {regExpPassword};
}