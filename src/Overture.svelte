<script>
    import {onDestroy, onMount} from "svelte";
    import ImageSequence from "./Stuff/ImageSequence.svelte";
    import {Packed} from "./mob/in/Pack.svelte"
    import Eclipse from "./Transitions/Eclipse.svelte";

    let eclipse = false
    let initialized = false
    let introSize
    let night = window.matchMedia("(prefers-color-scheme: dark)").matches
    const changeAppearance = () => {
        night = window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeAppearance)

    function stroke(node, params) {
        return {
            ...params,
            css: time => {
                return `
                    opacity: ${time === 0 ? 0 : 1};
                    stroke-dasharray: ${params.sequence[params.index].factor * params.size};
                    stroke-dashoffset: ${-time * params.sequence[params.index].factor * params.size};
                    `
            }
        }
    }

    let animatePathSequence0 = [
        {duration: 1000, factor: 0.2},
        {duration: 1000, factor: 0.2}
    ]
    animatePathSequence0 = animatePathSequence0.map(entry => {
        return {...entry, ready: false}
    })
    onMount(() => {
        animatePathSequence0 = animatePathSequence0.map((entry, index) => {
            if (index === 0) return {...entry, ready: true}
            setTimeout(() => {
                animatePathSequence0[index].ready = true
            }, animatePathSequence0.slice(0, index).reduce((p, n) => {
                return p + n.duration
            }, 0))
            return entry
        })
        setTimeout(() => {
            initialized = true
        }, animatePathSequence0.reduce((p, n) => {
            return p + n.duration
        }, 0))
    });
    onDestroy(() => {
        window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeAppearance)
    })
</script>

<title>Overture</title>
<main>
    <div class="Heading">
        {#if initialized}
            <ImageSequence imageArray={Packed} timing="450" options={{pupil: night ? 22 : 8}}/>
        {:else}
            <div style="width: 100%; height: 100%; " bind:clientWidth={introSize}>
                <svg id="intro" viewBox="0 0 2388 1668" version="1.1" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
                     style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;width: 100%;height: 100%;">
                    <g id="Artboard11" serif:id="Artboard1">
                        {#if animatePathSequence0[0].ready}
                            <g transform="matrix(1,0,0,1,169.698,-51.2538)">
                                <path d="M620.061,1076.44C614.357,1073.5 598.783,1054.42 612.576,1047.52C622.913,1042.36 637.723,1053.82 645.748,1049.81C663.109,1041.13 697.873,1024.16 715.522,1041.81"
                                      style="fill:none;stroke:black;stroke-width:8px;"
                                      in:stroke={{sequence: animatePathSequence0, index: 0, size: introSize}}/>
                            </g>
                        {/if}
                        {#if animatePathSequence0[1].ready}
                            <g transform="matrix(1,0,0,1,169.698,-51.2538)">
                                <path d="M1303.27,1032.07C1309.01,1028.11 1317.12,1019.67 1325.19,1022.36C1333.78,1025.22 1326.12,1035.87 1329.76,1039.52C1334.39,1044.14 1386.95,1017.78 1386.95,1062.39"
                                      style="fill:none;stroke:black;stroke-width:8px;"
                                      in:stroke={{sequence: animatePathSequence0, index: 1, size: introSize}}/>
                            </g>
                        {/if}
                    </g>
                </svg>
            </div>
        {/if}
    </div>
    {#if eclipse }
        <Eclipse/>
    {/if}
    <button id="Trigger" on:click={() => {eclipse = !eclipse}}>
        Eclipse
    </button>
</main>

<style>
    main {
        margin: 0;
        transition: 1s background-color;
        background-color: #fff;
    }

    @media screen and (prefers-color-scheme: dark) {
        main {
            background-color: hsl(167, 4%, 54%);
        }
    }

    .Heading {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    #Trigger {
        z-index: 9;
        position: absolute;
        left: 50%;
        bottom: 10pt;
        transform: translateX(-50%);
        background: none;
        border: none;
        color: #555;
        mix-blend-mode: difference;
        text-decoration: underline;
        font-size: 25pt;
        font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }
</style>
