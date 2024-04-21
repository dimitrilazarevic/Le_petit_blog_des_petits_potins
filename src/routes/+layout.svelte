<script>
    export let data ;
    import { page } from '$app/stores'
    import { afterNavigate, invalidate } from '$app/navigation'
    import Navbutton from '../lib/components/Navbutton.svelte';
    
    let navButtonPath 
    let navButtonContent = 'Loading...'

    afterNavigate(({})=>{

        invalidate('data:sessionID');

        if($page.url.pathname!='/home')
        {
            navButtonPath = "/home";
            navButtonContent = "Accueil";
        }

        switch($page.url.pathname){
            case '/home':
                navButtonPath = "/create-post";
                navButtonContent = "Créer un post";
                break ;
        }

    });

</script>

<nav>
    {#if !$page.url.pathname.match(/^[/]{1}confirm-registration/)}

        <Navbutton path={navButtonPath} content={navButtonContent}/>

        {#if !((["/login/normal","/login/redirected","/register"].includes($page.url.pathname))||$page.url.pathname.match(/^[/]{1}user/))}

            {#if data.userInfo.status=="logged out"}

            <Navbutton path="/login" content="Login"/>

            {:else}

            <Navbutton path={"/user/"+data.userInfo.username} content="Mon compte"/>
            
            {/if}

        {/if}

    {/if}
</nav>

<style>
    nav{
        display: flex;
        width: 96%;
        justify-content: space-between;
        position: fixed;
        top : 20px;
        left:2%
    }
</style>

<slot></slot>

