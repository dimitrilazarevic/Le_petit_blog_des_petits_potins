export function formToJson(f){
    let object = {};
    f.forEach((value,key) => object[key]=value);
    let json = JSON.stringify(object) ;
    return json ;
}

export function generateString(length) 
{
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    for ( let i = 0; i < length; i++ ) 
    {
        result += 
        characters
        .charAt
        (Math.floor
            (Math.random() * charactersLength)
        );
    }
    return result;
}


