// @ts-ignore
import * as THREE from 'three'
import type TimeEvent from './Event'

export interface SpaceProperties {
    events: TimeEvent[]
    axis: THREE.Vector3
}

export default class Space {
    properties: SpaceProperties
    eventShapes: THREE.Object3D<THREE.Event>[]

    spaceCompliance = (events: TimeEvent[]) => {
        const timeStamps = events.map((event) => event.properties.timestamp)
        const timeSpan = Math.max(...timeStamps) - Math.min(...timeStamps)
        const timeBaseOffset = Math.min(...timeStamps)
        const timeScale = timeSpan / 200

        this.eventShapes = events.map((event) => {
            event.geometry.translateZ(
                (event.properties.timestamp - timeBaseOffset) * timeScale
            )
            return event.geometry
        })
    }

    constructor(parameters: SpaceProperties) {
        this.properties = parameters
        this.spaceCompliance(parameters.events)
    }
}
