<script lang="ts">
    import * as THREE from "three"
    import CentreStage from "./CentreStage.svelte"
    import Space from "../Stuff/TimeShape/Space"
    import TimeEvent from "../Stuff/TimeShape/Event"
    import type { SpaceProperties } from "../Stuff/TimeShape/Space"
    import type { EventSource } from "../Stuff/TimeShape/Event"
    import { onMount } from "svelte"

    var camera: THREE.PerspectiveCamera
    const cameraMountpoints = {
        perspective: {
            position: new THREE.Vector3(-100, 25, 75),
            rotation: new THREE.Euler(-Math.PI / 8, -Math.PI / 3, 0),
        },
    }
    function applyCameraMount(
        mountpoint: typeof cameraMountpoints.perspective,
        camera: THREE.PerspectiveCamera
    ) {
        camera.rotation.copy(mountpoint.rotation)
        camera.position.copy(mountpoint.position)
    }

    const foobarEvents: EventSource[] = [
        {
            eventTitle: "",
            timestamp: 0,
            importance: 20,
            urgency: 30,
        },
        {
            eventTitle: "",
            timestamp: 40,
            importance: 22,
            urgency: 10,
        },
    ]

    const eventSources: Array<EventSource> = [...foobarEvents]
    const events = eventSources.map((source) => new TimeEvent(source))
    const spaceParameterConstructed: SpaceProperties = {
        events: events,
        axis: new THREE.Vector3(0, 0, 0),
    }

    const space = new Space(spaceParameterConstructed)

    onMount(() => {
        applyCameraMount(cameraMountpoints.perspective, camera)
    })
</script>

<CentreStage objects={space.eventShapes} bind:camera />

<style>
</style>
