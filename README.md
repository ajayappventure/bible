# Node.js Project

This is a Node.js project that integrates AWS Cognito for authentication and uses Prisma ORM for database interaction.

## Prerequisites

Before running the project, make sure you have the following installed on your machine:

- [Node.js]
- [NPM]
- [PostgreSQL]

## Project Setup

1. **Clone the repository:**

    git clone https://github.com/your-username/your-repo.git

2. **Install dependencies**   

    npm install

3. **Configure Environment Variables**  

    DATABASE_URL="" <br/>
    USERPOOL_ID=""
    CLIENT_ID=""
    ACCESS_KEY_ID=""
    SECRET_KEY_ID=""
    REGION=""
    SALT_ROUND=10
    GMAIL_CLIENT_ID =""
    GMAIL_CLIENT_SECRET =""
    GMAIL_REDIRECT_URI =""
    GMAIL_SCOPE =""

4. **Run Database Migrations**    

    npx prisma init
    npx prisma migrate dev --name init
    any time you make changes to schema run : npx prisma generate

4. **Start the Server**

    npm start


    



