<script lang="ts">
    import { Router } from "svelte-router-spa"
    import { routes } from "./routes"

    export let name
</script>

<title>
    {name}
</title>
<main>
    <Router {routes} />
</main>

<style>
    main {
        text-align: center;
        max-width: 240px;
        /* min-width: 768px; */
        margin: 0;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
