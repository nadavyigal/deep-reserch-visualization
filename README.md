# Deep Research Visualization

A Next.js application for visualizing deep research data with Firebase integration.

## Features

- Firebase Authentication with Google Sign-in
- Firestore Database integration
- Firebase Storage for file uploads
- Next.js App Router for modern routing
- React 18 with TypeScript
- Tailwind CSS for styling
- Dark/Light mode support

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nadavyigal/deep-reserch-visualization.git
   cd deep-reserch-visualization
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Special Considerations for Windows Users

If you're experiencing issues with special characters in file paths (like Hebrew characters), use the provided batch files:

- `start-app.bat` - Starts the application with a clean environment
- `check-server.bat` - Checks if the Next.js server is running
- `start-and-check.bat` - Starts the server and verifies its status
- `move-project.bat` - Helps copy the project to a directory without special characters

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── debug/            # Debug tools
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Client providers
├── lib/
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── firebase/         # Firebase configuration
│   │   ├── firebase.ts      # Firebase initialization
│   │   └── firebaseUtils.ts # Firebase utility functions
│   └── hooks/            # Custom React hooks
│       └── useAuth.ts    # Authentication hook
```

## Debug Tools

The application includes debug tools to help troubleshoot issues:

1. Navigate to `/debug` to access the debug dashboard
2. Use the Firebase debug page to check Firebase initialization and authentication status

## Deployment

This project can be deployed to Vercel with minimal configuration:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)