<script lang="ts">

    let box: HTMLElement
    $: scroller = 1

    function handleMainScroll() {
        scroller = 1 - (box.scrollTop / box.scrollHeight)
        console.log(box.scrollTop)
    }
</script>

<main bind:this={box} on:scroll={handleMainScroll}>
    <div id="Tracks" class="Centered" style={`--scroll-factor: ${scroller}; `}>
        <div id="GreenTrack" />
        <div id="BlueTrack" />
    </div>
    <div id="Hero" class="Centered">
        Graph Recorder
    </div>
    <div id='Spacer'></div>
</main>

<style>
    main {
        height: 100vh;
        overflow-y: scroll;
    }
    #Spacer {
        height: 200vh;
    }

    .Centered {
        text-align: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #Hero {
        font-size: xx-large;
        font-weight: bold;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        backdrop-filter: invert() saturate(0%);
        -webkit-backdrop-filter: invert() saturate(0%);
        color: whitesmoke;
        padding: 0.2em 1.4em;
    }

    #Tracks {
        /*border-radius: 50%;*/
        transform-style: flat;
        perspective: 800pt;
        --track-rotation: rotate3d(-0.18, 0.25, 0.01, 26deg) translate(-50%, -50%);
        --green-track-offset: calc(-60pt * var(--scroll-factor));
        --track-height: 160pt;
        --track-width: 160pt;
    }

    #BlueTrack {
        position: absolute;
        left: 0;
        top: 0;
        background: royalblue;
        transform: var(--track-rotation);
        width: var(--track-width);
        height: var(--track-height);
    }

    #GreenTrack {
        left: 0;
        top: 0;
        position: absolute;
        background: cadetblue;
        transform: var(--track-rotation) translateZ(var(--green-track-offset));
        width: var(--track-width);
        height: var(--track-height);
    }
</style>
