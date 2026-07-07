# Component Library Index

Ready-to-use animated React components, sourced from [Originkit](https://originkit.dev) (free animated component library) via their MCP, served as Vite + TypeScript + CSS variants.

Each included component lives in `components/<name>/` with the `.tsx` source and a `meta.json` (dependencies, install hint, description). Components marked *pending* are being imported in nightly batches (Originkit API allows 10 fetches/day).

| Component | Category | Status | Description |
|---|---|---|---|
| `glitterwrap` | animation | pending | Send a glittering starfield of particles warping outward or inward from center, with random sparkle flashes an |
| `particletunnel` | animation | pending | Flow particles along radial spokes toward a central black void with perspective depth, depth-based fading, and |
| `pixelreveal` | animation | included | Dissolve a grid of colored pixel squares to reveal an image, sweeping up, down, left, or right with a ragged,  |
| `risinglines` | animation | pending | Emit two layers of glowing particles — thin line sparks and soft blobs — rising or falling from a luminous hor |
| `starburst` | animation | pending | Radiate glowing streaks outward from a movable focal point to form a twinkling starburst with a soft flower bl |
| `blinkingsquares` | background-animation | pending | Fill any background with a grid of independently twinkling squares, shaped by a directional density fade and a |
| `character-waves` | background-animation | pending | Fill any background with a flowing field of ASCII characters driven by layered noise waves that ripple away fr |
| `pixelcard` | background-animation | pending | Fill a card with a shimmering canvas grid of pixels that grow in from the center or any edge on hover, scroll, |
| `snowfall` | background-animation | pending | Fill any frame with drifting canvas snow, tuning per-flake size, speed, opacity, wind sway, and fall direction |
| `emojiburst` | button | pending | Launch a burst of custom emojis from a tappable button, flying off freely under gravity with a springy shake o |
| `link-preview` | button | pending | Reveal a floating thumbnail of any linked page on hover, with the preview leaning toward your cursor as it mov |
| `blurcarousel` | image-gallery | pending | Flip through images with a soft blur that creeps in on arrow hover and a 3D press-tilt that springs back as ea |
| `boxcarousel` | image-gallery | pending | Rotate images and videos across the four faces of a 3D cube, driven by autoplay, drag, or arrow keys. |
| `coverflowcarousel` | image-gallery | pending | Glide through an infinite cover-flow reel where the centered image grows into a landscape hero while its neigh |
| `coverflowgallery` | image-gallery | pending | A smooth 3D coverflow carousel with perspective animations, autoplay, and fully customizable titles. |
| `draggable-grid` | image-gallery | pending | An infinitely draggable image canvas with smooth momentum, responsive layouts, and seamless gallery exploratio |
| `imagegallery` | image-gallery | pending | Continuously stream images that fly outward or spiral from the center, with configurable density, easing, and  |
| `infinitegallery` | image-gallery | included | An infinitely zoomable and draggable image gallery with smooth motion, momentum, and immersive navigation. |
| `magneticcarousel` | image-gallery | pending | Magnify a row of image bars macOS dock style as the cursor nears, then click any bar to expand it into a large |
| `proximityorbit` | image-gallery | pending | Display images in a smooth, interactive circular orbit. |
| `spinimage` | image-gallery | pending | Orbit a set of images along a tilted 3D ellipse with continuous spin, depth-based scaling, and front-to-back l |
| `spiralimages` | image-gallery | included | Images flow along an Archimedean spiral vortex from the edge into the center, rotating to follow the tangent a |
| `swipe-stack` | image-gallery | pending | Flick through a fanned 3D stack of image cards that tilt, scale, and cycle to the back on every swipe. |
| `blackhole` | interactive-elements | included | Render a physically convincing 3D black hole with orbiting particles, depth-sorted occlusion, gravity inflow,  |
| `draggablesticker` | interactive-elements | pending | Drag an image around like a real sticker that peels off the surface, tilts to your motion, and settles back in |
| `fluidtrail` | interactive-elements | included | Paint a glowing, GPU-simulated fluid trail that swirls and drifts behind the cursor with real Navier-Stokes ph |
| `gravitygallery` | interactive-elements | pending | Drop image-filled squares or circles into a Matter.js physics world with gravity, walls, and click-drag tossin |
| `juiceeffect` | interactive-elements | included | Fill an image silhouette with gooey, rising-and-falling liquid particles that fuse into organic blobs and scat |
| `kineticgrid` | interactive-elements | pending | An interactive grid background that dynamically reacts to cursor movement with smooth attraction, animated mes |
| `particlesphere` | interactive-elements | pending | Spin an interactive 3D sphere of thousands of glowing particles that scatter away from your cursor and clicks. |
| `pixelate-image` | interactive-elements | pending | Reveal or conceal an image through a real-time SVG pixelation filter driven by cursor distance or a scroll-tri |
| `pixeldrift` | interactive-elements | pending | Interactive particle typography that assembles, disperses, and reacts to cursor movement with smooth physics-b |
| `sticker-peel` | interactive-elements | pending | Peel and curl a 3D image sticker away from the surface on hover and press, with realistic bone-driven folding  |
| `svgparticles` | interactive-elements | included | Transform images/SVGs into interactive particle animations with hover and repulsion effects. |
| `usercursor` | interactive-elements | pending | Replace the native pointer inside any surface with a spring-tracked arrow and a trailing name pill that rocks  |
| `directionhover` | text | pending | Swap text to an accent-colored copy that slides in from the top or bottom edge the cursor enters, then out aga |
| `dynamic-weight` | text | pending | Morph each letter between two font weights based on its distance from the cursor for a live, variable-font hov |
| `flickertext` | text | pending | Bring text and images to life with customizable flicker and outline effects. |
| `inkbleed` | text | pending | Create interactive ink bleed effects that react fluidly to cursor movement. |
| `meshtexthover` | text | pending | Warp text across a WebGL mesh that drags and springs back under the cursor, with chromatic color-split fringes |
| `random-letter-swap` | text | pending | Swap each letter of a heading vertically on hover, revealing a duplicate glyph in a randomized, staggered orde |
| `scrambletext` | text | pending | Animate text with cinematic glitch reveals and interactive character-based hover effects. |
| `shiny-pill` | text | pending | Sweep a bright sheen across a line of text on an endless loop, with tunable shine color and sweep speed. |
| `smokytext` | text | included | Animate text with realistic smoke diffusion, customizable reveal directions, trigger modes, and smooth charact |
| `spotlighttext` | text | pending | Dim a block of text and sweep a soft cursor-following spotlight across it to reveal the bright letters underne |
| `textlift` | text | pending | Stack each letter into a layered 3D extrusion that expands and lifts off the surface when you hover it individ |
| `textmorph` | text | included | Cycle through a word list with a gooey blur-and-scale morph that melts each word smoothly into the next. |
| `textpath` | text | pending | Scroll repeating text seamlessly along a procedural sine-wave path with adjustable frequency, height, speed, a |
| `typewriter` | text | pending | Types out a rotating list of phrases one character at a time with a blinking cursor and a static, separately c |
| `weight-hover` | text | included | Morph each letter's variable-font weight on hover, staggered letter-by-letter with a spring that eases in and  |
