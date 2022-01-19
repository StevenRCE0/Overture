<script>
    import {onMount} from "svelte";
    import {fade} from "svelte/transition"
    import {expoOut} from "svelte/easing"

    let canvasFrame = {width: undefined, height: undefined}
    let randProp = {x: Math.random(), y: Math.random()}
    let trigger = false
    $: actualOffset = {
        x: randProp.x * canvasFrame.width * 0.4 + canvasFrame.width * 0.2,
        y: randProp.y * canvasFrame.height * 0.8 + canvasFrame.height * 0.1
    }
    $: styleVariable = `
        --anchorX: ${actualOffset.x}px;
        --anchorY: ${actualOffset.y}px;
        --frameWidth: ${canvasFrame.width}px;
        --frameHeight: ${canvasFrame.height}px;
        `

    function eclipseIn(node, params) {
        console.log('go')
        const actualOffset = {
            x: randProp.x * canvasFrame.width * 0.4 + canvasFrame.width * 0.2,
            y: randProp.y * canvasFrame.height * 0.8 + canvasFrame.height * 0.1
        }
        return {
            ...params,
            css: time => {
                return `
                    transform: translate(calc(-50% + ${time * actualOffset.x}px), calc(-50% + ${(1 - time) * canvasFrame.height / 9 + actualOffset.y}px));
                    opacity: ${time};
                    `
            }
        }
    }

    function skyIn(node, params) {
        console.log(2)
        return {
            ...params,
            css: time => {
                return `
                    opacity: ${time};
                    background: hsl(10, 60%, ${(1 - time) * 60}%);
                    `
            }
        }
    }

    onMount(() => {
        trigger = true
    })
</script>
{#if trigger}
    <main style={styleVariable}>
        <div id="Moss" in:fade={{duration: 700}}></div>
        <div
                id="Sky"
                bind:clientWidth={canvasFrame.width}
                bind:clientHeight={canvasFrame.height}
                in:skyIn={{duration: 3000}}
        >
            <div id="Sol"></div>
            <div id="Aura"></div>
            <div id="Pup" in:eclipseIn={{duration: 10000, easing: expoOut}}></div>
        </div>
    </main>

{/if}

<style>
    #Moss {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #fff;
    }
    #Sky {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: hsl(10, 60%, 0%);
        z-index: 8;
    }
    #Sol {
        position: fixed;
        transform: translate(calc(-50% + var(--anchorX)), calc(-50% + var(--anchorY)));
        width: 40vmin;
        height: 40vmin;
        background: #f4f4f4;
        border-radius: 50%;
    }

    #Pup {
        position: fixed;
        transform: translate(calc(-50% + var(--anchorX)), calc(-50% + var(--anchorY)));
        width: 38vmin;
        height: 38vmin;
        background: #000;
        border-radius: 50%;
    }
    #Aura {
        position: fixed;
        top: var(--anchorY);
        left: var(--anchorX);
        transform: translate(-50%, -50%);
    }
    #Aura::after {
        content: '';
        position: absolute;
        left: -14vmin;
        top: -14vmin;
        transform: skew(5deg, 30deg) scale(0.5);
        filter: blur(6pt);
        width: 28vmin;
        height: 28vmin;
        background: #f4f4f4;
        border-radius: 50%;
        animation: AuraIntro 15s forwards;
        animation-delay: 3s;
    }
    @keyframes AuraIntro {
        0% {
            transform: skew(5deg, 30deg) scale(0.5);
        }
        5% {
            transform: rotate(120deg) skew(15deg, 2deg)  scale(1.3);
        }
        12% {
            transform: rotate(120deg) skew(15deg, 10deg)  scale(1.2);
        }
        30% {
            transform: rotate(170deg) skew(15deg, 5deg) scale(1.1);
        }
        50% {
            transform: rotate(-180deg) skew(5deg, 20deg) scale(1.2);
        }
        70% {
            transform: skew(30deg, 0deg) scale(1.1);
        }
    }
</style>
