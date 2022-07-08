import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
        // this.loadFBXModel()
        // this.loadGLTFModel()
        this.initMesh()
        this.initLight()
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

    loadFBXModel() {
        const loader = new FBXLoader()
        loader.load('./models/Samba Dancing.fbx', (object) => {
            console.log(object);
            this.scene.add(object)
        })
    }

    loadGLTFModel() {
        const loader = new GLTFLoader()
        loader.load('./models/scene.gltf', (object) => {
            console.log(object);
            this.scene.add(object.scene)
        })
    }

    initMesh() {
        // for(let i = 0; i < 20; i ++) {
        //     const geometry = new THREE.BufferGeometry()
        //     let positionArray = new Float32Array(9)
        //     for(let n = 0; n < 9; n ++) {
        //         positionArray[n] = Math.random() * 10 - 5
        //     }
        //     geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        //     const metarial = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()), transparent: true, opacity: .6})
        //     const mesh = new THREE.Mesh(geometry, metarial)
        //     this.scene.add(mesh)
        // }
        //贴图
        const textureLoader = new THREE.TextureLoader()
        // const picTexture = textureLoader.load('./texture/door_left.png')
        // const alphaTexture = textureLoader.load('./texture/glass.png')
        // const geometry = new THREE.BoxBufferGeometry(2, 3.6, 2)
        // const metarial = new THREE.MeshBasicMaterial({ 
        //     color: '#ffffff', 
        //     map: picTexture,
        //     // alphaMap: alphaTexture,
        //     transparent: true,
        //     side: THREE.DoubleSide
        //  })

        //光照
        // const geometry = new THREE.BoxBufferGeometry(1.5, 1, 1)
        // const metarial = new THREE.MeshStandardMaterial({
        //     color: '#ffffff', 
        //     map: picTexture,
        //     // alphaMap: alphaTexture,
        //     transparent: true,
        //     side: THREE.DoubleSide,
        // })

        //环境贴图
        const cubeLoader = new THREE.CubeTextureLoader()
        const env = cubeLoader.load([
            'texture/brage/posx.jpg',
            'texture/brage/negx.jpg',
            'texture/brage/posy.jpg',
            'texture/brage/negy.jpg',
            'texture/brage/posz.jpg',
            'texture/brage/negz.jpg'
        ])
        console.log(env);

        const geometry = new THREE.SphereBufferGeometry(1, 20, 20)
        const metarial = new THREE.MeshStandardMaterial({
            metalness: 1,
            roughness: 0,
            envMap: env
        })
        const geometry2 = new THREE.SphereBufferGeometry(1, 10, 10)
        const metarial2 = new THREE.MeshStandardMaterial({
            metalness: 1,
            roughness: 0,
            envMap: env
        })
        for(let i = 0; i< Math.random() * 30; i ++) {
            let yz = Math.floor(Math.random() * 10) + 30
            const geometry = new THREE.SphereBufferGeometry(1, yz, yz)
            const metarial = new THREE.MeshStandardMaterial({
                metalness: 1,
                roughness: 0,
                envMap: env
            })
            const mesh = new THREE.Mesh(geometry, metarial)
            mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
            this.scene.add(mesh)
        }
        // const mesh = new THREE.Mesh(geometry, metarial)
        // const mesh2 = new THREE.Mesh(geometry2, metarial2)
        // mesh2.position.set(2, 2, -1)
        // this.scene.add(mesh)
        // this.scene.add(mesh2)
        this.scene.background = env
        this.scene.environment = env


    }
    
    initLight() {
        //环境光
        this.scene.add(new THREE.AmbientLight(0xffffff, .5))
        //平行光
        const dirLight = new THREE.DirectionalLight(0xffffff, .5)
        dirLight.position.set(10, 10, 10)
        this.scene.add(dirLight)
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.maxDistance = 50
        this.controls.minDistance = 4
        // this.controls.maxPolarAngle = Math.PI / 1.9
        // this.controls.minPolarAngle = Math.PI / 2
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
            this.renderer.setPixelRatio(window.devicePixelRatio)
		})
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        // this.scene.rotation.y += 0.01
        this.controls.update()
        this.stats.update()
        this.renderer.render(this.scene, this.camera)
    }
}

let three_model = new ThreeModel()
three_model.init()