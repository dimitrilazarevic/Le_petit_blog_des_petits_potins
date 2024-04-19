<script>

    import Titrepage from "$lib/components/Titrepage.svelte";
    import { afterNavigate } from '$app/navigation'
    import { page } from '$app/stores';

    export let form;
    export let data ;

    let usernameoremail = '';

    if(form!=null){
        usernameoremail=form.usernameoremail;
    }

</script>

<Titrepage content="Login"/>

<div class="error-container">
    {#if form?.error}
        <p class="error">Erreur : {form.error}</p>
    {:else if data.userIsRedirectedFromCreatePost}
        <p class="error">Vous devez être connecté pour écrire un post</p>
    {/if}
</div>

<form id="login-register-form" method="POST" action="?/submit">
    <label for="usernameoremail">
        Email ou nom d'utilisateur :
    </label>
    <input name="usernameoremail" type="text" bind:value={usernameoremail} autofocus/>
    <label for='body'>
        Mot de passe :
    </label>
    <input name="password" type="password"/>
    <div class="actions-container">
        <button type="submit">Login</button>
        <a href="/register">Première connexion ?</a>
    </div>
</form>

<style>
    :root{
    --form-element-margin : 20px;
    }
    .error-container{
        width: 100%;
        position:fixed;
    }
    .error{
        font-size: 1.2em;
        color:red;
        text-align: center;
    }
    form{
        display:grid;
        grid-template-columns: 2fr 5fr;
        grid-template-rows: repeat(3,100px);
        margin : 100px 30% 0 30%;
        border:3px solid black;
        background-color: floralwhite;
    }
    label{
        font-size: 1.1em;
        margin:var(--form-element-margin);
    }
    input{
        margin:var(--form-element-margin);
        max-height: 2em;
        font-family:Quicksand;
        font-size: 1em;
    }

    .actions-container{
        display:flex;
        align-items: center;
        justify-content: center;
        gap:40px;
        margin: var(--form-element-margin);
        grid-column-end: span 2;
        width: 60%;
        justify-self: center;
        font-family: Quicksand;
    }
    button{
        justify-self: center;
        font-size: 1.4em;
        font-family: Quicksand;
        background-color: plum;
        padding: 10px;
        cursor : pointer ;
    }

</style>