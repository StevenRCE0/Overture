<script lang="ts">
    import * as THREE from "three"
    import CentreStage from "./CentreStage.svelte"
    import Space from "../Stuff/TimeShape/Space"
    import TimeEvent from "../Stuff/TimeShape/Event"
    import type { SpaceProperties } from "../Stuff/TimeShape/Space"
    import type { EventSource } from "../Stuff/TimeShape/Event"
    import { onMount } from "svelte"

    var camera: THREE.PerspectiveCamera

    const foobarEvents: EventSource[] = [{
        eventTitle: "",
        timestamp: 0,
        importance: 20,
        urgency: 30,
    }, {
        eventTitle: "",
        timestamp: 70,
        importance: 22,
        urgency: 10,
    }]

    const eventSources: Array<EventSource> = [...foobarEvents]
    const events = eventSources.map((source) => new TimeEvent(source))
    const spaceParameterConstructed: SpaceProperties = {
        events: events,
        axis: new THREE.Vector3(0, 0, 0),
    }

    const space = new Space(spaceParameterConstructed)

    onMount(() => {
        camera.rotateX(-Math.PI / 16)
        camera.rotateY(-Math.PI / 16)
    })
</script>

<CentreStage objects={space.eventShapes} bind:camera />

<style>
</style>
