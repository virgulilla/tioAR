// Complete working GameFind with reset-on-fail, particles, obstacles, trajectory, out-of-bounds reset, and hooks restored
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Matter from "matter-js";
import * as Tone from "tone";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";

export default function GameFind({ letra = "T" }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const releasedRef = useRef(false);
  const resetTimerRef = useRef(null);
  const [won, setWon] = useState(false);
  const [particles, setParticles] = useState([]);
  const [trajectory, setTrajectory] = useState([]);
  const navigate = useNavigate();
  const { addLetra } = useLetras();
  const { nextPista } = usePistas();

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    const Constraint = Matter.Constraint;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;
    const Events = Matter.Events;
    const Body = Matter.Body;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = Math.min(window.innerWidth, 900);
    const height = Math.min(window.innerHeight * 0.75, 700);

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: { width, height, wireframes: false, background: "#cfeefb" },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sounds
    const hitSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).toDestination();
    const bellSynth = new Tone.MetalSynth({
      frequency: 800,
      envelope: { attack: 0.001, decay: 1.2, release: 1.5 },
      harmonicity: 5.1,
      modulationIndex: 32,
    }).toDestination();
    function playHit() {
      Tone.start();
      hitSynth.triggerAttackRelease("G4", "8n");
    }
    function playBell() {
      Tone.start();
      bellSynth.triggerAttackRelease("C6", "1n");
    }

    // Ground
    const ground = Bodies.rectangle(width / 2, height + 20, width, 40, {
      isStatic: true,
    });

    // Obstacles
    const obstacles = [
      Bodies.rectangle(width * 0.45, height * 0.68, 100, 20, {
        isStatic: true,
        render: { fillStyle: "#8dbf9a" },
        label: "box",
      }),
      Bodies.rectangle(width * 0.6, height * 0.56, 120, 20, {
        isStatic: true,
        render: { fillStyle: "#c9a76c" },
        label: "box",
      }),
      Bodies.rectangle(width * 0.5, height * 0.44, 70, 20, {
        isStatic: true,
        render: { fillStyle: "#b294d8" },
        label: "box",
      }),
    ];

    // Target (static tree)
    const targetRadius = 20;
    const target = Bodies.circle(width * 0.78, height * 0.5, targetRadius, {
      isStatic: true,
      label: "target",
      render: {
        sprite: {
          texture: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><text x='0' y='60' font-size='60'>🎄</text></svg>`,
        },
      },
      collisionFilter: { group: 0 },
    });

    // Snowball
    const startX = width * 0.18;
    const startY = height * 0.7;
    const snowballRadius = 16; // smaller to be a bit harder
    const snowball = Bodies.circle(startX, startY, snowballRadius, {
      label: "snowball",
      restitution: 0.6,
      frictionAir: 0.01,
      render: {
        sprite: {
          texture: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><text x='0' y='60' font-size='60'>❄️</text></svg>`,
        },
      },
    });

    // Sling (constraint)
    const sling = Constraint.create({
      pointA: { x: startX, y: startY },
      bodyB: snowball,
      stiffness: 0.02,
      damping: 0.02,
      length: 0,
    });

    Composite.add(engine.world, [
      ground,
      target,
      snowball,
      sling,
      ...obstacles,
    ]);

    // Mouse + drag
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.15, render: { visible: false } },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Track trajectory while attached and after release
    Events.on(engine, "afterUpdate", () => {
      if (sling.bodyB) {
        // when dragging, show predicted trajectory (approximate)
        const vx = (sling.pointA.x - snowball.position.x) * 0.15;
        const vy = (sling.pointA.y - snowball.position.y) * 0.15;
        // simple predict few points
        const pts = [];
        let px = snowball.position.x;
        let py = snowball.position.y;
        let pvx = vx;
        let pvy = vy;
        for (let i = 0; i < 20; i++) {
          pvx *= 0.99; // air resistance approx
          pvy += engine.world.gravity.y * 0.4; // gravity step
          px += pvx * 4;
          py += pvy * 4;
          pts.push({ x: px, y: py });
        }
        setTrajectory(pts);
      } else {
        // when flying, record path points
        if (snowball.speed > 0.5) {
          setTrajectory((t) =>
            [...t, { x: snowball.position.x, y: snowball.position.y }].slice(
              -60
            )
          );
        }

        // If released and nearly stopped without hitting target -> reset automatically
        const outOfBounds =
          snowball.position.x < -100 ||
          snowball.position.x > width + 100 ||
          snowball.position.y > height + 200 ||
          snowball.position.y < -200;

        if (
          (releasedRef.current && snowball.speed < 0.3) ||
          (releasedRef.current && outOfBounds)
        ) {
          if (resetTimerRef.current == null && !won) {
            resetTimerRef.current = setTimeout(() => {
              Body.setPosition(snowball, { x: startX, y: startY });
              Body.setVelocity(snowball, { x: 0, y: 0 });
              Body.setAngularVelocity(snowball, 0);
              sling.bodyB = snowball;
              releasedRef.current = false;
              setTrajectory([]);
              setParticles([]);
              resetTimerRef.current = null;
            }, 500);
          }
        }
      }
    });

    // enddrag -> launch
    Events.on(mouseConstraint, "enddrag", (e) => {
      if (e.body && e.body.label === "snowball") {
        // small timeout to ensure correct release
        setTimeout(() => {
          releasedRef.current = true;
          sling.bodyB = null;
        }, 0);
      }
    });

    // collision handling
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("snowball") && labels.includes("target")) {
          playHit();
          const impactX = pair.collision.supports[0].x;
          const impactY = pair.collision.supports[0].y;
          spawnParticles(impactX, impactY);
          setTimeout(() => {
            playBell();
            setWon(true);
            // keep small delay so user hears bell
            setTimeout(() => {
              addLetra(letra);
              nextPista();
              navigate("/");
            }, 600);
          }, 150);
        }

        if (labels.includes("snowball") && labels.includes("box")) {
          playHit();
        }
      });
    });

    // double click reset
    render.canvas.addEventListener("dblclick", () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      Body.setPosition(snowball, { x: startX, y: startY });
      Body.setVelocity(snowball, { x: 0, y: 0 });
      sling.bodyB = snowball;
      releasedRef.current = false;
      setTrajectory([]);
      setParticles([]);
    });

    // Particles helper
    function spawnParticles(x, y) {
      const parts = Array.from({ length: 18 }).map(() => ({
        id: Math.random().toString(36).slice(2),
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 6,
        life: 40 + Math.random() * 30,
        size: 4 + Math.random() * 6,
      }));
      setParticles((p) => [...p, ...parts]);
    }

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [addLetra, letra, nextPista, navigate, won]);

  // particles RAF
  useEffect(() => {
    let raf;
    function loop() {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.25,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 12, position: "relative" }}>
      <h1>❄️ Lanza la bola y supera los obstáculos hasta acertar al 🎄</h1>
      {won && <h2>🎉 ¡Acertaste! 🎉</h2>}

      {/* trajectory preview / path */}
      {trajectory.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - 3,
            top: p.y - 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00000055",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "white",
            opacity: Math.max(0, Math.min(1, p.life / 60)),
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        ref={sceneRef}
        style={{
          margin: "0 auto",
          width: "100%",
          height: Math.min(window.innerHeight * 0.75, 700),
        }}
      />
    </div>
  );
}
