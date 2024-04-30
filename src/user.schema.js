import express from 'express';
import fs from 'fs';
import path from 'path';
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';
import userSchema from './user.schema.js';
import {isParent, isAdmin} from './roles.js'; // Import role-based authorization functions

const app = express();

// File paths
const user_file = path.join(process.cwd(), 'users.json');
if (!fs.existsSync(user_file)) {
    fs.writeFileSync(user_file, JSON.stringify([]));
}

app.use(express.json()); // Parse incoming JSON requests

// POST /api/users endpoint for creating a new user
app.post('/api/users', async (req, res) => {
    console.log("POST /api/users");

    // Validate the user data from the request body
    const { error, value } = userSchema.validate(req.body);

    if (error) {
        res.status(400).json({ error: error.details });
        return;
    }

    try {
        // Read the existing users from the users.json file
        const data = fs.readFileSync(user_file, 'utf8');
        const users = JSON.parse(data);

        // Check if the username already exists
        const existingUser = users.find(user => user.userName === value.userName);
        if (existingUser) {
            res.status(409).json({ error: 'Username already exists' });
            return;
        }

        // Hash the provided password
        const hashedPassword = await bcrypt.hash(value.password, 10);

        // Create a new user object
        const newUser = {
            id: uuid(),
            userName: value.userName,
            password: hashedPassword,
            role: value.role,
            createdAt: new Date().toISOString(),
        };

        // Append the new user to the list of users
        users.push(newUser);

        // Write the updated users list back to the users.json file
        fs.writeFileSync(user_file, JSON.stringify(users));

        // Return the created user object
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the app
export default app;
