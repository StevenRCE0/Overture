<script lang="ts">
    import * as THREE from "three"
    // import { DragControls } from "three/examples/jsm/controls/DragControls"
    import CentreStage from "./CentreStage.svelte"
    import Space from "../Stuff/TimeShape/Space"
    import TimeEvent from "../Stuff/TimeShape/Event"
    import type { SpaceProperties } from "../Stuff/TimeShape/Space"
    import type { EventSource } from "../Stuff/TimeShape/Event"
    import { onMount } from "svelte"

    var camera: THREE.PerspectiveCamera
    const cameraMountPoints = {
        perspective: {
            position: new THREE.Vector3(-100, 25, 75),
            rotation: new THREE.Euler(-Math.PI / 8, -Math.PI / 3, 0),
        },
    }
    function applyCameraMount(
        mountPoint: typeof cameraMountPoints.perspective,
        camera: THREE.PerspectiveCamera
    ) {
        camera.rotation.copy(mountPoint.rotation)
        camera.position.copy(mountPoint.position)
    }


    const foobarEvents: EventSource[] = [
        {
            id: "a",
            eventTitle: "",
            timestamp: 0,
            importance: 20,
            urgency: 30,
            relevance: 0.5
        },
        {
            id: "a",
            eventTitle: "",
            timestamp: 40,
            importance: 22,
            urgency: 10,
            relevance: 0.7
        },
        {
            id: "a",
            eventTitle: "",
            timestamp: 70,
            importance: 20,
            urgency: 30,
            relevance: 0.5
        },
        {
            id: "a",
            eventTitle: "",
            timestamp: 140,
            importance: 22,
            urgency: 10,
            relevance: 0.7
        },
        {
            id: "a",
            eventTitle: "",
            timestamp: 150,
            importance: 20,
            urgency: 30,
            relevance: 0.5
        },
        {
            id: "a",
            eventTitle: "",
            timestamp: 180,
            importance: 22,
            urgency: 10,
            relevance: 0.7
        },
    ]

    const eventSources: Array<EventSource> = [...foobarEvents]
    const events = eventSources.map((source) => new TimeEvent(source))
    const spaceParameterConstructed: SpaceProperties = {
        events: events,
        axis: new THREE.Vector3(0, 0, 0),
    }

    // make the perspective camera draggable
    // const dragControls = new DragControls(
    //     [camera],
    //     document.getElementById("canvas")
    // )
    const space = new Space(spaceParameterConstructed)

    onMount(() => {
        applyCameraMount(cameraMountPoints.perspective, camera)
    })
</script>

<CentreStage objects={space.eventShapes} bind:camera />

<style>
</style>
