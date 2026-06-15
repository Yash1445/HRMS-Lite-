import { useEffect, useRef } from "react";

const palette = ["#2563eb", "#0891b2", "#16a34a", "#64748b", "#0f172a"];

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cleanupScene = () => {};
    let cancelled = false;

    import("three").then((THREE) => {
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 5.8);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);

      const group = new THREE.Group();
      scene.add(group);

      const ambient = new THREE.AmbientLight(0xffffff, 1.4);
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(2.5, 3, 4);
      scene.add(ambient, key);

      const nodes = Array.from({ length: 32 }, (_, index) => ({
        x: (Math.random() - 0.35) * 7.2,
        y: (Math.random() - 0.45) * 3.6,
        z: (Math.random() - 0.5) * 1.8,
        scale: 0.05 + Math.random() * 0.06,
        color: new THREE.Color(palette[index % palette.length]),
        phase: Math.random() * Math.PI * 2,
      }));

      const nodeGeometry = new THREE.TetrahedronGeometry(1, 0);
      const nodeMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.45,
        metalness: 0.25,
        transparent: true,
        opacity: 0.78,
        vertexColors: true,
      });
      const nodeMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodes.length);
      group.add(nodeMesh);

      const matrix = new THREE.Matrix4();
      nodes.forEach((node, index) => {
        matrix.compose(
          new THREE.Vector3(node.x, node.y, node.z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(node.phase, node.phase * 0.4, 0)),
          new THREE.Vector3(node.scale, node.scale, node.scale)
        );
        nodeMesh.setMatrixAt(index, matrix);
        nodeMesh.setColorAt(index, node.color);
      });

      const pairs = [];
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y, nodes[i].z - nodes[j].z);
          if (distance < 1.75 && pairs.length < 54) pairs.push([i, j]);
        }
      }

      const linePositions = new Float32Array(pairs.length * 6);
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({ color: "#2563eb", transparent: true, opacity: 0.18 });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lines);

      const ribbon = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.25, 0.012, 220, 8, 2, 3),
        new THREE.MeshBasicMaterial({ color: "#0891b2", transparent: true, opacity: 0.28 })
      );
      ribbon.position.set(2.8, 1.25, -1.2);
      ribbon.rotation.set(0.5, 0.2, 0.1);
      group.add(ribbon);

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const updateLines = () => {
        pairs.forEach(([a, b], pairIndex) => {
          const offset = pairIndex * 6;
          linePositions[offset] = nodes[a].x;
          linePositions[offset + 1] = nodes[a].y;
          linePositions[offset + 2] = nodes[a].z;
          linePositions[offset + 3] = nodes[b].x;
          linePositions[offset + 4] = nodes[b].y;
          linePositions[offset + 5] = nodes[b].z;
        });
        lineGeometry.attributes.position.needsUpdate = true;
      };

      const clock = new THREE.Clock();
      let frameId = 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const render = () => {
        const elapsed = clock.getElapsedTime();
        nodes.forEach((node, index) => {
          const y = node.y + Math.sin(elapsed * 0.65 + node.phase) * 0.05;
          const rotation = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(elapsed * 0.18 + node.phase, elapsed * 0.14 + node.phase, elapsed * 0.08)
          );
          matrix.compose(new THREE.Vector3(node.x, y, node.z), rotation, new THREE.Vector3(node.scale, node.scale, node.scale));
          nodeMesh.setMatrixAt(index, matrix);
        });
        nodeMesh.instanceMatrix.needsUpdate = true;
        group.rotation.y = Math.sin(elapsed * 0.16) * 0.16;
        group.rotation.x = Math.cos(elapsed * 0.11) * 0.04;
        ribbon.rotation.x += 0.0018;
        ribbon.rotation.y += 0.0024;
        renderer.render(scene, camera);
        if (!reducedMotion) frameId = window.requestAnimationFrame(render);
      };

      resize();
      updateLines();
      render();
      window.addEventListener("resize", resize);

      cleanupScene = () => {
        window.removeEventListener("resize", resize);
        window.cancelAnimationFrame(frameId);
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        ribbon.geometry.dispose();
        ribbon.material.dispose();
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      cleanupScene();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-backdrop" aria-hidden="true" data-testid="three-backdrop" />;
}