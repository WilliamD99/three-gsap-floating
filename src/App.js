import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import * as THREE from "three";
import ProjectedMaterial from "three-projected-material";
import WebGLApp from "../utils/WebGLApp";
import React, { useRef, useEffect, useCallback } from "react";

import { chunk } from "will-chunkarray";

export default function Index() {
  const tl = useRef(null);
  const tl2 = useRef(null);
  const tl3 = useRef(null);

  let webgl = useRef(null);
  let texture = useRef(null);
  let directionalLight = useRef(null);
  let ambientLight = useRef(null);

  let NUM_ELEMENTS = 50;

  let random = useCallback((min, max) => {
    return Math.random() * (max - min) + min;
  }, []);

  useEffect(() => {
    const canvas = document.querySelector("#app");

    // WebGLApp is a really basic wrapper around the three.js setup,
    // it hides all unnecessary stuff not related to this example
    webgl.current = new WebGLApp({
      canvas,
      // set the scene background color
      background: "white",
      // enable orbit-controls
      orbitControls: false,
      // create an ortographic camera,
      // it will be exposed as webgl.camera
      orthographic: false
      // postprocessing: true
    });

    // attach it to the window to inspect in the console
    // window.webgl = webgl

    // load the example texture
    texture.current = new THREE.TextureLoader().load(
      "https://picsum.photos/seed/picsum/500/500",
      () => {}
    );

    // create a bunch of meshes
    const elements = new THREE.Group();

    for (let i = 0; i < NUM_ELEMENTS; i++) {
      const geometry = new THREE.BoxGeometry(
        random(0.1, 0.5),
        random(0.1, 0.5),
        random(0.1, 0.5)
      );
      // create a different material for different objects
      // since each one will have a different position
      const material = new ProjectedMaterial({
        // use the orthographic camera
        camera: webgl.current.camera,
        texture: texture.current,
        color: "gray",
        textureScale: 1
      });
      const element = new THREE.Mesh(geometry, material);

      // move the meshes any way you want!
      element.position.x = random(-1, 1);
      element.position.y = random(-1, 1);
      element.position.z = random(-1, 1);

      // and when you're ready project the texture!
      material.project(element);
      elements.add(element);
    }

    webgl.current.scene.add(elements);

    // move the camera so it's not facing the
    // texture straight on at the start
    webgl.current.camera.position.set(0, 0, 5);
    webgl.current.camera.lookAt(0, 0, 0);

    // add lights
    directionalLight.current = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.current.position.set(0, 10, 10);
    webgl.current.scene.add(directionalLight.current);

    ambientLight.current = new THREE.AmbientLight(0xffffff, 0.6);
    webgl.current.scene.add(ambientLight.current);
    // start animation loop
    webgl.current.start();

    let chunkArr = chunk(
      elements.children.map((e) => e.position),
      20
    );
    tl.current = gsap.to(chunkArr[0], {
      y: "+=0.15",
      duration: 1.5,
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true
    });
    tl3.current = gsap.to(chunkArr[1], {
      y: "+=0.15",
      duration: 1.5,
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true
    });
    tl2.current = gsap.to(chunkArr[2], {
      y: "+=0.12",
      // z: "+=0.1",
      duration: 1.5,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
    //   tl.current = gsap.to(
    //     positions,
    //     {
    //       z: "+=5",
    //       ease: "none",
    //       scrollTrigger: {
    //         trigger: "#appContainer",
    //         start: "top top",
    //         end: "bottom bottom",
    //         pin: "#app",
    //         scrub: 1
    //       }
    //     }
    //   )
  }, []);

  return (
    <>
      <div
        id="appContainer"
        style={{ height: "500vh" }}
        // onMouseEnter={() => webgl.current.composer.addPass(new EffectPass(webgl.camera, new GlitchEffect()))}
        // onMouseLeave={() => webgl.current.composer.removeAllPasses()}
      >
        <canvas className="content__app" id="app"></canvas>
      </div>
    </>
  );
}
