## Distributed Systems
### _What's cooking?_

**Faculty:** [Faculty of Informatics in Pula](https://fipu.unipu.hr/)  
**Course:** Distributed systems
**Course Leader:** doc. dr. sc. Nikola Tanković
**Assistant:** Luka Blašković, mag. inf.
**Student:** Roberta Starčić  

### 🛠 Technologies and Services
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![LocalStack](https://img.shields.io/badge/DynamoDB-FF9900?style=flat-square&logo=amazon-dynamodb&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Pydantic](https://img.shields.io/badge/Pydantic-0096D1?style=flat-square) 

- Frontend: React, MUI, Axios 
- Backend: FastAPI, Pydantic, aiohttp 
- Database: DynamoDB (using LocalStack) 
- Authentication: JWT 
- Deployment: Docker, Docker Compose 
 
### Features
The What's Cooking? application allows users to quickly and easily generate recipes based on their own ingredients or without any input. The project is a distributed system that includes multiple microservices. 
Key functionalities include: 
- **Authentication and Registration**
- **Recipe Creation, Viewing and Searching**
- **Recipe Generation**

### Microservices Overview
Auth Microservice: Handles user authentication and JWT token generation.
Classic Microservice: Manages recipe creation, viewing, and basic recipe-related logic.
Recommendation Microservice: Provides recipe suggestions based on user input (filters) or random selections.
DB Microservice: Handles database interactions (DynamoDB) using LocalStack for local development.

### Setup Instructions
1. Auth Microservice
Build and run the Auth microservice:

```bash 
docker build -t auth-microservice:1.0 .
docker run -p 8001:8001 --name auth-microservice auth-microservice:1.0
```

2. Classic Microservice
Build and run the Classic microservice:
```bash
docker build -t classic-microservice:1.0 .
docker run -p 8002:8002 --name classic-microservice classic-microservice:1.0
```

3. Recommendation Microservice
Build and run the Recommendation microservice:
```bash 
docker build -t recommendation-microservice:1.0 .
docker run -p 8003:8003 --name recommendation-microservice recommendation-microservice:1.0
```

4. DB Microservice 
Build and run the DB microservice:
```bash 
docker build -t db-microservice:1.0 .
docker run -p 8004:8004 --name db-microservice db-microservice:1.0
```

5. Local DynamoDB (LocalStack)
For local DynamoDB setup using LocalStack, use the following:
```bash
docker build -t dynamo-db-localstack:1.0 .
docker run -p 8004:8004 --name dynamo-db-localstack dynamo-db-localstack:1.0
```

5. Frontend
To run the frontend locally:
```bash
cd frontend
npm install
npm start
```

### Frontend Overview
The frontend of the **What's Cooking?** application is built using **React** and **MUI** to provide a responsive and modern UI. Axios is used for communication with the backend microservices. Key features of the frontend include:
- **User Authentication and Registration**  
  - Users can create an account or log in using JWT tokens.
  - Login functionality to allow access to recipe creation and recommendations.
- **Recipe Creation Interface**  
  - Forms for users to add new recipes with fields such as recipe name, ingredients, preparation steps, and more.
  - Automatically calculates total preparation time and ingredient count.
- **Recipe Viewing**  
  - Displays a list of all recipes in the system.
  - Search recipes
- **Recipe Generation**  
  - Allows users to get recipe recommendations based on:
    - Provided ingredients
    - Ingredients to avoid
    - Maximum number of ingredients
    - Maximum preparation time
    - Difficulty level (easy, medium, hard)
    -️ Type of dish (breakfast, lunch, dinner, salad, dessert...)
    - “Match all” option – returns only recipes that include all of the selected ingredients
    - Random recipe suggestion – for users who want to discover something new


