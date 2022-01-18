<script>
    import Overture from "./Overture.svelte";
    import {scale} from "svelte/transition";

</script>

<main>
    <Overture/>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        min-width: 768px;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
