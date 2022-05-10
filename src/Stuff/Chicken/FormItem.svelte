<script lang="ts">
    export let legend: string
</script>
<div class="Wrapper">
    <div class="Legend">{legend}</div>
    <slot />
</div>
<style>
    .Wrapper {
        display: flex;
        flex-direction: column;
    }
</style>
