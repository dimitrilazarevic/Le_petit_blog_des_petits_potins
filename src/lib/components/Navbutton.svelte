<script>
    export let path;
    export let content;  
</script>

<a href = {path}>
    <div>{content}</div>
</a>

<style>
    div{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 50px;
        background-color: aquamarine;
        border-radius: 25px;
        transition: all 150ms;
    }
    div:hover{
        opacity: 0.8;
        transform: scale(0.95);
    }
    a{
        text-decoration: none;
        color : black;
        font-size: 1.3em;
    }
</style>

    