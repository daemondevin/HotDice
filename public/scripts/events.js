import { pointer, raycaster, scene, camera } from "./scene.js"
import { isStable, toggleDice } from "./dice.js"


function onMouseDown(event) {
    if (!isStable) {
        return;
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
            const intersectedObject = intersects[i].object;

            if (intersectedObject.name === "outDice") {
                toggleDice(intersectedObject);
                break;
            }
        }
    }
}

export { onMouseDown };