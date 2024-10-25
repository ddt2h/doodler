import * as THREE from 'three';

import { MapDto } from './map-dto.js';
import { ObstacleDto } from './obstacle-dto.js';
import { Platform } from './platform.js';

function rng(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateMap(): MapDto {
  const obstacles: ObstacleDto[] = [];
  //
  const startHeight = 0;
  let latestX = 0;
  let latestZ = 0;

  const targetHeight = 999;

  let currentHeight = startHeight;

  const initialPlatform: ObstacleDto = { x: 0, y: 0, z: 0, type: 'normal' };
  obstacles.push(initialPlatform);

  while (currentHeight < targetHeight) {
    const x = rng(-(25 - latestX), 25 - latestX);
    const y = rng(5, 15) + currentHeight;
    const z = rng(-(15 - latestX), 15 - latestZ);

    latestX = x;
    latestZ = z;

    const obstacle: ObstacleDto = { x, y, z, type: 'normal' };
    obstacles.push(obstacle);

    currentHeight = y;
  }

  return { obstacles };
}

export function generateObjectsFromMap(map: MapDto, scene: THREE.Scene): any {
  const normalPlatforms: Platform[] = [];

  for (let i = 0; i < map.obstacles.length; i++) {
    switch (map.obstacles[i].type) {
      case 'normal': {
        normalPlatforms.push(
          new Platform(
            scene,
            new THREE.Vector3(
              map.obstacles[i].x,
              map.obstacles[i].y,
              map.obstacles[i].z,
            ),
          ),
        );
        break;
      }
    }
  }
  return { nPlatforms: normalPlatforms };
}
