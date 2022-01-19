<script>
    export let imageArray = []
    export let timing = 100
    export let delay = 0
    export let looping = false
    export let options = {}

    import {onDestroy, onMount} from "svelte"
    let playingIndex = 0
    let unmountInterval = false
    onMount(() => {
        setTimeout(() => {
            unmountInterval = setInterval(() => {
                if (playingIndex >= imageArray.length - 1) {
                    if (looping) {
                        playingIndex = 0
                    } else {
                        clearInterval(unmountInterval)
                    }
                } else {
                    playingIndex += 1
                }
            }, timing)
        }, delay)
    })
    onDestroy(() => {
        unmountInterval || clearInterval(unmountInterval)
    })
</script>
<svelte:component this={imageArray[playingIndex]} {options} />
<style>
    svg {
        width: 100%;
        height: 100%;
    }
</style>
