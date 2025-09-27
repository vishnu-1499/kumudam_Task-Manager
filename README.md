 Frontend
- Built with React, Redux Toolkit, and Bootstrap.
- Simple login and register forms.
- Global state managed via Redux.
- Responsive UI with success/error notifications.

 Backend
- Built with Node.js, Express, and MongoDB.
- REST APIs:
  - `POST /user/register` – Register a new user.
  - `POST /user/login` – Login and get a JWT token.
  - `GET /user/get-taskData` – Get all tasks for logged-in user.
  - `POST /user/create-taskData` – Add a new task.
  - `POST /user/update-taskData/:id` – Update task status.
  - `POST /user/delete-taskData/:id` – Delete a task.
- Passwords stored securely using bcrypt.
- JWT used for authentication and route protection.

.env
 - PORT=5000
 - MONGO_URI=your_mongodb_connection_string
 - JWT_SECRET=your_jwt_secret

Coding Structure
task-manager/
|_ server/
|  |_ auth/ userAuth.js/
│  |_ controllers/ userController.js/
│  |_ models/ 
|     |_ user.js
|     |_ task.js
│  |_ routes/ route.js/
│  |_ index.js
|  |_.env
|_ client/
│  |_ src/
│     |_ pages/
|       |_ Api.js
|       |_ SignIN.js
|       |_ userDetails.js
│     |_ store/
|        |_ Store.js
|        |_ Auth.js
|        |_ Task.js
│  │  | App.js
|_ README.md
