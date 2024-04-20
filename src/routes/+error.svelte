<script>
	import { page } from '$app/stores';
    import Navbutton from '$lib/components/Navbutton.svelte';

</script>

<div>
<h1>{$page.error.message} !</h1>
<h2>Page status : {$page.status}</h2>
<Navbutton path='/' content="Retour à l'accueil"/>
</div>

<style>
    div{
        display: grid;
        justify-items: center;
        text-align: center;
        margin : 200px;
    }
</style>