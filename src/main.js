import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import gsap from 'gsap'

class ThreeModel {
    constructor () {
        this.scene = null
        this.camera = null
        this.renderer = null
        this.controls = null
        this.stats = null
    }

    init() {
        this.initScene()
        this.initCamera()
        this.initRenderer()
        this.initMesh()
        this.initControls()

        this.initStats()

        this.animate()

        this.onListeningWindowResize()
    }

    initScene() {
        this.scene = new THREE.Scene()
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
        this.camera.position.set(0, 0, 10)
        this.scene.add(this.camera)
        //镜头动画
        // gsap.to(this.camera.position, { x: 5, duration: 5, repeat: -1, yoyo: true })
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById('THREEVIEW').appendChild(this.renderer.domElement)
    }

    initMesh() {
        for(let i = 0; i < 20; i ++) {
            const geometry = new THREE.BufferGeometry()
            let positionArray = new Float32Array(9)
            for(let n = 0; n < 9; n ++) {
                positionArray[n] = Math.random() * 10 - 5
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
            const metarial = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()), transparent: true, opacity: .6})
            const mesh = new THREE.Mesh(geometry, metarial)
            this.scene.add(mesh)
        }
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
    }

    initStats() {
		this.stats = new Stats()
		document.body.appendChild(this.stats.dom)
	}

    onListeningWindowResize() {
        window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(window.innerWidth, window.innerHeight)
            // this.renderer.setPixelRatio(window.devicePixelRatio)
		})
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.controls.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera)
    }
}

let three_model = new ThreeModel()
three_model.init()