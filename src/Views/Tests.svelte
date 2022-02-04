<script lang="ts">
import { onMount } from "svelte";

    import { wrapText } from "../workers/textProcess"
    const text = "Hello this       \nWorld"
    onMount(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        const ctx = canvas.getContext("2d")!
        ctx.font = "48px serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        wrapText(ctx, text, canvas.width / 2, canvas.height / 2, canvas.width, 48)
    })
</script>

<h1>
    <canvas id="canvas" />
</h1>
