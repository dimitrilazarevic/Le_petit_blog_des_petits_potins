import { readCookies } from "$lib/functions";

export function load({cookies}){
    return {
        userIsConnected : readCookies({cookies}).userStatus != undefined,
        user : readCookies({cookies})} ;
}