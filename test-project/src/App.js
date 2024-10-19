import React from 'react';
import ChromaKeyVideo from 'react-chroma-key-video';
import './App.css';

function App() {
  const [show, setShow] = React.useState(false);
  const [isGlowingVideo, setIsGlowingVideo] = React.useState(false);
  const [isGlowingCanvas, setIsGlowingCanvas] = React.useState(false);
  return (
    <div className="App">
      <h1>Chroma Key Video Test</h1>
      {show ? (
        <>
          <p>Click on the video to toggle glow effect</p>
          <div className="video-container visible">
            <div
              className="video-wrapper"
              onClick={() => {
                setIsGlowingVideo(!isGlowingVideo);
              }}>
              <video
                src={process.env.PUBLIC_URL + '/test.mp4'}
                muted
                autoPlay
                loop
                crossOrigin='anonymous'
                playsInline
                width="1920"
                height="1080"
                style={{
                  filter: isGlowingVideo ? 'drop-shadow(0 0 15px #ff6b6b)  drop-shadow(0 0 20px #ff6b6b)' : 'none',
                }}
              />
              <p>Regular Video</p>
            </div>
            <div
              className="video-wrapper"
              onClick={() => {
                setIsGlowingCanvas(!isGlowingCanvas);
              }}>
              <ChromaKeyVideo
                videoSrc={process.env.PUBLIC_URL + '/test.mp4'}
                width={1920}
                height={1080}
                threshold={0.2}
                suppressionRange={0.2}
                transitionRange={0.15}
                keyColor="#00ff00" // Hex color
                className="chroma-key-video"
                style={{
                  filter: isGlowingCanvas ? 'drop-shadow(0 0 15px #ff6b6b)  drop-shadow(0 0 20px #ff6b6b)' : 'none',
                }}
              />
              <p>Chroma Key Video</p>
            </div>
          </div>
        </>
      ) : (
        <div className="button-container visible">
          <button className="start-button" onClick={() => {
            setShow(true);
          }}>
            Start Video
          </button>
        </div>
      )}
    </div>

  );
}
export default App;
