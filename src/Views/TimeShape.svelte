<script lang="ts">
    import * as THREE from "three"
    import CentreStage from "./CentreStage.svelte"
    import Space from "../Stuff/TimeShape/Space"
    import TimeEvent from "../Stuff/TimeShape/Event";
    import type { SpaceProperties } from "../Stuff/TimeShape/Space"
    import type { EventSource } from "../Stuff/TimeShape/Event"

    const eventSources: Array<EventSource> = []
    const events = eventSources.map(source => new TimeEvent(source))
    const spaceParameterConstructed: SpaceProperties = {
        events: events,
        axis: new THREE.Vector3(0, 0, 0),
    }

    const space = new Space(spaceParameterConstructed)
</script>

<CentreStage objects={space.eventShapes} />

<style>
</style>
