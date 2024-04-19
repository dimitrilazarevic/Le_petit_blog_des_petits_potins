import {cookieOptions,cookieList} from '$lib/config'

export function formToJson(f){
    let object = {};
    f.forEach((value,key) => object[key]=value);
    let json = JSON.stringify(object) ;
    return json ;
}

export function setCookies(user,{cookies}){
    for(let cookieName in cookieList){
        cookies.set(cookieName,user[cookieList[cookieName]],cookieOptions);
    }
    return readCookies({cookies});
}

export function resetCookies({cookies}){
    for(let cookieName in cookieList){
        cookies.delete(cookieName,cookieOptions);
    }
    return readCookies({cookies});
}

export function readCookies({cookies}){
    let cookieReadList = {};
    for(let cookieName in cookieList){
        cookieReadList[cookieName] = cookies.get(cookieName);
    }
    return cookieReadList ;
}


