<script lang="ts">
    import { Router } from "svelte-router-spa"
    import { routes, testRoutes } from "./routes"

    // @ts-ignore
    const finalRoutes = isProduction ? routes : routes.concat(testRoutes)
</script>

<main>
    <Router routes={finalRoutes} />
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
