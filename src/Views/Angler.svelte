<script lang="ts">

</script>

<div class="Container">
    <div class="UpperSignal">
        0
    </div>
    <div class="LowerSignal">
        1
    </div>
</div>

<style>
    .Container {
        --glare-color: linear-gradient(180deg, hsla(132, 15%, 98%, 3%) 0%, hsla(192, 13%, 5%, 2%) 100%);
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        --upper-signal-color: azure;
        --lower-signal-color: pink;
    }
    .UpperSignal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100pt;
        background: var(--upper-signal-color) var(--glare-color);
        z-index: 100;
    }
    .LowerSignal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 100pt;
        background: var(--lower-signal-color) var(--glare-color);
        z-index: 100;
    }
</style>