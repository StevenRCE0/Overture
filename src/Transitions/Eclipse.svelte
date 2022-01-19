<script>
    import {onMount} from "svelte";
    import {fade} from "svelte/transition"
    import {expoOut} from "svelte/easing"
    import {Canvas, Layer, t} from "svelte-canvas"

    let canvasFrame = {width: undefined, height: undefined}
    let randProp = {x: Math.random(), y: Math.random()}
    let trigger = false
    let eclipseActualSize = {x: 0, y: 0}
    let wormholeOffset = {x: 0, y:0}
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

    $: render = ({ context, width, height }) => {
        context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
        const actualOffset = {
            x: randProp.x * width * 0.4 + width * 0.2,
            y: randProp.y * height * 0.8 + height * 0.1
        }
        let portions = 40
        for (let index = 0; index < portions; index++) {
            const endPoint = {
                x: actualOffset.x + eclipseActualSize.x / 2 * Math.cos(Math.PI * index / portions * 2),
                y: actualOffset.y + eclipseActualSize.y / 2 * Math.sin(Math.PI * index / portions * 2)
            }
            context.strokeStyle = "rgba(0, 0, 0, 1)"
            context.beginPath();
            context.moveTo(actualOffset.x, actualOffset.y + wormholeOffset.y)
            context.lineTo(endPoint.x, endPoint.y)
            context.closePath()
            context.lineWidth = 2
            context.stroke()
        }
    };

    onMount(() => {
        trigger = true
    })
</script>
{#if trigger}
    <main style={styleVariable}>
        <div id="Moss" class="Stage" in:fade={{duration: 700}}></div>
        <div
                id="Sky"
                class="Stage"
                bind:clientWidth={canvasFrame.width}
                bind:clientHeight={canvasFrame.height}
                in:skyIn={{duration: 3000}}
        >
            <div id="Sol" class="Planetarium"></div>
            <div id="Aura" class="Planetarium"></div>
            <div id="Pup" class="Planetarium" in:eclipseIn={{duration: 10000, easing: expoOut}} bind:clientWidth={eclipseActualSize.x} bind:clientHeight={eclipseActualSize.y}></div>
        </div>
        <div class="Stage">
            <Canvas width={canvasFrame.width} height={canvasFrame.height}>
<!--                <Layer {render} />-->
            </Canvas>
        </div>

    </main>

{/if}

<style>
    .Stage {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
    #Moss {
        background-color: #fff;
    }

    #Sky {
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
    .Planetarium {
        transition: 0.6s linear;
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

    @media screen and (prefers-color-scheme: dark) {
        #Moss {
            background-color: hsl(167, 4%, 54%);;
        }
    }
</style>
