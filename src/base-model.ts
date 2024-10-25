import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export abstract class BaseModel {
  protected model: THREE.Object3D;
  private boxHelper: THREE.BoxHelper | null = null;

  // Static cache to store loaded models
  private static modelCache: Map<string, THREE.Object3D> = new Map();

  constructor() {}

  protected loadModel(
    path: string,
    scene: THREE.Scene,
    onLoaded: any,
    targetSize: THREE.Vector3 = null,
    debug: boolean = false, // Optionally enable debug box
  ) {
    // Check if the model is already cached
    if (BaseModel.modelCache.has(path)) {
      const cachedModel = BaseModel.modelCache.get(path)!.clone(); // Clone the cached model
      this.model = cachedModel;
      this.setupModel(scene, onLoaded, targetSize, debug);
    } else {
      // If not cached, load the model and cache it
      loader.load(
        path,
        (gltf) => {
          this.model = gltf.scene;

          // Cache the loaded model
          BaseModel.modelCache.set(path, this.model.clone());

          this.setupModel(scene, onLoaded, targetSize, debug);
        },
        undefined,
        (error) => {
          console.error('An error occurred while loading the model:', error);
        },
      );
    }
  }

  // Helper method to handle model setup and scaling
  private setupModel(
    scene: THREE.Scene,
    onLoaded: any,
    targetSize: THREE.Vector3 | null,
    debug: boolean,
  ) {
    const box = new THREE.Box3().setFromObject(this.model);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);

    if (targetSize) {
      this.model.scale.set(
        targetSize.x / sizeVec.x,
        targetSize.y / sizeVec.y,
        targetSize.z / sizeVec.z,
      );
    }

    const newBox = new THREE.Box3().setFromObject(this.model);
    const center = new THREE.Vector3();
    newBox.getCenter(center);
    this.model.position.sub(center);

    // Add the model to the scene
    scene.add(this.model);

    // Optionally add the BoxHelper for debugging
    if (debug) {
      this.boxHelper = new THREE.BoxHelper(this.model, 0xffffff);
      scene.add(this.boxHelper);
    }

    onLoaded();
  }

  public drawDebugBox() {
    if (this.boxHelper) {
      this.boxHelper.update();
    }
  }

  public moveTo(to: THREE.Vector3) {
    this.model.position.add(to);
    if (this.boxHelper) {
      this.boxHelper.update();
    }
  }

  public isCollidingWith(otherModel: BaseModel): boolean {
    if (!this.model || !otherModel.model) return false;

    const thisBox = new THREE.Box3().setFromObject(this.model);
    const otherBox = new THREE.Box3().setFromObject(otherModel.model);

    return thisBox.intersectsBox(otherBox);
  }
}
