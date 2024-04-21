<script>
    export let data;
    import { invalidate } from '$app/navigation';
    import Titrepage from '$lib/components/Titrepage.svelte';
    import Affichagedate from './Affichagedate.svelte';
    import Searchform from './Searchform.svelte';
    import {API_URL} from '$lib/config'

    let searchData = {};
    let reloadSearch = {};
    let posts = data.posts ;

    async function deletePost(id){
        if(data.userInfo.status=='admin'){
            let deletedPost = await fetch(API_URL+'/delete-post/'+id,{method:'DELETE'})
            .then((res)=>res.json())

            let index = posts.findIndex((val)=>val._id==deletedPost._id);
            let posts1 = posts.slice(0,index)
            let posts2 = posts.slice(index+1,posts.length)
            posts = posts1.concat(posts2);

            reloadSearch = {};
        }
    }

</script>

<Titrepage content="Le petit blog des petits potins"/>

{#if data.userInfo.status != 'logged out'}
    <h3 class="welcome-message">
        Bienvenue, {data.userInfo.username} !
    </h3>
{/if}

{#key reloadSearch}
    <Searchform allPosts={posts} bind:searchData/>
{/key}

<ul class="post-container">

    {#each posts as post}

        {#if (post.matchesSearch||searchData.pageIsNew)}

            <li class="post">

                <h2 class="post-title">{post.title}</h2>
                <p class="post-info">Publié par {post.author}<br/>
                Le <Affichagedate date={post.dateCreation}/></p>
                <p class="post-content">{post.body}</p>

            </li>

            {#if data.userInfo.status == 'admin'}

                <div class="delete-container" on:click={deletePost(post._id)}>
                    <img src="/images/cross.svg" alt="delete"/>
                </div>

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
        border: 1px solid black;
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
