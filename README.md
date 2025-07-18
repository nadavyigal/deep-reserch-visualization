# Markdown Animation Studio

This application allows users to import large Markdown documents, automatically parse headings, and generate interactive animation placeholders beneath each section. Users can insert their own JavaScript animation code (powered by Anime.js) to enhance reports with engaging visuals.

## Features

- **Markdown Import & Parsing**: Paste or import Markdown documents and automatically get animation containers beneath each heading.
- **Customizable Animations with Anime.js**: Add custom JavaScript animations to each section.
- **User Authentication**: Google Sign-In required for editing animations.
- **Live Preview**: See your animations in real-time as you edit.
- **Export Options**: Save your animated document as HTML for sharing.
- **Persistent Storage**: Automatically saves your work to localStorage.

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Add your Firebase configuration to `src/lib/firebase/firebase.ts`

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Sign In**: Use the Google Sign-In button to authenticate.
2. **Import Markdown**: Paste your Markdown content in the editor or use the Import button.
3. **Add Animations**: Click the "Add Animation" button beneath any heading.
4. **Write Animation Code**: Use Anime.js to create animations. The `container` variable gives you access to the animation container.
5. **Preview**: Toggle between Edit and Preview modes to see your animations.
6. **Export**: Click "Export HTML" to save your document with animations as an HTML file.

## Animation Examples

Here's a simple example of an Anime.js animation you can add:

```javascript
// Create elements
const circle = document.createElement('div');
circle.style.width = '50px';
circle.style.height = '50px';
circle.style.borderRadius = '50%';
circle.style.background = '#3498db';
circle.style.position = 'absolute';
container.appendChild(circle);

// Create animation
const animation = anime({
  targets: circle,
  translateX: [
    { value: 250, duration: 1000, delay: 500 },
    { value: 0, duration: 1000, delay: 500 }
  ],
  translateY: [
    { value: -100, duration: 500, delay: 1000 },
    { value: 0, duration: 500, delay: 1000 }
  ],
  scale: [
    { value: 2, duration: 500, delay: 0 },
    { value: 1, duration: 500, delay: 1000 }
  ],
  backgroundColor: [
    { value: '#FF5733', duration: 500 },
    { value: '#3498db', duration: 500, delay: 1000 }
  ],
  easing: 'easeInOutQuad',
  loop: true
});

return animation;
```

## Technologies Used

- Next.js 14 with App Router
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Anime.js
- react-markdown

## License

MIT