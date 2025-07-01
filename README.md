# 🛶 RoeiTrainer – RowingMachineAid®

**Author:** J@n  
**Language:** Dutch (Nederlands)  
**Technologies:** HTML, CSS, JavaScript, Chart.js

## 📋 Overview

**RoeiTrainer** is a web-based application designed to assist users during oldtimer rowing machine workouts. It allows users to select or create custom training programs, track their progress in real-time, and visualize performance statistics.

## 🚀 Features

- **Program Selection & Management**
  - Choose from predefined training programs
  - Create new custom programs
  - Import/export programs in JSON format
  - Export training history

- **Real-Time Workout Display**
  - Visual stroke animation
  - Countdown timer and round tracker
  - Rest period indicator with animation
  - Live clock and progress bar

- **Statistics & Visualization**
  - Total strokes and training time
  - Average stroke rate
  - Charts for stroke frequency and training duration (via Chart.js)

## 📁 File Structure

- `index.html` – Main HTML file
- `style.css` – External stylesheet for layout and design
- `app.js` – JavaScript logic for interactivity and data handling
- `stroke1.png` – Visual aid for rowing stroke
- `stroke2.png` – Visual aid for rowing strok
- `skiff.jpg` – Decorative image of a rowing skiff

## 📦 Dependencies

- [Chart.js](https://www.chartjs.org/) – Used for rendering performance charts

## 🛠 How to Use

1. Open `index.html` in a modern web browser.
2. Select or create a training program.
3. Click **Start** to begin the workout.
4. Use **Restart**, **Pause**, **Reset**, **Export**, and **Import** as needed.
5. View your statistics and charts after completing the session.

## 🌐 Language

The interface is in **Dutch**, with labels like (which can easily translated):
- *Kies programma* (Choose program)
- *Rusttijd* (Rest time)
- *Slagfrequentie* (Stroke rate)
- *Exporteer Geschiedenis* (Export History)

## 📌 Notes

- Ensure `style.css`, `app.js`, and the image files are in the same directory as `index.html`.
- JSON files used for import/export must follow the expected structure defined in the app.
