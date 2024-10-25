import * as THREE from 'three';
import { BaseModel } from './base-model.js';

export class Platform extends BaseModel {
  constructor(
    scene: THREE.Scene,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  ) {
    super();
    this.loadModel(
      '../../../public/textures/wooden_platform.glb',
      scene,
      () => {
        this.moveTo(position);
      },
      new THREE.Vector3(15, 1.5, 15),
    );
  }
}
