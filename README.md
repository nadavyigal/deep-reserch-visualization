# Deep Research Visualization

A Next.js application with Firebase authentication for deep research visualization.

## Features

- Firebase Authentication with Google Sign-In
- Next.js App Router
- React and TypeScript
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nadavyigal/deep-reserch-visualization.git
   cd deep-reserch-visualization
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean the Next.js cache
- `npm run clean-start` - Clean the cache and start the development server

## Debugging

The application includes several debugging tools:

- `/debug` - Main debug page
- `/debug/auth` - Authentication debug page
- `/debug/firebase` - Firebase configuration debug page

## Windows Batch Files

For Windows users, several batch files are included to help with development:

- `start-app.bat` - Start the application with a clean environment
- `check-server.bat` - Check if the server is running
- `start-and-check.bat` - Start the server and check if it's running
- `move-project.bat` - Move the project to a directory without special characters

## License

ISC