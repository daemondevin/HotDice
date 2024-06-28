import * as CANNON from "cannon-es";
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import { MTLLoader } from "three/addons/loaders/MTLLoader";

import { params } from "./varables.js";
import { diceArray, addDiceEvents } from "./dice.js";
import { render, updateSceneSize } from "./render.js";

const canvas = document.querySelector("#game-area");

let renderer, physicsWorld, controls, scene, camera;

export const pointer = new THREE.Vector2();
export const raycaster = new THREE.Raycaster();

function initScene() {
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvas,
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 30, 30);

    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.minDistance = 1;
    controls.maxDistance = 40;

    updateSceneSize();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const topLight = new THREE.PointLight(0xffffff, 0.5);
    topLight.position.set(10, 15, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;
    scene.add(topLight);

    createBorders();

    for (let i = 0; i < params.numberOfDice; i++) {
        diceArray.push(createDice(i));
        addDiceEvents(diceArray[i]);
    }

    render();
}

function initPhysics() {
    physicsWorld = new CANNON.World({
        allowSleep: true,
        gravity: new CANNON.Vec3(0, -50, 0),
    });
    physicsWorld.defaultContactMaterial.restitution = 0.3;
}

function createBorders() {
    const wallMaterial = new THREE.ShadowMaterial({
        opacity: 0.1,
    });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(13, 13), wallMaterial);
    floor.name = "wall";
    floor.receiveShadow = true;

    // Create the border line
    const edges = new THREE.EdgesGeometry(floor.geometry);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const borderLine = new THREE.LineSegments(edges, borderMaterial);
    borderLine.position.copy(floor.position);
    borderLine.position.y += 0.01; // Raise the line slightly above the floor
    borderLine.rotation.x = -Math.PI / 2; // Rotate the line to align with the floor
    scene.add(borderLine);

    // Rotate the plane along the x-axis
    floor.quaternion.setFromAxisAngle(
        new THREE.Vector3(-1, 0, 0),
        Math.PI * 0.5
    );

    scene.add(floor);

    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position);
    floorBody.quaternion.copy(floor.quaternion);
    physicsWorld.addBody(floorBody);

    // Walls
    const wallOptions = {
        width: 14,
        height: 15,
        depth: 1,
    };

    function createWall(x, z, isParallel) {
        if (isParallel) {
            const wall = new THREE.Mesh(
                new THREE.BoxGeometry(
                    wallOptions.depth,
                    wallOptions.height,
                    wallOptions.width
                ),
                wallMaterial
            );
            wall.position.set(x, wallOptions.height * 0.5, z);
            wall.receiveShadow = true;
            wall.name = "wall";
            scene.add(wall);

            const wallBody = new CANNON.Body({
                type: CANNON.Body.STATIC,
                shape: new CANNON.Box(
                    new CANNON.Vec3(
                        wallOptions.depth * 0.5,
                        wallOptions.height * 0.5,
                        wallOptions.width * 0.5
                    )
                ),
            });
            wallBody.position.copy(wall.position);
            physicsWorld.addBody(wallBody);
        } else {
            const wall = new THREE.Mesh(
                new THREE.BoxGeometry(
                    wallOptions.width,
                    wallOptions.height,
                    wallOptions.depth
                ),
                wallMaterial
            );
            wall.position.set(x, wallOptions.height * 0.5, z);
            wall.receiveShadow = true;
            wall.name = "wall";
            scene.add(wall);

            const wallBody = new CANNON.Body({
                type: CANNON.Body.STATIC,
                shape: new CANNON.Box(
                    new CANNON.Vec3(
                        wallOptions.width * 0.5,
                        wallOptions.height * 0.5,
                        wallOptions.depth * 0.5
                    )
                ),
            });
            wallBody.position.copy(wall.position);
            physicsWorld.addBody(wallBody);
        }
    }

    createWall(-wallOptions.width * 0.5, 0, true); // Left wall
    createWall(wallOptions.width * 0.5, 0, true); // Right wall
    createWall(0, -wallOptions.width * 0.5, false); // Back wall
    createWall(0, wallOptions.width * 0.5, false); // Front wall
}

function createDiceMesh(id) {
    const diceMesh = new THREE.Group();

    const mtlLoader = new MTLLoader();

    mtlLoader.load("dice.mtl", (materials) => {
        materials.preload();

        const loader = new OBJLoader();
        loader.setMaterials(materials);

        loader.load(
            "dice.obj",
            function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.name = "outDice";
                        child.isToggled = false;
                        child.value = null;
                        child.index = id;
                        child.state = 0;
                    }
                });

                object.rotation.set(0, Math.PI / 2, 0);

                const boundingBox = new THREE.Box3().setFromObject(object);

                const boundingBoxSize = new THREE.Vector3();
                boundingBox.getSize(boundingBoxSize);

                const scaleFactor = new THREE.Vector3(
                    1.05 / boundingBoxSize.x,
                    1.05 / boundingBoxSize.y,
                    1.05 / boundingBoxSize.z
                );
                object.scale.copy(scaleFactor);

                diceMesh.add(object);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            function (err) {
                console.error("Error loading .obj");
            }
        );
    });
    return diceMesh;
}

function createDice(id) {
    const mesh = createDiceMesh(id);

    scene.add(mesh);

    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        sleepTimeLimit: 0.1,
    });
    physicsWorld.addBody(body);
    return { mesh, body };
}

export {
    initScene,
    initPhysics,
    physicsWorld,
    canvas,
    camera,
    renderer,
    diceArray,
    scene,
};
