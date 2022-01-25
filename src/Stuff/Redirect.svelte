<script lang="ts">
    import { onMount } from "svelte"
    let timeCounter: NodeJS.Timeout = null
    let triggerText = "Stop"
    onMount(() => {
        timeCounter = setTimeout(() => {
            window.location.replace("https://c.rcex.live:8")
        }, 5000)
    })
    function triggerHandler() {
        if (!timeCounter) {
            window.location.replace("https://c.rcex.live:8")
            return
        }
        clearTimeout(timeCounter)
        timeCounter = null
        triggerText = 'Continue'
    }
</script>

<main>
    <h1>We're heading to the good old website for now...</h1>
    <button id="Trigger" on:click={() => triggerHandler()}>{triggerText}</button>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        margin: 0;
        transition: 1s background-color;
        background-color: #fff;
        text-align: right;
    }
    @media screen and (prefers-color-scheme: dark) {
        main {
            background-color: hsl(167, 4%, 54%);
        }
    }
    h1 {
        display: block;
        position: absolute;
        right: 1em;
        bottom: calc(10pt + 25pt + 1.5em);
        text-transform: capitalize;
    }
    #Trigger {
        z-index: 9;
        position: absolute;
        right: 1em;
        bottom: 10pt;
        background: none;
        border: none;
        color: #555;
        mix-blend-mode: difference;
        text-decoration: underline;
        font-size: 25pt;
        font-family: "Avenir Next", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",
            sans-serif;
    }
</style>
