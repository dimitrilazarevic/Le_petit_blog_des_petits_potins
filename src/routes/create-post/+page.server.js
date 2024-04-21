import { API_URL } from "$lib/config"; 
import { redirect } from '@sveltejs/kit';
import { formToJson } from "$lib/functions";


export const actions = {
    submit: async ({request}) => {	
        let postData = await request.formData();
        let reqBody = formToJson(postData);
        await fetch
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
        .then(()=>redirect(302,'/home'))
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