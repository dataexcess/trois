import { defineComponent, watch } from 'vue'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { TextureLoader, Mesh, MeshLambertMaterial, Texture, DoubleSide } from 'three'
import { MaterialInterface } from '../materials/Material'
import Model from './Model'

export interface ObjModelInterface {
    material?: MaterialInterface
    mesh?:Mesh
  }

export default defineComponent({
    extends: Model,
    setup(): ObjModelInterface {
        return {
        }
    },
    methods: {
        setTexture() {
            if (this.textureSrc && this.mesh) {
                const txtLoader = new TextureLoader();
                const texture =  txtLoader.load( this.textureSrc )
                const material = new MeshLambertMaterial( { map: texture } );  
                // object.layers.mask = 2
                material.side = DoubleSide

                this.mesh.material = material
            }
        },
    },
    created() {
        const loader = new OBJLoader()
        this.$emit('before-load', loader)
        loader.load(this.src, (root) => {
            const model = root.children[0]
            if ((model as Mesh).isMesh) {
                this.mesh = model as Mesh
                this.setTexture()
            }

            this.onLoad(model)
            this.initObject3D(model)
        }, this.onProgress, this.onError)

        watch(() => this.textureSrc, this.setTexture)
    },
})