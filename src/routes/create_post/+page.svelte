<script>
    export let data ;
    import Titrepage from "$lib/components/Titrepage.svelte";
 
</script>

<Titrepage content="Ma dernière aventure..."/>

<form id="create-post-form" method="POST" action="?/submit">
    <label for="title">
        Titre de votre aventure : 
    </label>
    <input name="title"/>
    <label for='body'>
        Racontez nous ! 
    </label>
    <textarea name="body"/>
    <input type="hidden" name="author" value={data.user.username}>
    <button type="submit">Publier</button>
</form>

<style>
    :root{
    --form-element-margin : 20px;
    }
    form{
        display:grid;
        grid-template-columns: 2fr 5fr;
        grid-template-rows: 100px 300px 100px;
        margin : 0 20% 0 20%;
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
    textarea{
        margin: var(--form-element-margin);
        font-family:Quicksand;
        font-size: 1em;
    }
    button{
        margin: var(--form-element-margin);
        grid-column-end: span 2;
        width: 20%;
        justify-self: center;
        font-size: 1.4em;
        font-family: Quicksand;
        background-color: plum;
        cursor: pointer;
    }


</style>