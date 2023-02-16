<!--suppress JSUnresolvedVariable -->
<script lang="ts">
    import { onMount } from "svelte"

    let timeCounter: NodeJS.Timeout = null
    $: triggerText = timeCounter ? "Stop" : "Continue"
    const target = "https://c.rcex.live:8"
    onMount(() => {
        // @ts-ignore
        if (isProduction) {
            timeCounter = setTimeout(() => {
                window.location.replace(target)
            }, 5000)
        }
    })

    function triggerHandler() {
        if (!timeCounter) {
            window.location.replace(target)
            return
        }
        clearTimeout(timeCounter)
        timeCounter = null
    }
</script>

<title>Coils</title>
<main>
    <section class="BottomRight">
        <h1>
            We're{isProduction ? "" : " (not)"} heading to the good old website for
            now...
        </h1>
        <button
            class="Trigger"
            on:click={() => {
                window.open("https://github.com/StevenRCE0/Overture", "_blank")
            }}
        >
            This Repo
        </button>
        <button class="Trigger" on:click={triggerHandler}>
            {triggerText}
        </button>
    </section>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        margin: 0;
        transition: 1s background-color;
        background-color: #fff;
        text-align: right;
        outline: 10pt solid hsl(215, 95%, 27%);
        outline-offset: -10pt;
    }

    @media screen and (prefers-color-scheme: dark) {
        main {
            background-color: hsl(167, 4%, 54%);
        }
    }

    .BottomRight {
        position: absolute;
        right: 1.5em;
        bottom: 1.6em;
    }

    h1 {
        margin: 0.2em;
        font-size: 2em;
        text-transform: capitalize;
    }

    .Trigger {
        z-index: 9;
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
