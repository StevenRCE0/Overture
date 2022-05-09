<script lang="ts">
    import Canvg from "canvg"
    import { wrapText } from "../workers/textProcess"
    import { Canvas, Layer } from "svelte-canvas"

    interface ChickenCard {
        name: string
        wishes: string[]
        skills: string[]
    }

    const chickenLocation = "./assets/chasingChicken.svg"
    const skillSVGLocation = "./assets/skill.svg"
    const wishSVGLocation = "./assets/wish.svg"
    let mainCanvas: Canvas

    const printSVG = async (
        SVGLocation: string,
        context: CanvasRenderingContext2D,
        offsetX: number,
        offsetY: number,
        maxWidth?: number,
        maxHeight?: number
    ) => {
        const renderContainer = document.createElement("canvas")
        const renderContext = renderContainer.getContext("2d")
        const instance = await Canvg.from(renderContext, SVGLocation)
        instance.resize(maxWidth, maxHeight, true)
        instance.render()
        context.drawImage(renderContext.canvas, offsetX, offsetY)
    }

    $: chicken = {
        name: "Chasing Chicken",
        wishes: ["To be a chicken", "To be a chicken", "To be a chicken"],
        skills: ["To be a chicken", "To be a chicken", "To be a chicken"],
    } as ChickenCard

    $: render = ({ context, width, height }) => {
        context.fillStyle = "#fff"
        context.fillRect(0, 0, width, height)
        context.fillStyle = "black"
        context.font = "bold 32px 'Wawati SC'"
        wrapText(context, chicken.name, 10, 40, 300, 32)
        context.font = "normal 21px 'Wawati SC'"
        wrapText(context, chicken.wishes[0], 120, 120, 160, 21)
        wrapText(context, chicken.skills[0], 120, 210, 160, 21)
        printSVG(chickenLocation, context, 0, 400)
        printSVG(wishSVGLocation, context, 10, 80, 100, 100)
        printSVG(skillSVGLocation, context, 10, 180, 100, 100)
    }
</script>

<main>
    <div id="preview">
        <Canvas width={320} height={568} bind:this={mainCanvas}>
            <Layer {render} />
        </Canvas>
    </div>
    <table id="propTable">
        <tr>
            <td>名字</td>
            <td>
                <input type="text" bind:value={chicken.name} />
            </td>
        </tr>
        <tr>
            <td>愿望</td>
            <td>
                <input type="text" bind:value={chicken.wishes[0]} />
            </td>
        </tr>
        <tr>
            <td>技能</td>
            <td>
                <input type="text" bind:value={chicken.skills[0]} />
            </td>
        </tr>
    </table>
</main>

<style scoped>
    #preview {
        margin-left: 50%;
        margin-top: 2rem;
        transform: translateX(-50%);
        border: 1px solid #000;
        width: min-content;
    }
    #propTable {
        margin-left: 50%;
        margin-top: 2rem;
        transform: translateX(-50%);
    }
    #propTable td {
        vertical-align: middle;
    }
    #propTable > tr > td:nth-child(2) {
        max-width: 20em;
        padding-left: 5px;
    }
    #propTable input {
        height: 100%;
        margin: 0;
    }
</style>
