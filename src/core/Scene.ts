import { defineComponent, inject, InjectionKey, provide, watch, PropType } from 'vue'
import { Scene, Color, Object3D, Texture, CubeTextureLoader, sRGBEncoding, EquirectangularReflectionMapping } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { RendererInjectionKey } from './Renderer'

export const SceneInjectionKey: InjectionKey<Scene> = Symbol('Scene')

interface CubeBackgroundParams {
    path: string,
    urls: string[]
}

export default defineComponent({
  name: 'Scene',
  props: {
    scene: { type: Scene, required: false },
    background: [String, Number, Object],
    cubeBackground: { type: Object as PropType<CubeBackgroundParams>, required: false },
    hdrBackground: { type: String, required: false } 
  },
  setup(props) {
    const renderer = inject(RendererInjectionKey)
    const scene = props.scene ?? new Scene()

    if (!renderer) {
      console.error('Renderer not found')
      return
    }

    renderer.scene = scene
    provide(SceneInjectionKey, scene)

    const setBackground = (value: any): void => {
      if (!value) return
      if (typeof value === 'string' || typeof value === 'number') {
        if (scene.background instanceof Color) scene.background.set(value)
        else scene.background = new Color(value)
      } else if (value instanceof Texture) {
        scene.background = value
      }
    }

    const setCubeBackground = (value: CubeBackgroundParams | undefined): void => {
        if (!value || value === undefined) return
        const loader = new CubeTextureLoader();
        loader.setPath( value.path );
        const textureCube = loader.load( value.urls );
        textureCube.encoding = sRGBEncoding;
        scene.background = textureCube;
    }

    const setHdrBackground = (source: string | undefined): void => {
        if (!source || source === undefined) return
        const loader = new RGBELoader()
        loader.load(source, (texture) => {
            texture.mapping = EquirectangularReflectionMapping
            texture.encoding = sRGBEncoding;
            scene.background = texture
            scene.environment = texture
        })
    } 

    setBackground(props.background)
    watch(() => props.background, setBackground)

    if (props.cubeBackground) {setCubeBackground(props.cubeBackground)}
    watch(() => props.cubeBackground, setCubeBackground)

    if (props.hdrBackground) {setHdrBackground(props.hdrBackground)}
    watch(() => props.hdrBackground, setHdrBackground)


    const add = (o: Object3D): void => { scene.add(o) }
    const remove = (o: Object3D): void => { scene.remove(o) }

    return { scene, add, remove }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Scene',
})
