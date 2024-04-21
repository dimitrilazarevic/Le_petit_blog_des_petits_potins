import { cookieOptions } from "$lib/config"
import { redirect } from "@sveltejs/kit";

export const actions = {
    logout:({cookies})=>{
        cookies.delete('sessionID',cookieOptions);
        redirect(302,'/')
    }
}
