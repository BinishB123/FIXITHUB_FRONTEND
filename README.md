

# Fixthub Frontend

## Overview
Fixthub is a service platform that connects users with workshops , allowing them to book repair slots for their vehicles. The frontend is built using React.js and Tailwind CSS to provide a seamless and responsive user experience.

## Features
- Browse and search for nearby workshops
- Book repair and service slots
- Track ongoing and delivered services
- User authentication and authorization
- Admin panel to manage users, providers, and bookings
- Interactive dashboard with charts and statistics

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **State Management:** Redux
- **API Communication:** Axios
- **Authentication:** Firebase Authentication / JWT
- **Charts & Visualizations:** Recharts
- **Build Tool:** Webpack
-  mapbox implement for taking both users and provider location
-  chat system and call is also implement call- webrtc ,chat -scoketio


### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/fixthub-frontend.git
   ```
2. Navigate to the project directory:
   ```sh
   cd fixthub-frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm start 
   ```

## Project Structure
```
fixthub-frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages
│   ├── redux/         # Redux store and slices
│   ├── services/      # API service functions
│   ├── App.js         # Main application entry
│   ├── index.js       # Application bootstrap
│   ├── assets/        # Images and static files
├── public/
├── package.json
├── tailwind.config.js

## Environment Variables
Create a `.env` file in the root directory and add:
```sh
REACT_APP_API_URL=<your_backend_api_url>
REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
```

## Deployment
To build the project for production:

npm run build


