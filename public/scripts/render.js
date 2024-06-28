import { camera, renderer, physicsWorld, diceArray, scene } from "./scene.js"

function render() {
    physicsWorld.fixedStep();
  
    for (const dice of diceArray) {
      dice.mesh.position.copy(dice.body.position);
      dice.mesh.quaternion.copy(dice.body.quaternion);
    }
  
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  
  function updateSceneSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  export { render, updateSceneSize };