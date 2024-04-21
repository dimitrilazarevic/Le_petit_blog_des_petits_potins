<script>
    export let data ;
    console.log(data.userInfo)
    const userInfoTable = [
        {key:'ID',data:data.userInfo._id},
        {key:'Username',data:data.userInfo.username},
        {key:'User Status',data:data.userInfo.status}
    ];
</script>

<div>
    <section>
        <h1>Informations sur le compte :</h1>
        <ul>
            {#each userInfoTable as userInfo}
                <li>{userInfo.key} : {userInfo.data}</li>
            {/each}
        </ul>
    </section>
    <form action="?/logout" method="POST">
    <button type="submit">Log Out</button>
    </form>
</div>

<style>
    div{
        margin-top : 100px;
        width: 100%;
        display : flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    section{
        display: flex;
        flex-wrap: wrap;
        width:100%;
        justify-content: center;
        margin:30px;
    }
    h1{
        text-align: center;
        width: 100%;
    }
    button{
        padding : 50px 100px;
        font-size: 2em;
        font-family : Quicksand;
        cursor : pointer;
        background-color: rebeccapurple;
        color:whitesmoke;
        transition : background-color 150ms;
    }
    button:hover{
        background-color: red;
    }
</style>