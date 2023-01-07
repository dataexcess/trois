import { defineComponent } from 'vue'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { TextureLoader, Mesh, MeshBasicMaterial } from 'three'

import Model from './Model'

export default defineComponent({
  extends: Model,
  created() {
    const loader = new OBJLoader()
    this.$emit('before-load', loader)
    loader.load(this.src, (root) => {
      const model = root.children[0]

      if ((model as Mesh).isMesh) {
        if (this.texture) {
            const txtLoader = new TextureLoader();
            const texture =  txtLoader.load( this.texture )
            const material = new MeshBasicMaterial( { map: texture } );  
            // object.layers.mask = 2
            (model as Mesh).material = material
          }
      }

      this.onLoad(model)
      this.initObject3D(model)
    }, this.onProgress, this.onError)
  },
})