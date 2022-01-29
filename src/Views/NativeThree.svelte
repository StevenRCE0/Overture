<script lang="ts">
    import * as THREE from "three"
    import { onMount } from "svelte"
    import { watchResize } from "svelte-watch-resize"
    import { t } from "svelte-canvas"

    let anchor: HTMLElement

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const camera = new THREE.PerspectiveCamera()
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("0xedf2f7")

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    class Line {
        line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>
        constructor() {
            const points = []
            points.push(new THREE.Vector3(-10, 0, 0))
            points.push(new THREE.Vector3(0, 10, 0))
            points.push(new THREE.Vector3(10, 0, 0))
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            this.line = new THREE.Line(geometry, material)
        }
        
    }
    

    const cube = new THREE.BoxBufferGeometry(30, 30, 30)
    cube.rotateX(0.15 * Math.PI)
    cube.rotateY(0.1 * Math.PI)
    const cubeMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.1,
        roughness: 0.1,
        color: 0x66ccff,
    })
    const cubeMesh = new THREE.Mesh(cube, cubeMaterial)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.translateOnAxis(new THREE.Vector3(0.2, 2, 3), 10)

    function timeFunction() {
        const x = Math.sin(t)
        const y = Math.cos(t)
        const z = Math.sin(t * 0.5)
        return new THREE.Vector3(x, y, z)
    }

    function handleResize(node: HTMLElement) {
        camera.aspect = anchor.clientWidth / anchor.clientHeight
        renderer.setSize(anchor.clientWidth, anchor.clientHeight)
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
    }

    onMount(() => {
        anchor.appendChild(renderer.domElement)

        camera.fov = 35
        camera.near = 1
        camera.far = 500
        camera.aspect = anchor.clientWidth / anchor.clientHeight
        camera.position.set(0, 0, 100)
        camera.lookAt(0, 0, 0)

        // scene.add(new Line().line)
        scene.add(cubeMesh)
        scene.add(ambientLight)
        scene.add(directionalLight)

        renderer.setSize(anchor.clientWidth, anchor.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.render(scene, camera)
    })
</script>

<main bind:this={anchor} use:watchResize={handleResize} />

<style>
    main {
        height: 100vh;
        width: 100vw;
        display: block;
    }
</style>
