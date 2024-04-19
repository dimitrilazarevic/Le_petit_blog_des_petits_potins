<script>
	import { page } from '$app/stores';
</script>

<div>
<h1>{$page.error.message}</h1>
<h2>Page status : {$page.status}</h2>
</div>

<style>
    div{
        display: grid;
        justify-content: center;
    }
</style>