import * as THREE from 'three';

export class Wall {
  private wallGeometry = new THREE.PlaneGeometry(225, 225); // Width and height of the portal

  private wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true, // Allow transparency
    opacity: 0.9, // Set the opacity (lower values make it more transparent)
  });

  private wall = new THREE.Mesh(this.wallGeometry, this.wallMaterial);

  constructor(scene: THREE.Scene) {
    this.wall.position.set(0, 0, 0);
    this.wall.rotation.x = -Math.PI / 2;
    scene.add(this.wall);
  }

  public setYPos(y: number) {
    this.wall.position.y = y;
  }
}
