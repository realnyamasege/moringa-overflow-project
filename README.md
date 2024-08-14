# Moringa Overflow


## Introduction

The project aims to create a dedicated platform for Moringa School that allows students and instructors to share knowledge, ask questions, and collaborate on coding problems. This tailored platform will address the unique needs and curriculum of Moringa School, fostering better collaboration, consolidating information, and enhancing learning opportunities within the institution.

## Table of Contents

- [Database Relationships](#database-relationships)
- [CRUD Operations](#crud-operations)
- [JWT Authentication](#jwt-authentication)
- [Validation](#validation)
- [Admin Roles](#admin-roles)
- [User Profiles](#user-profiles)
- [Forms with Validation](#forms-with-validation)
- [Client-Side Routing](#client-side-routing)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
  [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Database Relationships

- **One-to-Many**: Users can have multiple posts. Each post is associated with one user.
- **Many-to-Many**: Users can have multiple posts, each post has multiple comments.

## CRUD Operations

### Users

- Registration
- Login
- Post
- Edit Post
- Comment on a post
- Vote up & down 
- Logout
- Password Reset

### Admin

- Delete user profile
- Delete posts 
- Delete Comments

## JWT Authentication

- Secure authentication and authorization using JSON Web Tokens (JWT).
- JWT implementation for user registration, login, logout, and password reset functionalities.

## Validation

- Ensure unique email addresses and usernames during user registration.
- Ensure unique titles or identifiers for each car hire to avoid conflicts.

## Admin Roles

- Define roles such as admin with permissions to manage user profiles, user posts and comments.

## User Profiles

- Allow users to create and update their profiles, including profile images if desired.


## Client-Side Routing

Set up routing for different sections:

- Home page
- User profile and account management
- Admin dashboard for managing posts and users.
- Users dashboard for posting, editing posts and comments.

## Installation

### Clone the repository
1. **Clone the repository:**
   https://github.com/realnyamasege/moringa-overflow-project

### Change into the project directory
2. **Change into the project directory:**
   sh
   cd Client 

### Backend Setup
3. **Install the required backend dependencies:**
   sh
   pip install -r requirements.txt

### Frontend Setup
4. **Navigate to the client directory:**
   sh
   cd client

5. **Install the required frontend dependencies:**
   sh
   npm install
## Usage

### Start the backend server
1. **Start the backend server:**
   sh
   flask run

### Start the frontend development server
2. **Start the frontend development server:**
   ```sh
  
   npm start

This will start the development server, and you can view the application in your browser at [http://localhost:3000](http://localhost:3000).

## Features
This platform will allow students and instructors to:
- Ask and answer questions related to their courses and coding problems.
- Tag questions with relevant topics and course modules.
- Upvote or downvote questions and answers to ensure quality content.
- Mark questions as resolved when an accepted answer is provided.
- Search and filter questions based on tags, keywords, and user profiles.
- Earn reputation points and badges for active participation and quality contributions.
- Integrate with Moringa School’s existing authentication system for seamless user management.

 -  ## Links to deployed Backend and Frontend:
    -[Frontend]_(https://)
    -[Backend]_(https://)

## Developers 
- Ezekiel Nyamasege- nyamasege00@gmail.com - +254 724 227698
- Reuben Kamau - reuben.kamau@student.moringaschool.com - +254 113 786810
- Cynthia Rukwaro - rukwarocynthia4093@gmail.com - +254793475759
- Samfelix Randa - samfelix61@gmail.com - +254719451143

## License
This project is licensed under the MIT License.
