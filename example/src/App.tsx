import { RGBSplitImage } from 'rgb-split-image'
import './App.css'

function App() {
  return (
    <div style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
          RGB Splitter
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
          A framework-agnostic, high-performance chromatic distortion library for modern web interfaces.
        </p>
      </header>

      <div className="gallery-grid">

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
              alt="Retro Synth"
              idleEffect="breathe"
              breatheSpeed={1}
              splitDistance={11}
            />
          </div>
          <div>
            <h3>Ambient Breathe</h3>
            <p className="description">
              Perfect for hero banners. Soft, continuous <i>breathe</i> state.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://plus.unsplash.com/premium_photo-1661963874418-df1110ee39c1?q=80&w=1686&auto=format&fit=crop"
              alt="Cyberpunk City"
              idleEffect="followMouse"
              splitDistance={18}
              colorSpace="rgb"
            />
          </div>
          <div>
            <h3>Interactive Depth</h3>
            <p className="description">
              Uses the <i>followMouse</i> state to create a parallax-like 3D effect.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
              alt="Cyber Grid"
              idleEffect="none"
              onClick="glitch"
              effectDuration={400}
              effectIntensity={1.25}
              splitDistance={25}
              colorSpace="cmyk"
            />
          </div>
          <div>
            <h3>Violent Click</h3>
            <p className="description">
              Perfectly aligned until clicked. Triggers a strong 800ms <i>glitch</i> using CMYK.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
              alt="Mountains"
              idleEffect="breathe"
              breatheSpeed={0.5}
              onHover="glitch"
              splitDistance={22}
            />
          </div>
          <div>
            <h3>Hover Override</h3>
            <p className="description">
              Breathes slowly by default. Hovering overrides it with a continuous <i>glitch</i>.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1631058269796-6ea2654cc78b?q=80&w=1035&auto=format&fit=crop"
              alt="Globe"
              idleEffect="none"
              onMount="breathe"
              effectDuration={2000}
              effectIntensity={0.75}
              breatheSpeed={1.25}
              splitDistance={20}
            />
          </div>
          <div>
            <h3>Entrance Focus</h3>
            <p className="description">
              Uses <i>onMount="breathe"</i> to draw attention for 4 seconds, then cleanly settles.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
              alt="Mountains"
              idleEffect="followMouse"
              splitDistance={15}
              grayscale={true}
            />
          </div>
          <div>
            <h3>Grayscale Base</h3>
            <p className="description">
              Desaturates the image data using the <i>grayscale</i> prop. RGB splits inject color.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
              alt="Retro Synth"
              idleEffect="glitch"
              splitDistance={150}
              colorSpace="cmyk"
            />
          </div>
          <div>
            <h3>Extreme Distort</h3>
            <p className="description">
              Sets the base <i>idleEffect="glitch"</i> for chaotic scenes.
            </p>
          </div>
        </div>

        <div className="gallery-item">
          <div className="image-container">
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1631058269796-6ea2654cc78b?q=80&w=1035&auto=format&fit=crop"
              alt="Globe"
              idleEffect="none"
              onHover="breathe"
              breatheSpeed={1.5}
              splitDistance={15}
            />
          </div>
          <div>
            <h3>Hover Reveal</h3>
            <p className="description">
              Image stays still until the user interacts. On hover, it begins to <i>breathe</i> rapidly.
            </p>
          </div>
        </div>

        <div className="gallery-item" style={{ gridColumn: '1 / -1', maxWidth: '100%', borderTop: '1px solid #1a1a1a', backgroundColor: '#050505' }}>
          <div className="image-container" style={{ maxWidth: '800px', height: '400px', width: '100%' }}>
            <RGBSplitImage
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
              alt="Cyber Grid"
              idleEffect="followMouse"
              splitDistance={20}
              trackWindowMouse={true}
            />
          </div>
          <div>
            <h3>Global Mouse Tracking</h3>
            <p className="description" style={{ maxWidth: '400px' }}>
              Follows your cursor everywhere on the screen using <i>trackWindowMouse=true</i>. Notice how it tracks even when hovering over other elements.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
