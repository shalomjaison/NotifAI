# 🔐 Login and Signup Flow (Frontend + Backend)

This document explains how the **Login** and **Signup** functionality work in NotifAI. It covers both frontend (React) and backend (Node.js/Express with Sequelize), along with routing and navigation.

---

## Frontend (React)

###  Key Files
- `Login.js` handles login form and authentication
- `SignUp.js` handles user registration
- `App.js` manages routing

### 🔄 Navigation with React Router
We use `useNavigate()` from `react-router-dom` to switch between pages upon success.

```js
navigate("/main"); // after login
navigate("/"); // after signup (login page to login)
```

### Frontend Validations
- Password confirmation on signup (`password === confirmPwd`)
- Required fields using HTML5 validation (these check whether the inputs are in the required format before submitting)

---

## 🛠️ Backend (Node.js + Express + Sequelize)

### 🗂️ Main Files
- `userRoutes.js` defines API endpoints
- `loginUserController.js` handles login requests
- `signupUserController.js` handles user creation
- `userModel.js` defines the Sequelize user schema

### Route Structure
API routes are prefixed with `/users`:
- `POST /users/login` → user login
- `POST /users/signup` → user signup
- `GET /users` → list all users

These are mounted in `server.js` using:
```js
app.use('/users', userRoutes);
```

###  Login Logic
- Accepts email and password
- Checks if user exists and password is correct using `bcrypt.compare()` (encryption library that uses a blowfish cipher)
- Sends 200 OK on success or 401 Unauthorized if credentials are wrong

### 📝 Signup Logic
- Validates unique email
- Hashes password using `bcrypt.hash()`
- Creates a new user with fields like `fname`, `lname`, `username`, `email`, `password`, and optional `role`
- Default role is `customer` (this can be expanded further on later delegation)

### 🧱 Sequelize User Model
Includes:
- `fname`, `lname`, `username`, `email`, `password`, `role`
- All fields required, with `email` being unique

---

## Explantion of FrontEnd Navigation
- Frontend uses `axios` to send login/signup requests to backend endpoints like `/users/login` and `/users/signup`, and handles responses accordingly.
- React Router uses `navigate()` to redirect users upon success (e.g., `navigate('/main')` or `navigate('/login')`).

## Retaining User Data and Resetting the Data Base
To reset the user table (i.e., remove all existing users and start fresh with only the hardcoded user), the backend can use `sequelize.sync({ force: true })` in `server.js`. This drops and recreates all database tables on every server restart. It is helpful during development or testing phases. 

Once development is stable, you can remove `{ force: true }` and use just `sequelize.sync()` to preserve existing user data between restarts. This way, new users registered through the signup form are retained in the database persistently.
- Backend performs validation, password hashing, and user persistence
- Sequelize ensures database schema and validations

For E.g, if you set `sequelize.sync({ force: true })` in `server.js`, you would only see the hardcoded user `John Doe` that we created in our backend itself on the next start. This would mean that any newly created users would not be stored in the database the next time you restart. This can be kept while we are trying to still work through our logic of the Users Database.


# What Happens During Signup and Login

## Step-by-Step Process

1. **User signs up through the frontend form.**
   - They enter fields like first name, last name, username, email, password, and confirm password.
   - The frontend checks if passwords match and that all required fields are filled.
   - A POST request is sent to `/users/signup` with the form data.

2. **Backend receives the signup request.**
   - The `signupUserController` checks if a user with that email already exists.
   - If not, it hashes the password using `bcrypt`, creates a new user in the database using Sequelize, and returns a 201 status.

3. **Frontend receives a successful signup response.**
   - On success (`status === 201`), the app redirects the user to the login page using `navigate('/login')`.

4. **User logs in via the login form.**
   - They enter their email and password and click Sign In.
   - A POST request is sent to `/users/login`.

5. **Backend checks login credentials.**
   - The `loginUserController` looks up the user by email.
   - It compares the entered password with the hashed password using `bcrypt.compare()`.
   - If the credentials are valid, it sends a 200 response.

6. **Frontend navigates to the main dashboard.**
   - On login success, `navigate('/main')` is triggered and the user is redirected to the main page.

---
