import { defineComponent } from 'vue'
import SpriteText from 'three-spritetext'
import Object3D, { Object3DSetupInterface } from '../core/Object3D'
import { bindProp } from '../tools'

interface TextSpriteSetupInterface extends Object3DSetupInterface {
  textSprite?: SpriteText
}

export default defineComponent({
  extends: Object3D,
  props: {
    text: { type: String, required: true },
    fontFace: { type: String, required: false },
    textHeight:  { type: Number, required: false },
    fontSize:  { type: Number, required: false },
    borderColor:  { type: String, required: false }
  },
  setup(): TextSpriteSetupInterface {
    return {}
  },
  created() {
    this.textSprite = new SpriteText(this.text)
    this.initObject3D(this.textSprite)
    this.bindProps()
  },
  methods: {
    bindProps() {
        ['text', 'fontFace', 'textHeight', 'fontSize', 'borderColor'].forEach(p => {
          bindProp(this.$props, p, this.textSprite)
        })
      },
  },
  __hmrId: 'TextSprite',
})
