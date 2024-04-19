<script>
    export let allPosts ;
    export let searchData ;
    searchData.pageIsNew = true ;
    searchData.posts = allPosts ;
    searchData = searchData ;

    import { onMount } from 'svelte';


    let countResults = Object.keys(allPosts).length;

    let searchKeywords ;
    let searchPostNumber ;
    let searchUsername ;


    async function checkKeywords(){
        countResults = 0;
        await allPosts.forEach(post=>
        {
            let regExpKeywords = new RegExp(searchKeywords,"i");
            if(post.title.match(regExpKeywords)||post.body.match(regExpKeywords)||searchKeywords==""){
                post.matchesKeywords = true ;
            }else{
                post.matchesKeywords = false ;
            }
            checkSearch(post);
        });
    }

    async function checkUsername(){
        countResults = 0;
        await allPosts.forEach(post=>
        {
            let regExpUsername = new RegExp(searchUsername,"i");
            if(post.author.match(regExpUsername)||searchUsername==""){
                post.matchesUsername = true;
            }else{
                post.matchesUsername = false;
            }
            checkSearch(post);
        });
    }

    function checkSearch(post){
        if(post.matchesKeywords && post.matchesPostNumber && post.matchesUsername){
            post.matchesSearch = true ;
            countResults ++
        }else{
            post.matchesSearch = false ;
        }
        searchData.pageIsNew = false;
    }

    onMount(async()=>{
            await allPosts.forEach(post=>{
                post.matchesKeywords = post.matchesPostNumber = post.matchesUsername = true ;
            })
        }
    )

</script>

<h2 class="form-title">{countResults} résultats correspondent à ma recherche</h2>
<form id="search-form">
    <label>
        Mots clés : 
        <input bind:value={searchKeywords} on:input={checkKeywords} id="search-keywords"/>
    </label>
    <label>
        Nom de l'auteur :
        <input bind:value={searchUsername} on:input={checkUsername} id="search-user-id"/>
    </label>
</form>

<style>
    .form-title{
        user-select: none;
        text-align: center;
    }
    form{
        display : flex;
        justify-content: space-around;
        margin : 0 20% 0 20%;
    }
    label{
        user-select: none;
    }
    input{
        width: 90%;
        max-width: 90%;
    }
</style>