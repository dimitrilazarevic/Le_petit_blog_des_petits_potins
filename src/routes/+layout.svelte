<script>
    export let data ;
    import { page } from '$app/stores'
    import { afterNavigate } from '$app/navigation'
    import Navbutton from '../lib/components/Navbutton.svelte';
    let navButtonPath;
    let navButtonContent;  

    afterNavigate();
        switch($page.url.pathname){
            case '/home':
                navButtonPath = "/create_post";
                navButtonContent = "Créer un post";
                break ;
            case '/create_post':
            case '/login':
            case '/register':
            case '/forgotten_password':
                navButtonPath = "/home";
                navButtonContent = "Accueil";
                break ;
        }
        let regExpUser = /^[/]{1}user/
        if($page.url.pathname.match(regExpUser)!=null){
            navButtonPath = "/home";
            navButtonContent = "Accueil";
        }
        if($page.status==404){
            navButtonPath = "/home";
            navButtonContent = "Accueil";
        }

</script>

<nav>
    {#if !$page.url.pathname.match(/^[/]{1}confirm_registration/)}

        <Navbutton path={navButtonPath} content={navButtonContent}/>

        {#if !((["/login","/register"].includes($page.url.pathname))||$page.url.pathname.match(/^[/]{1}user/))}

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

