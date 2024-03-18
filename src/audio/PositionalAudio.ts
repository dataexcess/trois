import { defineComponent, inject } from 'vue'
import { PositionalAudio } from 'three'
import Audio from './Audio'
import { bindProp } from '../tools'

export default defineComponent({
  extends: Audio,
  name: 'PositionalAudio',
  props: {
    refDistance: { 
        type: Number, 
        default: 1.0,     
        validator: function (value: unknown) {
            const typedValue = value as number
            return typeof typedValue === 'number' && typedValue >= 0
        }
    },
    maxDistance: { 
        type: Number, 
        default: 1.0,
        validator: function (value: unknown) {
            const typedValue = value as number
            return typeof typedValue === 'number' && typedValue >= 0
        }
     },
    rolloffFactor: { 
        type: Number, 
        default: 1.0,
        validator: function (value: unknown) {
            const typedValue = value as number
            return typeof typedValue === 'number' && typedValue >= 0.0 && typedValue <= 1.0
        }
    },
    distanceModel: { type: String, default: 'inverse' },
  },
  created() {

    if (!this.renderer) {
        console.error('Renderer not found')
        return
    }

    if (!this.renderer.audioListener) {
        console.error("No AudioListener component found in the Renderer's child components tree!")
        return
    }

    const positionalAudio = new PositionalAudio(this.renderer.audioListener)
    this.initAudio(positionalAudio)
    this.bindProps()
  },
  methods: {
    bindProps() {
      ['refDistance', 'maxDistance', 'rolloffFactor', 'distanceModel'].forEach(p => {
        bindProp(this.$props, p, (this.audio as PositionalAudio).panner)
      })
    },
  },
  __hmrId: 'AudioTest',
})
