import {API_URL} from '$lib/config';

export async function load({depends}){
    depends('data:posts');
    return {
        posts : await fetch(API_URL+'/get-posts').then((res)=>res.json())
    }
}

  