<script>
    import Titrepage from "$lib/components/Titrepage.svelte";
    export let form ;
    export let data ;

    let successMessage = null;

    if (form!=null){
        switch(form.status){
            case 200:
                alert('Mot de passe changé avec succès !')
                break;
        }
    }


    let password,password2 ;
    password = password2 = '';
    $: passwordsMatch = password==password2||password.length<7||password2=='' ;
    let passwordIsGood = true ;
    let regExpPassword = data.regExpPassword;
    let submitErrorMessageIsVisible = true ; 


    function showSubmitErrorMessage(){
        submitErrorMessageIsVisible = true ;
    }
    function hideSubmitErrorMessage(){
        submitErrorMessageIsVisible = false ;
    }
    function checkPasswordValidity(){
        passwordIsGood = password.match(regExpPassword)||password==''
        hideSubmitErrorMessage();
    }

</script>

<Titrepage content="Changer de mot de passe"/>

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
    <label for='password'>
        Mot de passe :
    </label>
    <input name="password" type="password" bind:value={password} on:keyup={checkPasswordValidity} required/>
    <label for='password2'>
        Répétez le mot de passe :
    </label>
    <input name="password2" type="password" bind:value={password2} on:keyup={hideSubmitErrorMessage} required/>
    <div class="actions-container">
        <button type="submit">Modifier le mot de passse</button>
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
    .success{
        font-size: 1.2em;
        color:green;
        text-align: center;
    }
    form{
        display:grid;
        grid-template-columns: 3fr 5fr;
        grid-template-rows: 100px;
        margin : 100px 30% 0 30%;
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