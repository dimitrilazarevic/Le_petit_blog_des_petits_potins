<script>
    import Titrepage from "$lib/components/Titrepage.svelte";
    export let form ;
    export let data ;

    //Pour différencier si la page est login ou register
    let isLogin = false ;

    //Le code qui suit permet de garder l'username et l'email en cas de submit raté
    let username,email ;
    username = email = '';
    let successMessage = null;

    if (form!=null){
        switch(form.status){
            case 422:
                email = form.email;
                username = form.username;
                break ;
            case 200:
                successMessage = "Un email de confirmation vous a été envoyé à l'adressse "+form.email+" !"
        }
    }


    let password,password2 ;
    password = password2 = '';
    $: passwordsMatch = password==password2||password.length<7||password2=='' ;
    let passwordIsGood = true ;
    let regExpPassword = data.regExpPassword;
    let submitErrorMessageIsVisible = true ; 

    function hideSubmitErrorMessage(){
        submitErrorMessageIsVisible = false ;
    }

    function checkPasswordValidity(){
        passwordIsGood = password.match(regExpPassword)||password==''
        hideSubmitErrorMessage();
    }


</script>

<Titrepage content="Register"/>

<div class="error-container">

    {#if form?.error && submitErrorMessageIsVisible}

        <p class="error">Erreur : {form.error}</p>
 
    {:else if !passwordIsGood} 

        <p class="error">Le mot de passe doit être compris entre 7 et 14 caractères.</p>

    {:else if !passwordsMatch}

        <p class="error">Les deux mots de passe doivent correspondre !</p>

    {:else if successMessage!=null}

        <p class="success">{successMessage}</p>

    {/if}

</div>


<form id="login-register-form" method="POST" action="?/submit">
    <label for="username">
        Nom d'utilisateur :
    </label>
    <input name="username" on:keyup|once={hideSubmitErrorMessage} bind:value={username} autofocus required/>
    <label for="email">
        Adresse mail :
    </label>
    <input name="email" type="email" on:keyup|once={hideSubmitErrorMessage} bind:value={email} required/>
    <label for='password'>
        Mot de passe :
    </label>
    <input name="password" type="password" bind:value={password} on:keyup={checkPasswordValidity} required/>
    <label for='password2'>
        Répétez le mot de passe :
    </label>
    <input name="password2" type="password" bind:value={password2} on:keyup|once={hideSubmitErrorMessage} required/>
    <div class="actions-container">
        <button type="submit">Register</button>
        <a href="/login">Déjà inscrit ?</a>
    </div>
</form>

<style>
    :root{
    --form-element-margin : 20px;
    }
    form{
        display:grid;
        grid-template-columns: 3fr 5fr;
        grid-template-rows: 100px;
        margin : 30px 30% 0 30%;
        border:1px solid black;
        background-color: floralwhite;
    }
    label{
        font-size: 1.1em;
        margin:var(--form-element-margin);
    }
    input{
        margin:var(--form-element-margin);
        height: 2em;
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