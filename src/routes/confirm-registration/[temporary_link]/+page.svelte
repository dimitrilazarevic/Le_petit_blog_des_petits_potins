<script>
    export let data;
    import Navbutton from '$lib/components/Navbutton.svelte';

</script>


<div>
    <h1>{data.message}</h1>
    <Navbutton path='/' content="Retour à l'accueil"/>
</div>
    
<style>
    div{
        width: 100%;
        display: grid;
        justify-items: center;
        text-align: center;
        margin-top : 200px;
    }
</style>