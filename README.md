# Expense Tracker App

## Features
- Add, edit, delete expenses
- Smart category suggestion
- Filters and search
- Offline support (AsyncStorage)
- Dashboard with insights
- Auto sync with backend (bonus)

## Setup Instructions

### Frontend
 - open the root project in your code editor
 - cd client
 - npm install
 - npm start or npx expo start

Note: You don't need to run the backend, because backend is hosted, but you want to test it locally do the following: 

### Backend
 - cd server
 - npm install
 - add .env file and inside it add :
    - PORT=3001
    - MONGODB_URI=YOUR_MONGODB_URI
 - npm run dev


## Architecture Decisions
- Zustand for state management (simple + scalable)
- AsyncStorage for offline-first support
- Backend sync using REST API
- Auto-sync triggered by network status(using netinfo lib)
