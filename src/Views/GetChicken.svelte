<script lang="ts">
    import type { ChickenCard } from "../Stuff/Chicken/chicken"
    import Canvg from "canvg"
    import { wrapText } from "../workers/textProcess"
    import { Canvas, Layer } from "svelte-canvas"

    const chickenLocation = "./assets/chasingChicken.svg"
    const skillSVGLocation = "./assets/skill.svg"
    const wishSVGLocation = "./assets/wish.svg"
    let mainCanvas: Canvas

    const printSVG = async (
        SVGLocation: string,
        context: CanvasRenderingContext2D,
        offsetX: number,
        offsetY: number,
        maxWidth: number,
        maxHeight: number
    ) => {
        const renderContainer = document.createElement("canvas")
        const renderContext = renderContainer.getContext("2d")
        const instance = await Canvg.from(renderContext, SVGLocation)
        instance.resize(
            maxWidth * devicePixelRatio,
            maxHeight * devicePixelRatio,
            true
        )
        instance.render()
        const ratio =
            instance.screen.viewPort.width / instance.screen.viewPort.height
        let size = {
            width: instance.screen.viewPort.width,
            height: instance.screen.viewPort.height,
        }
        if (ratio > 1) {
            size.width = maxWidth
            size.height = maxWidth / ratio
        } else {
            size.width = maxHeight * ratio
            size.height = maxHeight
        }
        context.drawImage(
            renderContext.canvas,
            offsetX,
            offsetY,
            size.width,
            size.height
        )
    }

    $: chicken = {
        name: "Chasing Chicken",
        slogan: "",
        wishes: ["To be a chicken", "To be a chicken", "To be a chicken"],
        skills: ["To be a chicken", "To be a chicken", "To be a chicken"],
        tel: "",
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
        printSVG(chickenLocation, context, 25, 320, 250, 250)
        printSVG(wishSVGLocation, context, 10, 80, 100, 100)
        printSVG(skillSVGLocation, context, 10, 180, 100, 100)
    }

    const downloadChicken = async () => {
        await mainCanvas.getCanvas().toBlob((blob) => {
            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = pngUrl
            link.download = `${chicken.name}的名片.png`
            link.dataset.downloadurl = [
                "image/png",
                link.download,
                link.href,
            ].join(":")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }, "image/png")
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
    <button class="WeirdoButton" on:click={() => downloadChicken()}>下载</button
    >
</main>

<style scoped>
    #preview {
        margin: 5px auto 0 auto;
        border: 1px solid #000;
        width: min-content;
    }
    #propTable {
        margin: 5px auto 0 auto;
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
    .WeirdoButton {
        text-decoration: underline;
        color: #333;
        font-size: 27pt;
        font-family: "Wawati SC";
    }
</style>
