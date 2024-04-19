import { error } from "@sveltejs/kit";
import {API_URL} from '$lib/config';
import {readCookies} from '$lib/functions'



export async function load({cookies}){
    return {
        posts : await fetch(API_URL+'/api/get-posts').then((res)=>res.json()),
        user : readCookies({cookies})
    }
}

 