import { API_URL } from "$lib/config"; 
import { error, fail, redirect } from '@sveltejs/kit';
import { formToJson } from "$lib/functions";


export const actions = {
    submit: async ({request}) => {	
        let postData = await request.formData();
        let reqBody = formToJson(postData);
        let res = await fetch
        (
            API_URL+'/create-post',
            {
                method : 'POST',
                body : reqBody,
                headers : 
                {
                    'Content-Type':'application/json'
                }
            }
        )
        if(!res.ok)
        {
            return fail(422,{error: "Le post n'a pas pu être créé..."})
        }else
        {
            redirect(302,'/home')
        }
    }
};

export async function load({cookies}){
        if(
            await 
            fetch
            (API_URL+'/user-info/'+cookies.get('sessionID'))
            .then((res)=>res.json())
            .then((res)=>res.status)
            ==
            'logged out'
        ){
            redirect(302,'/login/redirected') ;
        }    
}