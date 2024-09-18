# Bible Project

This code implements AWS Cognito for user registration and login, offering secure authentication via a backend API built with Node.js and the Express framework. It includes a simple cron job to handle scheduled task updates and integrates the Gmail API for seamless email synchronization. Currently, the system supports a single user by saving the token stored in a file, but it can be easily scaled to support multiple users by using a database with encrypted token storage for enhanced security and management.

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
