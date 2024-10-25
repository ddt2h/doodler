import * as THREE from 'three';
import { Player } from './player.js';
import { generateObjectsFromMap, generateMap } from './generateMap.js';
import { Wall } from './wall.js';

const _W = 800;
const _H = 800;

export class World {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private player: Player | null = null;

  private wall: Wall = null;

  private objMap: any = null;

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft white light
    this.scene.add(ambientLight);
  }

  private loadTextures() {
    const loader = new THREE.CubeTextureLoader();
    const skyboxTextures = loader.load([
      '../../../public/textures/background.png', // Positive X
      '../../../public/textures/background.png', // Negative X
      '../../../public/textures/background.png', // Positive Y
      '../../../public/textures/background.png', // Negative Y
      '../../../public/textures/background.png', // Positive Z
      '../../../public/textures/background.png', // Negative Z
    ]);
    this.scene.background = skyboxTextures;
  }

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, _W / _H, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(_W, _H);

    this.loadTextures();
    this.player = new Player(this.scene);

    //
    const genMap = generateMap();
    this.objMap = generateObjectsFromMap(genMap, this.scene);

    this.wall = new Wall(this.scene);

    this.addLights();

    document.body.appendChild(this.renderer.domElement);
  }

  public draw() {
    requestAnimationFrame(this.draw.bind(this));
    if (this.player) {
      this.player.update();
      this.player.drawDebugBox();
      this.player.bindCamera(this.camera);
      this.player.listenCollisions(this.objMap.nPlatforms);

      this.wall.setYPos(this.player.getDeathPos());
    }
    this.renderer.render(this.scene, this.camera);
  }
}
