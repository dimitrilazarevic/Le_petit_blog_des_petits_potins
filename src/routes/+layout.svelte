<script>
    export let data ;
    import { page } from '$app/stores'
    import { afterNavigate } from '$app/navigation'
    import Navbutton from '../lib/components/Navbutton.svelte';
    
    let navButtonPath = "/home";
    let navButtonContent = "Accueil";

    afterNavigate(({})=>{
        
        navButtonPath = "/home";
        navButtonContent = "Accueil";

        switch($page.url.pathname){
            case '/home':
                navButtonPath = "/create_post";
                navButtonContent = "Créer un post";
                break ;
        }

    });

</script>

<nav>
    {#if !$page.url.pathname.match(/^[/]{1}confirm_registration/)}

        <Navbutton path={navButtonPath} content={navButtonContent}/>

        {#if !((["/login/normal","/login/redirected","/register"].includes($page.url.pathname))||$page.url.pathname.match(/^[/]{1}user/))}

            {#if !data.userIsConnected}

            <Navbutton path="/login" content="Login"/>

            {:else}

            <Navbutton path={"/user/"+$page.data.user.username} content="Mon compte"/>
            
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

