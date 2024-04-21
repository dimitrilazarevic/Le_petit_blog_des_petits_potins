import { API_URL, cookieOptions } from "$lib/config";

export async function load({cookies,depends}){
    depends('data:sessionID');
    //Refreshing cookies on each page change
    if(cookies.get('sessionID')!=null)
    {
        cookies.set('sessionID',cookies.get('sessionID'),cookieOptions)
    }
    return {
        sessionID : cookies.get('sessionID'),
        userInfo : await fetch(API_URL+'/user-info/'+cookies.get('sessionID')).then((res)=>res.json())
    }
}