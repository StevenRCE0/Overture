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
    oddSource: {
        x: number
        y: number
        z: number
    }

    shapeFormation = (params: ShapeFormationProps) => {
        const baseShape = new THREE.Shape()
        baseShape.moveTo(-params.urgency, 0)
    }

    constructor(properties: EventSource) {
        this.properties = properties
    }
}