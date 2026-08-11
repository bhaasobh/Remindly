# Remindly

Remindly is a smart reminder mobile application built with React Native and Expo. It helps users manage two types of reminders:

- Location-based reminders triggered when the user is near a saved place
- Time-based reminders triggered before a scheduled time

The app also includes user profile data, a map view, and personal/shopping list management to support everyday routines and household planning.

## Why this project matters

This project combines real-world mobile features with data-driven workflows:

- GPS tracking and geofencing logic
- Google Places address lookup
- REST API integration with a remote backend
- Context-based state management across screens
- A clean reminder dashboard for organizing daily tasks

It is a strong example of a practical mobile application that solves a real-life problem: helping users remember important things at the right place or time.

## Key Features

### 1. Location-based reminders
- Users can create reminders tied to an address or place
- The app uses Google Places autocomplete to select a location
- Device location is tracked in real time
- A reminder alert appears when the user enters the area around the saved location

### 2. Time-based reminders
- Users can schedule reminders by date and time
- The app checks active reminders periodically
- Alerts are displayed when the scheduled time is approaching

### 3. Reminder dashboard
- All reminders are shown in a centralized list
- Users can filter by type: All, Location, or Time
- Reminder details can be opened and updated

### 4. Map integration
- A live map shows the user’s current location and nearby reminder areas
- The app uses Expo Location and React Native Maps
- Nearby stores/places can also be explored from the map view

### 5. User profile and home tracking
- Profile data is fetched from the backend
- User address data is used in location-aware logic
- App behavior can react to entering/leaving home areas

### 6. Shopping and personal lists
- The app supports a shopping list and a personal item list
- Items can be added, updated, and removed
- This makes the app more useful as a daily planning assistant, not just a reminder tool

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- React Navigation
- Expo Location
- React Native Maps
- Google Places API
- AsyncStorage
- REST API backend (hosted on Render)

## Project Structure

```text
Remindly/
├── app/                     # App screens and route-based navigation
│   ├── (tabs)/
│   │   ├── index.tsx        # Main home screen
│   │   ├── explore.tsx      # Shopping/personal list view
│   │   └── profile.tsx      # User profile screen
│   ├── auth/
│   │   └── LoginContext.tsx # Auth + reminder context
│   └── ...
├── components/              # Reusable UI components
│   ├── AddReminderModal.tsx
│   ├── MapComponent.tsx
│   ├── RemindersList.tsx
│   ├── TimeReminderComponent.tsx
│   ├── Header.tsx
│   └── ...
├── models/                  # Data models
├── assets/                  # Images, icons, fonts, JSON data
├── config.js                # API configuration
├── package.json             # Project dependencies and scripts
├── app.json                 # Expo app metadata
├── tsconfig.json            # TypeScript configuration
├── README.md                # Project documentation
└── scripts/
```

## Core App Flow

1. User logs in or enters the app
2. The app loads the user context and reminder data
3. The map tracks the device’s live location
4. User creates a reminder using either:
   - a location and address, or
   - a date/time trigger
5. Reminder data is sent to the backend API
6. The app periodically checks whether the user is near a saved location or approaching a scheduled time
7. The user receives alerts and can manage reminder details from the list view

## How to Run the App

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator, or Expo Go on a device

### Install dependencies

```bash
npm install
```

### Start the app

```bash
npx expo start
```

Then choose one of the following:

- Android emulator
- iOS simulator
- Expo Go on a physical device
- Web preview (if supported in your environment)

### Alternative scripts

```bash
npm run android
npm run ios
npm run web
```

## Configuration

This app uses a central config file for external services:

- `config.js`

Update the following values if needed:

```js
const config = {
  SERVER_API: 'https://remindlyserver.onrender.com/api',
  GOOGLE_API: 'YOUR_GOOGLE_API_KEY',
};
```

Important:
- The backend URL is required for loading and saving reminders
- The Google API key is used for maps and place search
- If the backend or API key changes, update this file before running the app

## Notes for Reviewers

This project demonstrates practical mobile application development with a strong emphasis on:

- real-time location awareness
- alert-based reminder logic
- API-driven data management
- user-centered design for daily task support
- integration between multiple mobile features in one app

It is a strong portfolio example of an app that is not just UI-focused, but also connected to real user workflows and external services.

## Possible Improvements

Some future enhancements could include:

- better authentication and user session handling
- push notifications for reminders
- recurring reminder support
- improved geofence accuracy and background location handling
- better testing coverage and CI/CD setup
- data caching and offline support

## License

This project is currently intended for educational and portfolio use.

---

Built as a mobile productivity and reminder application to help users stay organized based on both location and time.
