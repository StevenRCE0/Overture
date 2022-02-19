import * as THREE from "three"

export interface EventSource {
    eventTitle: string
    eventDescription?: string
    timestamp: number
    importance: number
    urgency: number
    peopleInvolved?: string[]
    extrusions?: {
        span: number
    }[]
}

interface ShapeFormationProps {
    importance: number
    urgency: number
    extrusions?: {
        span: number
    }[]
}

export default class TimeEvent {
    properties: EventSource
    geometry: THREE.Object3D<THREE.Event>

    shapeFormation = (params: ShapeFormationProps) => {
        const baseShape = new THREE.Shape()
        baseShape.moveTo(-params.urgency, 0)
        baseShape.bezierCurveTo(-params.urgency, params.importance / 2, -params.urgency / 2, params.importance, 0, params.importance)
        baseShape.bezierCurveTo(params.urgency / 2, params.importance, params.urgency, params.importance / 2, params.urgency, 0)
        baseShape.bezierCurveTo(params.urgency, -params.importance / 2, params.urgency / 2, -params.importance, 0, -params.importance)
        baseShape.bezierCurveTo(-params.urgency / 2, -params.importance, -params.urgency, -params.importance / 2, -params.urgency, 0)
        const baseMaterial = new THREE.MeshStandardMaterial({color: 0x66ccff})
        const vessel = new THREE.ExtrudeGeometry(baseShape, {
            steps: 1,
            bevelEnabled: false,
        })
        const vesselMesh = new THREE.Mesh(vessel, baseMaterial)
        vesselMesh.receiveShadow = true
        vesselMesh.castShadow = true
        return vesselMesh
    }

    constructor(properties: EventSource) {
        this.properties = properties
        this.geometry = this.shapeFormation({
            importance: properties.importance,
            urgency: properties.urgency,
        })
    }
}