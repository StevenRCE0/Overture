<script>
    import Overture from "./Overture.svelte";
</script>

<main>
    <Overture/>
</main>

<style>
    main {
        text-align: center;
        max-width: 240px;
        min-width: 768px;
        margin: 0;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
