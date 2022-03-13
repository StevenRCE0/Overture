<script lang="ts">
    import { onMount } from "svelte"

    import Play from "../mob/miku/Play.svelte"
    import Previous from "../mob/miku/Previous.svelte"
    import Next from "../mob/miku/Next.svelte"

    import "../mob/miku/buttonStyles.css"

    import Senbonzakura from "../mob/miku/Senbonzakura.svelte"

    const trackIndex: Array<typeof Senbonzakura> = [Senbonzakura]

    let playerAppDOM: HTMLElement
    let trackPlaying = 0
    let themeColour: string

    onMount(() => {
        console.log(themeColour)
        playerAppDOM.style.backgroundColor = themeColour
    })
</script>

<body bind:this={playerAppDOM}>
    <div class="player">
        <div class="dynamicWrapper">
            <svelte:component
                this={trackIndex[trackPlaying]}
                bind:themeColour
            />
        </div>
        <div id="controllersWrapper">
            <Previous />
            <Play />
            <Next />
        </div>
    </div>
</body>

<style scoped=false>
    body {
        height: 100vh;
    }
    #controllersWrapper {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 100%;
    }
</style>
