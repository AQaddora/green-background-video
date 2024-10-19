import React from 'react';
import ChromaKeyVideo from 'react-chroma-key-video';
import './App.css';

function App() {
  const [show, setShow] = React.useState(false);

  return (
    <div className="App">
      <h1>Chroma Key Video Test</h1>
      {show ? (
        <div className="video-container visible">
          <div className="video-wrapper">
            <video
              src={process.env.PUBLIC_URL + '/test.mp4'}
              muted
              autoPlay
              loop
              crossOrigin='anonymous'
              playsInline
              width="1920"
              height="1080"
              style={{ height:'281.5px' }}
            />
            <p className='p'>Regular Video</p>
          </div>
          <div className="video-wrapper">
            <ChromaKeyVideo
              videoSrc={process.env.PUBLIC_URL + '/test.mp4'}
              width={1920}
              height={1080}
              threshold={0.2}
              suppressionRange={0.2}
              transitionRange={0.15}
              keyColor="#00ff00" // Hex color
              className="chroma-key-video"
              style={{ border: '2px solid #000' }}
            />
            <p>Chroma Key Video</p>
          </div>
        </div>
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
