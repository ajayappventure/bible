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
    USERPOOL_ID="" <br/>
    CLIENT_ID="" <br/>
    ACCESS_KEY_ID="" <br/>
    SECRET_KEY_ID="" <br/>
    REGION="" <br/>
    SALT_ROUND=10 <br/>
    GMAIL_CLIENT_ID ="" <br/>
    GMAIL_CLIENT_SECRET ="" <br/>
    GMAIL_REDIRECT_URI ="" <br/>
    GMAIL_SCOPE ="" <br/>

4. **Run Database Migrations**

    npx prisma init <br/>
    npx prisma migrate dev --name init <br/>
    any time you make changes to schema run : npx prisma generate <br/>

5. **Start the Server**

   npm start
