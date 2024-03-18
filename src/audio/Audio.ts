import { Audio as StaticAudio, PositionalAudio, AudioLoader } from 'three'
import { defineComponent, watch } from 'vue'
import Object3D from '../core/Object3D'

type ConcreteAudio = StaticAudio | PositionalAudio

export interface AudioSetupInterface {
  audio?: ConcreteAudio
  streamedAudio?: HTMLAudioElement
}

export default defineComponent({
  extends: Object3D,
  name: 'Audio',
  props: {
    src:  { type: String, required: false },
    volume: { type: Number, default: 1.0 },
    detune: { type: Number, default: 0.0 },
    loop: { type: Boolean, default: true },
    isStreamed: { type: Boolean, default: true }
  },
  setup (): AudioSetupInterface {
    let streamedAudio = new Audio();
    return { streamedAudio }
  },
  watch: {
    volume: function(value) {
        this.audio?.setVolume(value)
    },
    detune: function(value) {
        if (this.isStreamed) {
            if (!this.streamedAudio) { return }
            const playbackRateRatio = Math.pow(2, value / 1200);
            this.streamedAudio.playbackRate = playbackRateRatio
        } else {
            this.audio?.setDetune(value)
        }
    },
    src: function(value) {
        this.stop()
        this.loadAudioAndPlay()
    },
    loop: function(value) {
        this.audio?.setLoop(value)
        if (this.isStreamed) {
            if (!this.streamedAudio) { return }
            this.streamedAudio.loop = value
        } else {
            this.audio?.setLoop(value)
        }
    },
    isStreamed: function(value) {
        if (this.audio) {
            this.initAudio(this.audio)
        }
    }
  },
  methods: {
    initAudio(audio: ConcreteAudio) {
      this.audio = audio
      this.initObject3D(this.audio)
      this.audio?.setVolume(this.volume)
      this.audio?.setLoop(this.loop)
      this.loadAudioAndPlay()
    },
    loadAudioAndPlay() {
      if (!this.src) return undefined

      if (this.isStreamed) {
        this.loadAudioFromStream()
      } else {
        this.loadAudioFromMemory()
      }
    },
    loadAudioFromMemory() {
        const audioLoader = new AudioLoader();
        const instance = this
        audioLoader.load(this.src!, function( buffer ) {
            instance.audio?.setBuffer( buffer );
            instance.audio?.setLoop(instance.loop)
            instance.play()
            instance.audio?.setDetune(instance.detune)
        });
    },
    loadAudioFromStream() {
        this.streamedAudio = new Audio(this.src);
        this.streamedAudio.preload = 'metadata';
        this.streamedAudio.crossOrigin = 'anonymous';
        this.streamedAudio.loop = this.loop
        const instance = this
        this.streamedAudio.addEventListener("loadedmetadata", function(_event) {
            instance.play()
            if (instance.streamedAudio) {
                const playbackRateRatio = Math.pow(2, instance.detune / 1200);
                instance.streamedAudio.preservesPitch = false
                instance.streamedAudio.playbackRate = playbackRateRatio
            }
        });
        this.audio?.setMediaElementSource(this.streamedAudio)
    },
    play() {
        if (this.isStreamed) {
            this.streamedAudio?.play()
        } else {
            this.audio?.play()
        }
    },
    stop() {
        if (this.isStreamed) {
            if (!this.streamedAudio) { return }
            this.streamedAudio.pause()
            this.streamedAudio.currentTime = 0;
        } else {
            this.audio?.stop()
        }
    }
  },
  beforeUnmount() {
    this.stop()
  },
  __hmrId: 'Audio',
})
