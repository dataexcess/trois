import { defineComponent } from 'vue'
import { BufferGeometry, Material, EdgesGeometry, LineSegments } from 'three'
import Object3D, { Object3DSetupInterface } from '../core/Object3D'
import { MeshInjectionKey } from './Mesh'

export interface LinesSetupInterface extends Object3DSetupInterface {
  mesh?: LineSegments
  lines?: LineSegments
  edgeGeometry?: EdgesGeometry
  geometry?: BufferGeometry
  material?: Material
}

export interface LinesInterface extends LinesSetupInterface {
  setGeometry(geometry: BufferGeometry): void
  setMaterial(material: Material): void
}

// not really a mesh, but allow us to easily get geometry/material support
export default defineComponent({
  extends: Object3D,
  setup(): LinesSetupInterface {
    return {}
  },
  provide() {
    return {
      [MeshInjectionKey as symbol]: this,
    }
  },
  mounted() {
    this.edgeGeometry = new EdgesGeometry( this.geometry );
    this.mesh = this.lines = new LineSegments(this.edgeGeometry, this.material)
    this.initObject3D(this.mesh)
  },
  methods: {
    setGeometry(geometry: BufferGeometry) {
      this.geometry = geometry
      this.edgeGeometry = new EdgesGeometry( this.geometry )
      if (this.mesh) this.mesh.geometry = this.edgeGeometry
    },
    setMaterial(material: Material) {
      this.material = material
      if (this.mesh) this.mesh.material = material
    },
  },
})
