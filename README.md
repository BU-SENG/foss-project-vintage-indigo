 This specific branch, `Frontend-patch-1`, implements the foundational structure and styling for the application's user interface.
* About
A Study Planner Application  ( Study Smart )
A simple and effective Study Planner application designed to help students organize their study schedules, track subjects, and manage time efficiently.

 Technologies Used
Frontend: React js and Tailwind Css
  Features
1. Creating a study Session
2. Setting Goals
3. Viewing your Schedule
4. Course Management 

You need the following software installed:

* [Node.js](https://nodejs.org/en/) (LTS version recommended)
* Git

 ### Steps

1.  **Clone the Repository:**
    ```bash
` git clone https://github.com/BU-SENG/foss-project-vintage-indigo.git`

2.  **Navigate to the Project Directory:**
    ```bash
`  cd foss-project-vintage-indigo
`
3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Start the Development Server:**
    ```bash
    npm start
    ```
    The application should now be accessible.

    Author
    Oyedeji Damian 
# Project Enhancements (November 2025)

## Summary
This project was enhanced with several new features to improve usability, accessibility, and user experience. Below are the changes made:

## Enhancements

### 1. Dark Mode Toggle
- Added a button to switch between light and dark mode for the entire app.
- The UI now supports both color schemes for better accessibility and comfort.

### 2. Dashboard Summary Card
- The dashboard now displays summary cards showing:
    - Total study hours (sum of all course hours)
    - Number of completed goals

### 3. Notifications
- Added notification popups for key actions:
    - Adding, completing, or deleting sessions
    - Adding, completing, or deleting goals
    - Adding courses
- Notifications appear at the top-right and can be dismissed.

### 4. Accessibility Improvements
- Added ARIA labels to summary cards and notification close button.
- Improved keyboard navigation for dark mode toggle and notifications.

## How to Use
- Use the dark mode toggle button at the top-right to switch themes.
- View summary cards on the dashboard for quick progress overview.
- Notifications will appear when you perform actions like adding sessions, goals, or courses.

## File Changes
- `src/App.jsx`: Main enhancements implemented here.
- No breaking changes; all existing features remain functional.

---

For further details, see the code comments in `src/App.jsx`.
