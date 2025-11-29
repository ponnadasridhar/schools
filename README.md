# schools
chool Website – Dynamic & Admin-Integrated Platform

A fully functional, dynamic school website designed to provide an engaging experience for students, parents, and administrators.
This project includes an admin panel with authentication, dynamic content management, image uploads, previous exam papers, and a contact form that connects users directly with the school administration.

🌟 Features
🏫 Dynamic School Website

Fully responsive and user-friendly design.

Easily customizable for any school/college.

Supports image galleries, event updates, announcements, and pages.

🔐 Admin Authentication

Secure admin login system (username/password or OTP-based).

Only admin can access the dashboard.

Admin can manage:

Homepage content

Upload pictures

Manage previous papers

Update details dynamically

🖼 Image Upload System

Admin can upload pictures to the gallery.

Images will display dynamically on the website.

Useful for events, activities, notices, etc.

📄 Previous Exam Papers

A dedicated page for students to view/download past-year papers.

Admin can upload PDF files or documents easily.

📬 Contact Form

Integrated contact form for parents/students.

Can be used to:

Ask admission-related queries

Approach school administration

Send general enquiries

Form submissions delivered directly via email/form API.

🛠 Tech Stack

HTML, CSS, JavaScript

EmailJS / FormSubmit (depending on your setup)

GitHub Pages for hosting

Optional: JSON/API file for dynamic data

📁 Project Structure
/school-website
  ├── index.html
  ├── about.html
  ├── gallery.html
  ├── papers.html
  ├── contact.html
  ├── admin/
  │     ├── login.html
  │     ├── dashboard.html
  │     ├── upload.js
  │     ├── auth.js
  ├── api/
  │     ├── data.json
  │     ├── papers.json
  ├── assets/
        ├── images/
        ├── papers/
        ├── css/
        ├── js/

🚀 How to Use
For Admin

Go to the admin page (/admin/login.html).

Login using secure credentials.

Upload images, update content, and manage papers.

For Users/Parents

Browse the dynamic website.

Check gallery, events, and previous exam papers.

Use the contact form to reach out to school administration.

🎯 Purpose

This website is designed for schools that need:

An affordable online presence

Dynamic content without backend servers

Simple admin controls

Direct communication with parents/students

📌 Future Enhancements

Add student portal

Add marks/result checking

Add mobile app support

Add dynamic notice board
