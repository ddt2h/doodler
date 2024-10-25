import * as THREE from 'three';

export function addWASDControls(
  model: THREE.Object3D,
  speed: number = 1.5,
  acceleration: number = 0.05,
  damping: number = 0.9,
) {
  // Track the pressed keys
  const keys: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  // Store the velocity for smooth movement
  const velocity = new THREE.Vector3(0, 0, 0);

  // Add event listeners for keydown and keyup
  document.addEventListener('keydown', (event) => {
    if (['w', 'a', 's', 'd'].includes(event.key)) {
      keys[event.key] = true;
    }
  });

  document.addEventListener('keyup', (event) => {
    if (['w', 'a', 's', 'd'].includes(event.key)) {
      keys[event.key] = false;
    }
  });

  // Update the model's position based on the pressed keys
  function updateModelPosition() {
    // Acceleration towards the desired direction
    if (keys.w) {
      velocity.z -= acceleration; // Accelerate forward
    }
    if (keys.s) {
      velocity.z += acceleration; // Accelerate backward
    }
    if (keys.a) {
      velocity.x -= acceleration; // Accelerate left
    }
    if (keys.d) {
      velocity.x += acceleration; // Accelerate right
    }

    // Apply damping (slows down movement when keys are released)
    velocity.multiplyScalar(damping);

    // Apply velocity to the model's position
    model.position.add(velocity.clone().multiplyScalar(speed));

    // Call this function on the next animation frame
    requestAnimationFrame(updateModelPosition);
  }

  // Start updating the model position
  updateModelPosition();
}
