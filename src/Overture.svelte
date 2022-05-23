<script lang="ts">
    import { navigationList } from "./routePlacements"
    import { onDestroy, onMount } from "svelte"
    import ImageSequence from "./Stuff/ImageSequence.svelte"
    import { Packed } from "./mob/in/Pack.svelte"
    import Eclipse from "./Transitions/Eclipse.svelte"

    let eclipse = false
    let introSize
    let night = window.matchMedia("(prefers-color-scheme: dark)").matches
    const changeAppearance = () => {
        night = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    function stroke(node, params) {
        return {
            ...params,
            css: (time) => {
                return `
                    opacity: ${time === 0 ? 0 : 1};
                    stroke-dasharray: ${
                        params.sequence[params.index].factor * params.size
                    };
                    stroke-dashoffset: ${
                        -time *
                        params.sequence[params.index].factor *
                        params.size
                    };
                    `
            },
        }
    }

    let animatePathSequence0 = [
        { duration: 1000, factor: 0.2, ready: false, done: false },
        { duration: 1000, factor: 0.2, ready: false, done: false },
    ]

    const animateKitten = () => {
        animatePathSequence0 = animatePathSequence0.map((entry, index) => {
            if (index === 0) return { ...entry, ready: true, done: false }
            setTimeout(
                () => {
                    animatePathSequence0[index].ready = true
                    setTimeout(
                        () => {
                            animatePathSequence0[index].done = true
                        },
                        animatePathSequence0.slice(0, index).reduce((p, n) => {
                            return p + n.duration
                        }, 0) + animatePathSequence0[index].duration
                    )
                },
                animatePathSequence0.slice(0, index).reduce((p, n) => {
                    return p + n.duration
                }, 0)
            )
            return entry
        })
        // setTimeout(
        //     animatePathSequence0.reduce((p, n) => {
        //         return p + n.duration
        //     }, 0)
        // )
    }

    onMount(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", changeAppearance)
        animateKitten()
    })
    onDestroy(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .removeEventListener("change", changeAppearance)
    })
</script>

<title>Overture</title>
<main>
    <div class="Heading">
        <div id="AnimationContainer">
            {#if animatePathSequence0[1].done}
                <ImageSequence
                    imageArray={Packed}
                    timing={450}
                    options={{ pupil: night ? 22 : 8 }}
                />
            {:else}
                <div
                    style="width: 100%; height: 100%; "
                    bind:clientWidth={introSize}
                >
                    <svg
                        id="intro"
                        viewBox="0 0 2388 1668"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xml:space="preserve"
                        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;width: 100%;height: 100%;"
                    >
                        <g id="Artboard11">
                            {#if animatePathSequence0[0].ready}
                                <g transform="matrix(1,0,0,1,169.698,-51.2538)">
                                    <path
                                        d="M620.061,1076.44C614.357,1073.5 598.783,1054.42 612.576,1047.52C622.913,1042.36 637.723,1053.82 645.748,1049.81C663.109,1041.13 697.873,1024.16 715.522,1041.81"
                                        style="fill:none;stroke:black;stroke-width:8px;"
                                        in:stroke={{
                                            sequence: animatePathSequence0,
                                            index: 0,
                                            size: introSize,
                                        }}
                                    />
                                </g>
                            {/if}
                            {#if animatePathSequence0[1].ready}
                                <g transform="matrix(1,0,0,1,169.698,-51.2538)">
                                    <path
                                        d="M1303.27,1032.07C1309.01,1028.11 1317.12,1019.67 1325.19,1022.36C1333.78,1025.22 1326.12,1035.87 1329.76,1039.52C1334.39,1044.14 1386.95,1017.78 1386.95,1062.39"
                                        style="fill:none;stroke:black;stroke-width:8px;"
                                        in:stroke={{
                                            sequence: animatePathSequence0,
                                            index: 1,
                                            size: introSize,
                                        }}
                                    />
                                </g>
                            {/if}
                        </g>
                    </svg>
                </div>
            {/if}
        </div>
        <div id="Layer">
            <div id="Pools" style={`opacity: ${eclipse ? 0 : 1}`}>
                {#each navigationList as {type, label, target}}
                    {#if type && type === "major"}
                        <a href={target}>{label}</a>
                    {/if}
                {/each}
            </div>
            <button
                id="Trigger"
                on:click={() => {
                    eclipse = !eclipse
                }}
            >
                Eclipse
            </button>
        </div>
    </div>
    {#if eclipse}
        <Eclipse />
    {/if}
</main>

<style scoped>
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

    #Pools {
        z-index: 8;
        display: flex;
        flex-direction: row;
        padding-block: 0.5em;
        transition: opacity 0.5s;
    }

    #Pools > a {
        margin-inline: 1em;
    }

    .Heading {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    #Layer {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #AnimationContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    #Trigger {
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
        padding-block: 0.5em;
    }

    button {
        margin: 0;
        padding: 0;
    }
</style>
