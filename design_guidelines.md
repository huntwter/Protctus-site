# PROTCTUS - 3D Cinematic Website Design Guidelines

## Design Philosophy
**Matte Realism Over Flashy Effects**: Create an alive, intelligent, protective experience like an AI system silently monitoring the digital world. The design must surpass igloo.inc in quality and immersive storytelling through realistic matte textures, soft shadows, depth, and calm precision.

**Experience Goal**: Users enter a classified environment — quiet, secure, powerful. They don't scroll to "see content"; they experience a system revealing itself layer by layer.

## Visual Design System

### Color Palette
- **Primary Background**: Deep black (#0C0C0C) with faint digital grain or fog
- **Accents**: Dark gray and neutral white only
- **Critical Constraint**: NO glow, NO neon, NO glossy surfaces, NO reflections, NO colored lights

### Typography
- **Font Style**: Ultra-thin, geometric, uppercase sans-serif
- **Animation**: Every word appears and fades like system logs
- **Treatment**: Text overlays with fixed positioning over 3D scenes

### Materials & Lighting
- **Surfaces**: Realistic matte textures exclusively
- **Lighting**: Clean ambient lighting from one source + directional soft shadows
- **Atmosphere**: Faint fog or digital grain, depth-of-field blur between sections

## Section-by-Section Structure

### 1. Initialization (Landing)
- PROTCTUS logo (from protctus.png) slowly fades in
- Faint static particles drifting in darkness
- Sequential text animation:
  - "Initializing secure environment…"
  - "Built not to be seen — but to protect."
- Ambient sound begins after user interaction

### 2. The Core
- Dark matte 3D sphere rotating gently in space
- Thin white orbital lines representing data flow
- Camera pan reacts to cursor movement (parallax)
- Text overlays:
  - "Every signal inspected."
  - "Every breach neutralized before it exists."

### 3. The Network
- 3D data grid with thousands of thin interconnected lines
- Dynamic neural-like activity (lines moving and reconnecting)
- Soft flat lighting maintaining realism
- Text appears:
  - "It learns."
  - "Adapts."
  - "And evolves."

### 4. The Shield
- Grid folds inward forming massive dome (digital shield)
- Camera passes inside showing hexagonal patterns
- Scene calms to only ambient hum
- Final text sequence:
  - "This is not a product."
  - "It's a shield."
  - "PROTCTUS — In Development."
- Small glowing "Join Early Access" button on fade to black

## Interaction & Animation

### Scroll Behavior
- GSAP ScrollTrigger drives all transitions
- Extremely slow camera zoom and rotation (no cuts)
- Scroll adjusts particle density (less near end)
- Smooth story-based 3D transitions through space

### Mouse Interaction
- Slight parallax tilt throughout
- Small camera pan reacting to cursor in Core section
- Subtle, not distracting

### Audio
- Low-frequency BGM (subtle hum or ambient pulse)
- Plays after user click/interaction
- Continuous atmospheric presence

## Technical Requirements
- **3D Engine**: Three.js with performance optimization
- **Particles**: Static particles in opening, adjustable density
- **Camera**: Slow motion through 3D space, depth-of-field effects
- **Responsiveness**: Full-screen canvas, optimized for all devices
- **Performance**: Fast loading despite 3D complexity

## Critical Success Factors
- **Tagline**: "Built to protect. Not to show off."
- **Benchmark**: Must visually outperform igloo.inc in realism, smoothness, and atmospheric depth
- **Feeling**: Classified environment revealing itself — minimal, atmospheric, human-grade 3D storytelling