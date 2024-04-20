import {API_URL}  from '$lib/config';
import {error} from '@sveltejs/kit';
import { setCookies, readCookies } from '$lib/functions';

export async function load({cookies,params}){
    let message;
    let res = 
        await 
        fetch(API_URL+'/api/confirm-registration/'+params.temporary_link);

    if (res.status == 404){
        error(
            404,
            await res.json()
        );
    }else{
        res = await res.json();
        setCookies(res.user,{cookies})
    }
    return {
        message:res.message
    };
}