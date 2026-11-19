# Requirements Spec — Focus Dashboard

## Technical Constraints

### TC-1: Technology Stack
- HTML for structure
- CSS for styling
- Vanilla JavaScript (no frameworks like React, Vue, etc.)
- No backend server required

### TC-2: Data Storage
- Use browser LocalStorage API
- All data stored client-side only

### TC-3: Browser Compatibility
- Must work in modern browsers (Chrome, Firefox, Edge, Safari)
- Can be used as standalone web app or browser extension

---

## Non-Functional Requirements

### NFR-1: Simplicity
- Clean, minimal interface
- Easy to understand and use
- No complex setup required
- No test setup required

### NFR-2: Performance
- Fast load time
- Responsive UI interactions
- No noticeable lag when updating data

### NFR-3: Visual Design
- User-friendly aesthetic
- Clear visual hierarchy
- Readable typography

---

## Required Features (MVP)

### 1. Greeting
- [x] Show current time (updates every second)
- [x] Show current date
- [x] Show greeting based on time of day (Morning / Afternoon / Evening / Night)

### 2. Focus Timer
- [x] 25-minute countdown timer (default)
- [x] Start button
- [x] Stop button
- [x] Reset button

### 3. To-Do List
- [x] Add tasks
- [x] Edit tasks (inline editing)
- [x] Mark tasks as done (checkbox)
- [x] Delete tasks
- [x] Save tasks using LocalStorage

### 4. Quick Links
- [x] Buttons that open favorite websites in a new tab
- [x] Links saved in LocalStorage
- [x] Delete links

---

## Challenges (3 of 5 chosen)

### Challenge 1: Light / Dark Mode
- [x] Toggle button in header
- [x] Theme preference saved to LocalStorage
- [x] Smooth transition between themes

### Challenge 2: Custom Name in Greeting
- [x] Input field to enter user's name
- [x] Name saved to LocalStorage
- [x] Greeting displays "Hello, [Name] 👋"

### Challenge 3: Change Pomodoro Time
- [x] Number input to set custom duration (1–120 minutes)
- [x] Apply button updates timer immediately
- [x] Custom duration saved to LocalStorage

---

## Bonus Features Implemented
- Prevent duplicate tasks (case-insensitive check)
- Sort tasks (Default / A→Z / Z→A / Completed last)
- Toast notifications for user feedback
- Favicon auto-loaded for Quick Links
- Urgent visual indicator (red pulse) when timer < 60 seconds
