# WTWR (What to Wear) - Backend Project

Backend: [api.wtwr-project.twilightparadox.com](https://api.wtwr-project.twilightparadox.com)

## Description

The **WTWR (What to Wear)** project is a backend application designed to complement the frontend, which was previously built in earlier sprints. The purpose of this backend is to provide an API and user authorization for the WTWR application. This backend server connects to a MongoDB database, processes client requests, and performs operations like creating users, managing clothing items, and handling user authentication.

This project is part of a learning journey focusing on backend development, databases, security, testing, and deployment. It leverages technologies such as Express.js, MongoDB, and Mongoose, and incorporates security practices like basic authorization and error handling.

## Functionality

The WTWR backend project includes the following key features:

1. **User Management:**

   - Create a new user.
   - Retrieve all users.
   - Get user details by their ID.

2. **Clothing Item Management:**

   - Create a new clothing item.
   - Retrieve all clothing items.
   - Delete a clothing item by its ID.

3. **Like/Unlike Clothing Items:**

   - Like a clothing item.
   - Unlike a clothing item.

4. **Authorization:**

   - Basic authorization using a temporary middleware for attaching a user ID to each request. Later, this will be updated with a more robust authentication system.

5. **Error Handling:**

   - Centralized error handling for cases like invalid requests, missing resources, or server issues.
   - Returns appropriate error codes (400 for bad requests, 404 for not found, 500 for server errors).

6. **Testing and Deployment:**
   - Set up for automated testing using Postman and GitHub Actions to ensure code quality and functionality.
   - A clear structure for organizing routes, controllers, models, and utility functions.

## Technologies and Techniques Used

### Backend Technologies

1. **Node.js**: JavaScript runtime environment that powers the backend logic.
2. **Express.js**: Web framework used for handling routes and HTTP requests.
3. **MongoDB**: NoSQL database for storing users and clothing items.
4. **Mongoose**: ODM (Object Data Modeling) library for MongoDB, used for defining schemas and managing data in the database.

### Key Concepts and Techniques

1. **Routing**: Express routes for users and clothing items are structured in separate controllers to manage the API endpoints.
2. **Schemas and Models**: Using Mongoose, schemas for users and clothing items are defined. This includes validation (e.g., URL validation using the `validator` library), default values, and relationships between collections (e.g., linking clothing items to users).

3. **Authorization**: Implemented basic user authorization using middleware that temporarily adds a test user ID to each request. This will be extended to a full authentication system in later stages.

4. **Error Handling**: All errors are handled using custom error messages and status codes. For example:

   - 400: For invalid input or bad request.
   - 404: For non-existent resources.
   - 500: For server-side errors.

5. **Linting and Code Style**:

   - **ESLint** with the **Airbnb JavaScript Style Guide** is configured for maintaining code consistency and catching errors early in the development process.
   - **Prettier** is integrated to format code for consistency across developers.

6. **Hot Reloading**: The server is configured to use **nodemon**, which automatically reloads the server when project files are changed, speeding up the development process.

### Testing and CI/CD

- **Postman**: Postman is used to test API endpoints manually and with the provided test collection.
- **GitHub Actions**: CI/CD pipeline is set up to automatically run tests and ensure that the codebase is functioning properly before deployment or merging.

## Project Structure

The project is organized into a modular structure:

- `routes/`: Stores the routing logic for users and clothing items.
- `controllers/`: Contains the logic for processing requests and sending responses.
- `models/`: Defines the Mongoose schemas for users and clothing items.
- `utils/`: Contains utilities such as error code constants.
- `.github/`: Contains configuration files for GitHub Actions, used for CI/CD and automated testing.

## Installation and Usage

### Prerequisites

- **Node.js**: Ensure that Node.js is installed on your machine.
- **MongoDB**: Ensure that MongoDB is installed and running locally.

### Steps to Install and Run the Project

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd se_project_express
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up the Database**:
   Make sure MongoDB is running locally and connect to it using Mongoose in `app.js`:

   ```javascript
   mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
   ```

4. **Start the Server**:
   For development (with hot reload):

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm run start
   ```

5. **Test API Endpoints**:
   Use Postman or run GitHub Actions to test the API endpoints and verify functionality.

## Future Improvements

- **Authentication**: Implement proper user authentication using JWT or OAuth.
- **Enhanced Error Handling**: Improve the error-handling mechanism by adding logging and tracking.
- **Deployment**: Deploy the application to a remote server or cloud service for public access.

This project serves as the foundation for building robust backend applications with Node.js and MongoDB, offering practical experience in real-world backend development.
