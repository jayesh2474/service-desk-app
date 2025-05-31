# Service Desk Application

A modern service desk application built with React and Firebase, designed to help teams manage and track support tickets efficiently.

## Features

- 🔐 Secure authentication with Firebase
- 🎫 Create and manage support tickets
- 👥 User role management (Admin/User)
- 📊 Real-time ticket updates
- 📱 Responsive design with Tailwind CSS
- ✨ Modern UI with Framer Motion animations

## Tech Stack

- React 19
- Firebase (Authentication, Firestore, Analytics)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Lucide React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd service-desk-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values from your Firebase Console

4. Start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── utils/         # Utility functions and animations
├── firebase.js    # Firebase configuration
└── App.js         # Main application component
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Environment Variables

The following environment variables are required:

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
