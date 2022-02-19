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

    shapeFormation = (params: ShapeFormationProps) => {
        const baseShape = new THREE.Shape()
        baseShape.moveTo(-params.urgency, 0)
        const baseMaterial = new THREE.MeshStandardMaterial()
        const vessel = new THREE.ExtrudeGeometry(baseShape, {
            steps: 1,
            bevelEnabled: false,
        })
        return new THREE.Mesh(vessel, baseMaterial)
    }

    constructor(properties: EventSource) {
        this.properties = properties
    }
}