<script lang="ts">
	import {Router} from 'svelte-router-spa'
    import { finalRoutes } from "./routes"
</script>

<main>
    <Router routes={finalRoutes} />
</main>

<style>
    main {
        text-align: center;
        margin: 0;
    }
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
