<script>
    export let data;
    import { invalidateAll} from '$app/navigation';
    import Titrepage from '$lib/components/Titrepage.svelte';
    import Affichagedate from './Affichagedate.svelte';
    import Searchform from './Searchform.svelte';

    let searchData = {};
    let reloadSearch = {};

    let username = data.user.username;
    async function deletePost(id){
        await fetch('/api/delete-post/'+id,{method:'DELETE'})
        .then(()=>invalidateAll())
        .then(()=>reloadSearch = {})
    }
</script>

<Titrepage content="Le petit blog des petits potins"/>
{#if username!=undefined}<h3 class="welcome-message">Bienvenue, {username} !</h3>{/if}

{#key reloadSearch}
    <Searchform allPosts={data.posts} bind:searchData/>
{/key}

<ul class="post-container">
    {#each data.posts as post}
        {#if (post.matchesSearch||searchData.pageIsNew)}
            <li class="post">
                <h2 class="post-title">{post.title}</h2>
                <p class="post-info">Publié par {post.author}<br/>
                Le <Affichagedate date={post.dateCreation}/></p>
                <p class="post-content">{post.body}</p>
            </li>
            {#if data.user.userStatus == 'admin'}
                <div class="delete-container" on:click={deletePost(post._id)}><img src="/images/cross.svg" alt="delete"/></div>
            {/if}
        {/if}
    {/each}
</ul>

<style>
    .welcome-message{
        text-align: center;
    }
    .post-container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    .post {
        width: 50%;
        display: grid;
        grid-template-areas:
        'tit inf' 
        'con con';
        grid-template-columns: 3fr 2fr;
        list-style-type: none;
        padding: 20px;
        margin: 10px;
        border: 2px solid black;
        border-radius: 10px;
        transition: transform 150ms;
    }
    .post:hover{
        transform: scale(1.01);
    }
    .post-title{
        grid-area: tit;
    }
    .post-info{
        grid-area: inf;
    }
    .post-content{
        grid-area: con;
    }
    .delete-container{
        width :50px;
        margin-left: 30px;
        opacity: 0.2;
        transition : opacity 150ms ;
    }
    .delete-container:hover{
        cursor:pointer;
        opacity : 1;
    }
    img{
        width:100%;
    }
</style>
