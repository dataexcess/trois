import { defineComponent } from 'vue'
import Object3D, { Object3DSetupInterface } from '../core/Object3D'
import { bindProp } from '../tools'
import { GridHelper } from 'three'

interface GridHelperSetupInterface extends Object3DSetupInterface {
  gridHelper?: GridHelper
}

export default defineComponent({
  extends: Object3D,
  props: {
    size:  { type: Number, required: true },
    divisions: { type: Number, required: true },
  },
  setup(): GridHelperSetupInterface {
    return {}
  },
  created() {
    this.gridHelper = new GridHelper(this.size, this.divisions)
    this.initObject3D(this.gridHelper)
    this.bindProps()
  },
  methods: {
    bindProps() {
        ['size', 'divisions'].forEach(p => {
          bindProp(this.$props, p, this.gridHelper)
        })
      },
  },
  __hmrId: 'GridHelper',
})
