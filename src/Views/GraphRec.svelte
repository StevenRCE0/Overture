<script lang="ts">
	import { Canvas, Layer, t } from 'svelte-canvas';
    $: scroller = 0
    $: render = ({ context, width, height }) => {
        context.beginPath()
        context.arc()
    }
</script>

<div id="Hero" class="Centered">Graph Recorder</div>
<div id="Tracks">
    <Canvas>
        <!--suppress JSUnresolvedVariable -->
        <Layer {render}/>
    </Canvas>
</div>


<style>
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
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
            'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
    #Tracks {
        border-radius: 50%;
    }
</style>
