import { defineComponent, watch } from 'vue'
import Object3D from '../core/Object3D'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { bindProp } from '../tools'

export interface TransformControlsInterface {
  transformControls?: TransformControls
}

export default defineComponent({
  extends: Object3D,
  name: 'TransformControls',
  props: {
    mode: { type: String, default: 'translate' },
    showX: { type: Boolean, default: true },
    showY: { type: Boolean, default: true },
    showZ: { type: Boolean, default: true },
    target: { type: Object, required: false }
  },
  setup (): TransformControlsInterface {
    return {}
  },
  created () {
    if (!this.renderer) {
        console.error('Renderer not found')
        return
    } 

    if (!this.renderer.camera) {
        console.error('Camera not found')
        return
    }

    this.transformControls = new TransformControls(this.renderer.camera, this.renderer.renderer.domElement)
    this.initObject3D(this.transformControls)
    this.bindProps()
    this.watchTarget()
  },
  methods: {
    bindProps() {
        ['mode', 'showX', 'showY', 'showZ'].forEach(p => {
            bindProp(this, p, this.transformControls)
        })
    },
    watchTarget() {
        watch(() => this.$props.target, (value) => {
            this.transformControls!.detach()
            if (value !== null) { this.transformControls!.attach(value as any) }
        })
    }
  },
  __hmrId: 'Audio',
})
