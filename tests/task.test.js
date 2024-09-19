const request = require('supertest');
const app = require('../src/app');
const { env } = require("../src/constant/environment");
const {
    CognitoIdentityProviderClient,
    AdminDeleteUserCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const mockSignupPayload = {
    username: 'testuser@yopmail.com',
    password: 'Test@123',
};

const cognitoClient = new CognitoIdentityProviderClient({
    region: env.REGION,
    credentials: {
        accessKeyId: env.ACCESS_KEY_ID,
        secretAccessKey: env.SECRET_KEY_ID,
    },
});


async function deleteUserFromCognito(username) {
    try {
        const input = { // AdminDeleteUserRequest
            UserPoolId: env.USERPOOL_ID,
            Username: username,
        };
        const command = new AdminDeleteUserCommand(input);
        await cognitoClient.send(command);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function cleanupPrismaUser(username) {
    await prisma.user.deleteMany({
        where: { username },
    });
}


let token;
let taskId;

describe('User Authentication and Task Module Testing', () => {

    beforeAll(async () => {

        await deleteUserFromCognito(mockSignupPayload.username);
        await cleanupPrismaUser(mockSignupPayload.username);
        // Sign up using the mock payload
        const response = await request(app)
            .post('/auth/signup')
            .send(mockSignupPayload);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User signed up successfully.");
    });

    afterAll(async () => {
        await deleteUserFromCognito(mockSignupPayload.username);
        await cleanupPrismaUser(mockSignupPayload.username);
        await prisma.$disconnect();
    });

    it('should log in and return a token', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send(mockSignupPayload);

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        token = response.body.accessToken; // Store the token for later use
    });

    it('should return 401 for /tasks without token', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(401);
    });

    it('should return 200 for /tasks with valid token', async () => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', token);

        expect(response.status).toBe(200);
    });

    it('should add a task with valid token', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', token)
            .send({ title: "test", description: "test description 1" });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('test');
        taskId = response.body.id;
    });

    it('should update a task with valid token', async () => {
        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .set('Authorization', token)
            .send({ title: 'Updated task 1', description: "test description 1" });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated task 1');
    });

    it('should delete a task with valid token', async () => {
        const response = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', token);

        expect(response.status).toBe(200); // No content
    });

});