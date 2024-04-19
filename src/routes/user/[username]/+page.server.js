import { resetCookies,readCookies } from "$lib/functions"
import { redirect } from "@sveltejs/kit";

export const actions = {
    logout:({cookies})=>{
        resetCookies({cookies});
        redirect(302,'/')
    }
}

export function load({cookies}){
    return readCookies({cookies})
}