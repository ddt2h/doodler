import * as THREE from 'three';
import { BaseModel } from './base-model.js';
import { addWASDControls } from './wasd.js';

export class Player extends BaseModel {
  //Logic
  private jumpVelocity = 0;
  private jumpVelocityBase = 0.7;
  private gravityVelocity = 0;
  private gravityVelocityBase = 0.001;
  private yVelocity = 0;
  private xVelocity = 0;
  private zVelocity = 0;
  private maxHeightDifference = 50;
  private cameraZ = 45;

  //Camera
  private maxCameraHeight = 0;

  constructor(scene: THREE.Scene) {
    super();
    this.loadModel(
      '../../../public/textures/doodle_jump.glb',
      scene,
      () => {
        this.onInit();
      },
      new THREE.Vector3(5, 5, 5),
    );
    window.addEventListener('keydown', this.jump.bind(this));
  }

  public listenCollisions(models: BaseModel[]) {
    if (this.yVelocity > 0) return;
    for (let i = 0; i < models.length; i++) {
      const isColliding = this.isCollidingWith(models[i]);

      if (!isColliding) continue;

      this.actionJump();
    }
  }

  private onInit() {
    this.moveTo(new THREE.Vector3(0, 15, 0));
    addWASDControls(this.model);
    this.hookScroll();
  }

  private actionJump() {
    this.gravityVelocity = 0;
    this.yVelocity = this.jumpVelocityBase;
  }

  private jump(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.actionJump();
    }
  }

  private listenOnFall() {
    if (this.model.position.y <= this.getDeathPos()) {
      alert(' loh');
    }
  }

  private hookScroll() {
    window.addEventListener('wheel', (event) => {
      if (event.deltaY < 0) {
        this.cameraZ -= 1;
      } else if (event.deltaY > 0) {
        this.cameraZ += 1;
      }
    });
  }

  public getDeathPos() {
    return this.maxCameraHeight - this.maxHeightDifference;
  }

  public bindCamera(camera: THREE.Camera) {
    if (this.model.position.y > this.maxCameraHeight)
      this.maxCameraHeight = this.model.position.y;

    camera.lookAt(
      0,
      this.maxCameraHeight + 5,
      0,
    );
    camera.position.set(0, this.maxCameraHeight + 25, this.cameraZ);
  }

  public update() {
    if (this.model) {
      this.listenOnFall();
      this.gravityVelocity += this.gravityVelocityBase;
      this.yVelocity += this.jumpVelocity - this.gravityVelocity;
      this.model.position.y += this.yVelocity;
      this.model.position.x += this.xVelocity;
      this.model.position.z += this.zVelocity;
    }
  }
}
