import { geometryComponent } from './Geometry'
import { CapsuleGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  length: { type: Number, default: 1 },
  capSegments: { type: Number, default: 4 },
  radialSegments: { type: Number, default: 8 },
} as const

export function createGeometry(comp: any): CapsuleGeometry {
  return new CapsuleGeometry(comp.radius, comp.length, comp.capSegments, comp.radialSegments)
}

export default geometryComponent('CapsuleGeometry', props, createGeometry)
