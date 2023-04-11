import * as THREE from 'three'

function clamp(min: number, max: number, value: number) {
    return Math.min(Math.max(value, min), max)
}

export interface EventSource {
    id: string,
    eventTitle: string
    eventDescription?: string
    timestamp: number
    importance: number
    urgency: number
    relevance?: number
    preference?: number
    peopleInvolved?: string[]
    extrusions?: {
        span: number
    }[]
}

interface ShapeFormationProps {
    importance: number
    urgency: number
    revelance?: number
    preference?: number
    extrusions?: {
        span: number
    }[]
}

export default class TimeEvent {
    properties: EventSource
    geometry: THREE.Object3D<THREE.Event>

    constructor(properties: EventSource) {
        this.properties = properties
        this.geometry = this.shapeFormation({
            importance: properties.importance,
            urgency: properties.urgency,
            revelance: properties.relevance ?? 0.5,
            preference: properties.preference ?? 0.5,
        })
    }

    shapeFormation = (params: ShapeFormationProps) => {
        const thicknessBase = params.urgency
        const thicknessPedal = params.urgency / 2
        const height = params.importance
        const offset = params.revelance * height
        const alphaAngle = ((clamp(params.preference, 0, 1) + 1) * Math.PI) / 3

        // Geometry generation
        const nodes: THREE.Vector2[][] = [
            [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(-params.urgency, params.importance / 2),
                new THREE.Vector2(-params.urgency / 2, params.importance),
                new THREE.Vector2(0, params.importance)
            ],
            [
                new THREE.Vector2(0, params.importance),
                new THREE.Vector2(params.urgency / 2, params.importance),
                new THREE.Vector2(params.urgency, params.importance / 2),
                new THREE.Vector2(params.urgency, 0)
            ],
            [
                new THREE.Vector2(params.urgency, 0),
                new THREE.Vector2(params.urgency, -params.importance / 2),
                new THREE.Vector2(params.urgency / 2, -params.importance),
                new THREE.Vector2(0, -params.importance)
            ],
            [
                new THREE.Vector2(0, -params.importance),
                new THREE.Vector2(-params.urgency / 2, -params.importance),
                new THREE.Vector2(-params.urgency, -params.importance / 2),
                new THREE.Vector2(-params.urgency, 0)
            ]
        ]

        // TODO: directly add z curvature to nodes
        const curves = nodes.map((node) => {
            return new THREE.CubicBezierCurve3(
                new THREE.Vector3(node[0].x, node[0].y, 0),
                new THREE.Vector3(node[1].x, node[1].y, 0),
                new THREE.Vector3(node[2].x, node[2].y, 0),
                new THREE.Vector3(node[3].x, node[3].y, 0)
            )
        })

        let points = []
        for (let i = 0; i < curves.length; i++) {
            points.push(...curves[i].getPoints(100))
        }

        const baseShape = new THREE.BufferGeometry().setFromPoints( points );


        // set arcLengthDivisions

        const radius = Math.random() * 5 + 40

        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
            steps: 2,
            depth: 1.5,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 10,
            bevelOffset: 0,
            bevelSegments: 10
        }
        // const vessel = new THREE.ExtrudeGeometry(baseShape, extrudeSettings)

        const position = baseShape.attributes.position
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i)
            const y = position.getY(i)
            const distance = Math.sqrt(x ** 2 + y ** 2)
            const height = Math.sqrt(radius ** 2 - distance ** 2)
            position.setZ(i, height)
        }

        // Material generation
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xbbbfff,
            roughness: 0.5,
            metalness: 0.2,
        })

        const vesselMesh = new THREE.Mesh(baseShape, baseMaterial)
        vesselMesh.receiveShadow = true
        vesselMesh.castShadow = true

        return vesselMesh
    }
}
