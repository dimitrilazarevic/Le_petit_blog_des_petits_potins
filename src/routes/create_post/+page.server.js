import { API_URL } from "$lib/config"; 
import { redirect } from '@sveltejs/kit';
import { formToJson,readCookies } from "../../lib/functions";


export const actions = {
    submit: async ({request}) => {	
        let postData = await request.formData();
        let reqBody = formToJson(postData);
        await fetch
        (
            API_URL+'/api/create-post',
            {
                method : 'POST',
                body : reqBody,
                headers : 
                {
                    'Content-Type':'application/json'
                }
            }
        )
        .then(()=>redirect(302,'/home'))
    }
};

export function load({cookies}){
    switch(readCookies({cookies}).userStatus){
        case undefined :
        case 'pending' :
            redirect(302,'/login/redirected') ;
    }
}