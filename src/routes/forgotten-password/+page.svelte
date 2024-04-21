<script>

    import Titrepage from "$lib/components/Titrepage.svelte";

    export let form;
    export let data ;

    let email = '';

    let successMessage = null;

    if (form!=null){
        switch(form.status){
            case 422:
                email = form.email;
                break ;
            case 200:
                successMessage = form.message ;
        }
    }

</script>

<Titrepage content="Mot de passe oublié"/>

<div class="error-container">
    {#if form?.error}
        <p class="error">Erreur : {form.error}</p>
    {:else if successMessage != null}
        <p class="success">{successMessage}</p>
    {/if}
</div>

<form id="login-register-form" method="POST" action="?/submit">
    <label for="email">
        Adresse email :
    </label>
    <input name="email" type="email" bind:value={email} autofocus/>
    <div class="actions-container">
        <button type="submit">Confirmer</button>
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
        grid-template-columns: 2fr 5fr;
        grid-template-rows: repeat(2,100px);
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
        width: 90%;
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