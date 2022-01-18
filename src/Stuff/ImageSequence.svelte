<script>
    export let imageArray = []
    export let timing = 100
    export let delay = 0

    import {onDestroy, onMount} from "svelte"
    let playingIndex = 0
    let unmountInterval = false
    onMount(() => {
        setTimeout(() => {
            unmountInterval = setInterval(() => {
                console.log("playingIndex")
                if (playingIndex >= imageArray.length - 1) {
                    clearInterval(unmountInterval)
                    console.log("done")
                    return
                }
                playingIndex += 1
            }, timing)
        }, delay)
    })
    onDestroy(() => {
        unmountInterval || clearInterval(unmountInterval)
    })
</script>
<svelte:component this={imageArray[playingIndex]} />
