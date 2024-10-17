# ChromaKeyVideo

A React component that plays videos with green chroma key removal, allowing for dynamic background replacement. Utilizing WebGL for efficient processing, this component ensures lower file sizes without relying on VP8 or VP9 alpha modes, providing broad compatibility across platforms, including iOS where Safari doesn't support these alpha modes.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Why Choose ChromaKeyVideo?](#why-choose-ChromaKeyVideo)
- [Limitations](#limitations)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Chroma Key Removal:** Eliminates specified colored backgrounds from videos, enabling seamless background replacement.
- **WebGL Integration:** Utilizes WebGL shaders for efficient video processing directly in the browser.
- **Low File Size:** Achieves background removal without relying on VP8 or VP9 alpha modes, resulting in smaller video file sizes.
- **Cross-Platform Compatibility:** Works on all major browsers including iOS Safari, which doesn't support VP8/VP9 alpha modes.
- **Customizable:** Offers various props to fine-tune the chroma key removal and video display according to your needs.

## Installation

Install the package via npm:

```bash
npm install react-chroma-key-video
```

Or using yarn:

```bash
yarn add react-chroma-key-video
```

## Usage

Import and use the `ChromaKeyVideo` component in your React application:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChromaKeyVideo from 'react-chroma-key-video';

const App = () => (
  <div>
    <ChromaKeyVideo 
      videoSrc="/test.mp4" 
      width={400} 
      height={400} 
      threshold={0.4}
      suppressionRange={0.1}
      transitionRange={0.08}
      keyColor={'#00ff00'}
      className="my-custom-class"
      style={{ border: '2px solid #000' }}
    />
  </div>
);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

**Notes:**

- Ensure that your video file (`test2.mp4` in this example) is correctly placed in the public directory or accessible via the specified `videoSrc` path.
- The `className` and `style` props allow you to apply custom styles to the `<canvas>` element.

## Props

| Prop               | Type                  | Default        | Description                                                                                                                                  |
| ------------------ | --------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `videoSrc`         | `string`              | **Required**   | The source URL of the video to be played and processed. Must be a valid path to an MP4 video file.                                           |
| `threshold`        | `number`              | `0.4`          | Determines the sensitivity of the chroma key removal. A lower value makes the chroma key more sensitive to the specified `keyColor`.               |
| `suppressionRange` | `number`              | `0.1`          | Controls the suppression of spill (color fringes) around the edges of the subject. Lower values reduce spill but may affect edge smoothness.     |
| `transitionRange`  | `number`              | `0.08`         | Defines the range over which the chroma key transitions. Smaller values create sharper edges, while larger values produce smoother transitions.|
| `keyColor`         | `hex string (color)`     | `'#00ff00'`     | a hex color string.|
| `width`            | `number`              | `1080`         | Sets the width of the `<canvas>` and `<video>` elements in pixels. Adjust according to your layout requirements.                                |
| `height`           | `number`              | `1080`         | Sets the height of the `<canvas>` and `<video>` elements in pixels. Adjust according to your layout requirements.                               |
| `className`        | `string`              | `''`           | Allows you to pass custom CSS classes to the `<canvas>` element for additional styling.                                                       |
| `style`            | `object`              | `{}`           | Enables inline styling of the `<canvas>` element. Useful for applying styles like borders, shadows, or other CSS properties.                    |

### Detailed Prop Descriptions

#### `videoSrc` (`string`, **Required**)

- **Description:** The source URL of the video to be played and processed. This should be a valid path to an MP4 video file.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/path/to/video.mp4" />
  ```

#### `threshold` (`number`, default: `0.4`)

- **Description:** Controls the sensitivity of the chroma key removal. A lower threshold makes the chroma key more sensitive to the specified `keyColor`, potentially removing more of that color while risking the removal of unintended parts of the video.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" threshold={0.3} />
  ```

#### `suppressionRange` (`number`, default: `0.1`)

- **Description:** Manages the suppression of color spill (fringes) around the subject. Lower values reduce spill but may lead to harsher edges.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" suppressionRange={0.05} />
  ```

#### `transitionRange` (`number`, default: `0.08`)

- **Description:** Defines the range over which the chroma key transitions. Smaller values create sharper edges, while larger values produce smoother transitions.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" transitionRange={0.1} />
  ```

#### `keyColor` (`hex string)`, default: `'#00ff00'`)

- **Description:** Specifies the hex color to remove. By default, it is set to pure green (`#00ff00`).
- **Usage Example:**

  ```jsx
  // Removing blue background
  <ChromaKeyVideo videoSrc="/video.mp4" keyColor={'#00ff00'} />
  ```

#### `width` (`number`, default: `1080`)

- **Description:** Sets the width of the `<canvas>` and `<video>` elements in pixels. Adjust this value to fit your layout needs.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" width={640} />
  ```

#### `height` (`number`, default: `1080`)

- **Description:** Sets the height of the `<canvas>` and `<video>` elements in pixels. Adjust this value to fit your layout needs.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" height={360} />
  ```

#### `className` (`string`, default: `''`)

- **Description:** Allows you to pass custom CSS classes to the `<canvas>` element for additional styling.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" className="my-custom-class" />
  ```

#### `style` (`object`, default: `{}`)

- **Description:** Enables inline styling of the `<canvas>` element. Useful for applying styles like borders, shadows, or other CSS properties.
- **Usage Example:**

  ```jsx
  <ChromaKeyVideo videoSrc="/video.mp4" style={{ border: '2px solid #000' }} />
  ```

## Why Choose ChromaKeyVideo?

### Efficient Background Removal Without VP8/VP9 Alpha Modes

Traditional methods of achieving background removal in videos often rely on VP8 or VP9 codecs with alpha channel support. However, these methods can result in larger file sizes due to the complexity of maintaining transparency information.

**ChromaKeyVideo** offers an efficient alternative by using WebGL shaders to perform chroma key removal directly in the browser. This approach eliminates the need for VP8/VP9 alpha modes, significantly reducing the overall video file size without compromising on quality.

### Compatibility with iOS Devices

One of the significant limitations of VP8/VP9 alpha modes is their lack of support in iOS browsers, particularly Safari. This incompatibility means that videos using these codecs with alpha channels won't render correctly on iOS devices.

**ChromaKeyVideo** circumvents this issue by handling background removal within the component itself, ensuring that your videos look consistent across all platforms, including iOS where VP8/VP9 alpha modes are unsupported.

## Limitations

- **WebGL Dependency:** Requires WebGL support in the user's browser. If WebGL is not supported, the component gracefully falls back to a standard video element.
- **Performance Considerations:** Processing videos with WebGL shaders can be resource-intensive. It's recommended to use this component judiciously within your application, enabling it only when necessary to ensure smooth performance, especially on devices with limited processing capabilities.
- **Color Specificity:** The chroma key removal is optimized for the specified `keyColor`. Using colors similar to the subject may result in unintended background removal.

## Demo
### [See live demo](https://aqaddora.github.io/react-chroma-key-video/)
![ChromaKeyVideo Demo](./media/showcase.gif)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository:** Click on the "Fork" button at the top right of the repository page.
2. **Clone Your Fork:** 

   ```bash
   git clone https://github.com/your-username/react-chroma-key-video.git
   ```

3. **Navigate to the Project Directory:**

   ```bash
   cd react-chroma-key-video
   ```

4. **Install Dependencies:**

   ```bash
   npm install
   ```

5. **Make Your Changes:** Implement your features or bug fixes.

6. **Commit and Push:** 

   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin your-feature-branch
   ```

8. **Open a Pull Request:** Submit a pull request detailing your changes.

## License

This project is licensed under the [MIT License](./LICENSE).