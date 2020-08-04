# Role System
System for development platform with auth and roles for developers, with protected routes and security for check users permissions in order to do a certain action. Made with NodeJS, express and JWT.

## Getting Started
### In the root folder:
```
npm install
```
## Run the app
### Init the server:
```
npm run dev
```

## Usage
In config.js file, your mongodb URI is CLUSTER_ACCESS (in .env file)

You can test the app with Postman or any method to do requests to the API.
The route /users/teams is the only public route. The other routes needs to check if you are logged, or an admin, etc.
In the folder /routes, you have all the endpoints to do the requests, including login and register.

## Built With

* [NodeJS](https://nodejs.org/es/) - For the backend server (with Express)
* [JWT](https://www.npmjs.com/package/jsonwebtoken) - For the authentication system
* [MongoDB](https://www.mongodb.com/es) - For the backend NoSQL database
