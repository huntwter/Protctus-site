import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import ScrollIndicator from './ScrollIndicator';
import AudioController from './AudioController';
import LoadingSequence from './LoadingSequence';
import ProgressBar from './ProgressBar';
import WaitlistModal from './WaitlistModal';
// Logo sourced from public dir below

gsap.registerPlugin(ScrollTrigger);

export default function ProtctusLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showLoading, setShowLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  
  const particlesRef = useRef<THREE.Points | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const orbitLinesRef = useRef<THREE.Group | null>(null);
  const gridRef = useRef<THREE.Group | null>(null);
  const shieldRef = useRef<THREE.Mesh | null>(null);
  const hexPatternsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1c1919, 15, 60);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1c1919);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: number[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;
      particlePositions[i + 1] = (Math.random() - 0.5) * 50;
      particlePositions[i + 2] = (Math.random() - 0.5) * 50;
      particleVelocities.push(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;
    (particles as any).velocities = particleVelocities;

    const sphereGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphereRef.current = sphere;

    const orbitGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const radius = 3.5 + i * 0.6;
      const segments = 128;
      const curve = new THREE.EllipseCurve(
        0, 0,
        radius, radius,
        0, 2 * Math.PI,
        false,
        Math.random() * Math.PI
      );
      const points = curve.getPoints(segments);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0xdddddd, 
        transparent: true, 
        opacity: 0,
        linewidth: 1,
      });
      const line = new THREE.LineLoop(geometry, material);
      line.rotation.x = Math.random() * Math.PI * 0.5;
      line.rotation.y = Math.random() * Math.PI * 0.5;
      line.rotation.z = Math.random() * Math.PI * 0.5;
      orbitGroup.add(line);
    }
    scene.add(orbitGroup);
    orbitLinesRef.current = orbitGroup;

    const gridGroup = new THREE.Group();
    const gridSize = 30;
    const divisions = 60;
    const step = gridSize / divisions;

    for (let i = 0; i <= divisions; i++) {
      const points = [];
      const v = -gridSize / 2 + i * step;
      
      points.push(new THREE.Vector3(-gridSize / 2, v, 0));
      points.push(new THREE.Vector3(gridSize / 2, v, 0));
      const geometry1 = new THREE.BufferGeometry().setFromPoints(points);
      const material1 = new THREE.LineBasicMaterial({ 
        color: 0x666666, 
        transparent: true, 
        opacity: 0 
      });
      const line1 = new THREE.Line(geometry1, material1);
      gridGroup.add(line1);

      const points2 = [];
      points2.push(new THREE.Vector3(v, -gridSize / 2, 0));
      points2.push(new THREE.Vector3(v, gridSize / 2, 0));
      const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
      const material2 = new THREE.LineBasicMaterial({ 
        color: 0x666666, 
        transparent: true, 
        opacity: 0 
      });
      const line2 = new THREE.Line(geometry2, material2);
      gridGroup.add(line2);
    }

    gridGroup.position.z = -5;
    scene.add(gridGroup);
    gridRef.current = gridGroup;

    const shieldGeometry = new THREE.SphereGeometry(5, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.rotation.x = Math.PI;
    scene.add(shield);
    shieldRef.current = shield;

    const hexPatterns = new THREE.Group();
    const hexRadius = 0.3;
    const hexCount = 80;
    
    for (let i = 0; i < hexCount; i++) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 0.5;
      const distance = 4.5 + Math.random() * 0.5;
      
      const hexShape = new THREE.Shape();
      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * Math.PI * 2;
        const x = Math.cos(angle) * hexRadius;
        const y = Math.sin(angle) * hexRadius;
        if (j === 0) {
          hexShape.moveTo(x, y);
        } else {
          hexShape.lineTo(x, y);
        }
      }
      hexShape.lineTo(Math.cos(0) * hexRadius, Math.sin(0) * hexRadius);
      
      const hexGeometry = new THREE.ShapeGeometry(hexShape);
      const hexMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x888888, 
        transparent: true, 
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const hexMesh = new THREE.Mesh(hexGeometry, hexMaterial);
      
      hexMesh.position.x = Math.cos(angle1) * Math.sin(angle2) * distance;
      hexMesh.position.y = Math.sin(angle1) * Math.sin(angle2) * distance;
      hexMesh.position.z = Math.cos(angle2) * distance;
      hexMesh.lookAt(0, 0, 0);
      
      hexPatterns.add(hexMesh);
    }
    scene.add(hexPatterns);
    hexPatternsRef.current = hexPatterns;

    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = (particlesRef.current as any).velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          
          if (Math.abs(positions[i]) > 25) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 25) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 25) velocities[i + 2] *= -1;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.002;
        sphereRef.current.rotation.x += 0.001;
      }

      if (orbitLinesRef.current) {
        orbitLinesRef.current.children.forEach((line, i) => {
          line.rotation.z += 0.0008 * (i % 2 === 0 ? 1 : -1);
          line.rotation.y += 0.0005 * (i % 2 === 0 ? -1 : 1);
        });
      }

      if (gridRef.current) {
        gridRef.current.rotation.z += 0.0003;
      }

      if (shieldRef.current) {
        shieldRef.current.rotation.y += 0.001;
      }

      if (hexPatternsRef.current) {
        hexPatternsRef.current.rotation.y += 0.0005;
      }

      if (cameraRef.current) {
        const targetX = mouseRef.current.x * 2;
        const targetY = -mouseRef.current.y * 2;
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.03;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.03;
        cameraRef.current.lookAt(0, 0, 0);
      }

      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };

    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted || !containerRef.current) return;

    ScrollTrigger.create({
      trigger: '#section-1',
      start: 'top top',
      end: 'bottom top',
      onEnter: () => {
        if (particlesRef.current?.material instanceof THREE.PointsMaterial) {
          gsap.to(particlesRef.current.material, { opacity: 0.7, duration: 2 });
        }
      },
    });

    gsap.utils.toArray('.animate-section').forEach((section: any) => {
      const texts = section.querySelectorAll('.animate-text');
      if (texts.length) {
        gsap.fromTo(
          texts,
          { opacity: 0, y: 40, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    });

    ScrollTrigger.create({
      trigger: '#section-2',
      start: 'top center',
      end: 'bottom top',
      onEnter: () => {
        if (particlesRef.current?.material instanceof THREE.PointsMaterial) {
          gsap.to(particlesRef.current.material, { opacity: 0.3, duration: 1.5 });
        }
        if (sphereRef.current?.material instanceof THREE.MeshStandardMaterial) {
          gsap.to(sphereRef.current.material, { opacity: 1, duration: 2 });
          gsap.to(sphereRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, ease: 'power2.out' });
        }
        if (orbitLinesRef.current) {
          orbitLinesRef.current.children.forEach((line, i) => {
            if (line instanceof THREE.Line && line.material instanceof THREE.LineBasicMaterial) {
              gsap.to(line.material, { opacity: 0.6, duration: 1.5, delay: i * 0.1 });
            }
          });
        }
        if (cameraRef.current) {
          gsap.to(cameraRef.current.position, { z: 15, duration: 2, ease: 'power2.inOut' });
        }
      },
      onLeave: () => {
        if (sphereRef.current?.material instanceof THREE.MeshStandardMaterial) {
          gsap.to(sphereRef.current.material, { opacity: 0, duration: 1 });
        }
        if (orbitLinesRef.current) {
          orbitLinesRef.current.children.forEach((line) => {
            if (line instanceof THREE.Line && line.material instanceof THREE.LineBasicMaterial) {
              gsap.to(line.material, { opacity: 0, duration: 1 });
            }
          });
        }
      },
    });

    ScrollTrigger.create({
      trigger: '#section-3',
      start: 'top center',
      end: 'bottom top',
      onEnter: () => {
        if (particlesRef.current?.material instanceof THREE.PointsMaterial) {
          gsap.to(particlesRef.current.material, { opacity: 0.2, duration: 1.5 });
        }
        if (gridRef.current) {
          gridRef.current.children.forEach((line, i) => {
            if (line instanceof THREE.Line && line.material instanceof THREE.LineBasicMaterial) {
              gsap.to(line.material, { opacity: 0.5, duration: 1.5, delay: (i % 20) * 0.01 });
            }
          });
        }
        if (cameraRef.current) {
          gsap.to(cameraRef.current.position, { z: 12, duration: 2.5, ease: 'power2.inOut' });
        }
      },
      onLeave: () => {
        if (gridRef.current) {
          gridRef.current.children.forEach((line) => {
            if (line instanceof THREE.Line && line.material instanceof THREE.LineBasicMaterial) {
              gsap.to(line.material, { opacity: 0, duration: 1 });
            }
          });
        }
      },
    });

    ScrollTrigger.create({
      trigger: '#section-4',
      start: 'top center',
      end: 'bottom bottom',
      onEnter: () => {
        if (particlesRef.current?.material instanceof THREE.PointsMaterial) {
          gsap.to(particlesRef.current.material, { opacity: 0.1, duration: 2 });
        }
        if (shieldRef.current?.material instanceof THREE.MeshStandardMaterial) {
          gsap.to(shieldRef.current.material, { opacity: 0.8, duration: 2.5 });
          gsap.to(shieldRef.current.scale, { x: 1, y: 1, z: 1, duration: 2.5, ease: 'power2.out' });
        }
        if (hexPatternsRef.current) {
          hexPatternsRef.current.children.forEach((hex, i) => {
            if (hex instanceof THREE.Mesh && hex.material instanceof THREE.MeshBasicMaterial) {
              gsap.to(hex.material, { opacity: 0.3, duration: 2, delay: (i % 10) * 0.05 });
            }
          });
        }
        if (cameraRef.current) {
          gsap.to(cameraRef.current.position, { z: 10, duration: 3, ease: 'power2.inOut' });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#1C1919]">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen z-0"
        data-testid="canvas-3d"
      />

      {showLoading && <LoadingSequence onComplete={handleLoadingComplete} />}

      {!showLoading && !hasStarted && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1C1919] z-50 transition-opacity duration-1000">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-extralight mb-4 animate-pulse">
              Click to enter
            </p>
          </div>
          <Button
            onClick={handleStart}
            variant="outline"
            size="lg"
            className="uppercase tracking-[0.25em] text-sm font-light border-primary/40 hover:border-primary/80 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500"
            data-testid="button-start-experience"
          >
            Initialize
          </Button>
        </div>
      )}

      <div id="section-1" className="animate-section relative min-h-screen flex items-center justify-center z-10">
        <div className="text-center max-w-4xl px-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 blur-[50px] -z-10 pointer-events-none rounded-full" />
          <img
            src="/ic_protctus_logo.svg"
            alt="PROTCTUS"
            className="animate-text w-full max-w-2xl h-auto mx-auto mb-16 opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-1000"
            data-testid="img-logo"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="space-y-6">
            <p className="animate-text text-foreground/70 text-sm uppercase tracking-[0.35em] font-extralight leading-relaxed drop-shadow-md">
              Initializing secure environment...
            </p>
            <p className="animate-text text-foreground/80 text-base uppercase tracking-[0.3em] font-light leading-relaxed drop-shadow-md">
              Built not to be seen — but to protect.
            </p>
          </div>
        </div>
      </div>

      <div id="section-2" className="animate-section relative min-h-screen flex items-center justify-center z-10">
        <div className="text-center max-w-3xl px-8">
          <div className="space-y-10 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-40 blur-[40px] -z-10 pointer-events-none" />
            <p className="animate-text text-foreground/85 text-lg uppercase tracking-[0.3em] font-light leading-relaxed drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Every signal inspected.
            </p>
            <p className="animate-text text-foreground/85 text-lg uppercase tracking-[0.3em] font-light leading-relaxed drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Every breach neutralized before it exists.
            </p>
          </div>
        </div>
      </div>

      <div id="section-3" className="animate-section relative min-h-screen flex items-center justify-center z-10">
        <div className="text-center max-w-3xl px-8">
          <div className="space-y-12 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-30 blur-[60px] -z-10 pointer-events-none" />
            <p className="animate-text text-foreground/90 text-2xl uppercase tracking-[0.25em] font-light leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:text-white transition-colors duration-500">
              It learns.
            </p>
            <p className="animate-text text-foreground/90 text-2xl uppercase tracking-[0.25em] font-light leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:text-white transition-colors duration-500">
              Adapts.
            </p>
            <p className="animate-text text-foreground/90 text-2xl uppercase tracking-[0.25em] font-light leading-relaxed drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:text-white transition-colors duration-500">
              And evolves.
            </p>
          </div>
        </div>
      </div>

      <div id="section-4" className="animate-section relative min-h-screen flex items-center justify-center z-10">
        <div className="text-center max-w-4xl px-8">
          <div className="space-y-14 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60 blur-[80px] -z-10 pointer-events-none" />
            
            <p className="animate-text text-foreground/95 text-3xl uppercase tracking-[0.2em] font-light leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              This is not a product.
            </p>
            <p className="animate-text text-foreground/95 text-3xl uppercase tracking-[0.2em] font-light leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              It's a shield.
            </p>
            <div className="relative inline-block animate-text">
              <p className="text-foreground text-4xl uppercase tracking-[0.2em] font-normal leading-relaxed drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] tracking-widest bg-clip-text">
                PROTCTUS
              </p>
              <div className="absolute -inset-4 bg-white/5 blur-[20px] rounded-full -z-10 animate-pulse"></div>
            </div>
            <p className="animate-text text-muted-foreground text-sm uppercase tracking-[0.3em] font-extralight opacity-80">
              In Development
            </p>
            
            <div className="pt-8 animate-text">
              <Button
                variant="default"
                size="lg"
                className="uppercase tracking-[0.25em] text-sm font-light bg-primary/90 hover:bg-primary border-0 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-500"
                data-testid="button-early-access"
                onClick={() => setShowWaitlistModal(true)}
              >
                Join Early Access
              </Button>
            </div>

            <p className="animate-text text-muted-foreground/60 text-xs uppercase tracking-[0.4em] font-extralight pt-16">
              Built to protect. Not to show off.
            </p>
          </div>
        </div>
      </div>

      <div className="h-32"></div>

      {hasStarted && (
        <>
          <ProgressBar />
          <ScrollIndicator />
          <AudioController autoPlay={true} />
          <WaitlistModal open={showWaitlistModal} onOpenChange={setShowWaitlistModal} />
        </>
      )}
    </div>
  );
}
