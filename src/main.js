import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the path to avatars.json
const avatarsFilePath = path.join(__dirname, 'avatars.json');

// Create the Express app
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Use JSON middleware to parse incoming JSON data
app.use(express.json());

// API endpoint to create a new avatar and redirect to the detail page
app.post('/api/avatars', (req, res) => {
    const { avatarName, childAge, skinColor, hairstyle, headShape, upperClothing, lowerClothing } = req.body;

    // Create a new avatar object
    const newAvatar = {
        id: uuidv4(),
        avatarName,
        childAge,
        skinColor,
        hairstyle,
        headShape,
        upperClothing,
        lowerClothing,
        createdAt: new Date().toISOString(),
    };

    // Read the existing avatars from avatars.json
    let avatars = [];
    if (fs.existsSync(avatarsFilePath)) {
        const data = fs.readFileSync(avatarsFilePath, 'utf8');
        avatars = JSON.parse(data);
    }

    // Add the new avatar to the list
    avatars.push(newAvatar);

    // Save the updated avatars list back to avatars.json
    fs.writeFileSync(avatarsFilePath, JSON.stringify(avatars, null, 2));

    // Redirect the user to the detail page of the newly created avatar
    res.status(201)
        .header('Location', `/avatar/${newAvatar.id}`)
        .json(newAvatar);
});

// API endpoint to get all avatars
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: path.join(__dirname) });
});

app.get('/api/avatars', (req, res) => {
    // Read the existing avatars from avatars.json
    let avatars = [];
    if (fs.existsSync(avatarsFilePath)) {
        const data = fs.readFileSync(avatarsFilePath, 'utf8');
        avatars = JSON.parse(data);
    }

    // Send the avatars as JSON
    res.json(avatars);
});

// API endpoint to get a single avatar by ID
app.get('/api/avatars/:id', (req, res) => {
    const avatarId = req.params.id;

    // Read the existing avatars from avatars.json
    let avatars = [];
    if (fs.existsSync(avatarsFilePath)) {
        const data = fs.readFileSync(avatarsFilePath, 'utf8');
        avatars = JSON.parse(data);
    }

    // Find the avatar with the given ID
    const avatar = avatars.find(av => av.id === avatarId);

    if (!avatar) {
        res.status(404).send('Avatar not found');
        return;
    }

    // Send the avatar as JSON
    res.json(avatar);
});

// Serve the newly created avatar detail page
app.get('/avatar/:id', (req, res) => {
    const avatarId = req.params.id;

    // Read the existing avatars from avatars.json
    let avatars = [];
    if (fs.existsSync(avatarsFilePath)) {
        const data = fs.readFileSync(avatarsFilePath, 'utf8');
        avatars = JSON.parse(data);
    }

    // Find the avatar with the given ID
    const avatar = avatars.find(av => av.id === avatarId);

    if (!avatar) {
        res.status(404).send('Avatar not found');
        return;
    }

    // Serve the HTML page displaying the avatar details
    res.send(`
        <h1>Avatar Created!</h1>
        <p>Name: ${avatar.avatarName}</p>
        <p>Age: ${avatar.childAge}</p>
        <p>Skin Color: ${avatar.skinColor}</p>
        <p>Hairstyle: ${avatar.hairstyle}</p>
        <p>Head Shape: ${avatar.headShape}</p>
        <p>Upper Clothing: ${avatar.upperClothing}</p>
        <p>Lower Clothing: ${avatar.lowerClothing}</p>
        <p>Created At: ${avatar.createdAt}</p>
    `);
});

// API endpoint to update an avatar by ID
app.put('/api/avatars/:id', (req, res) => {
    const avatarId = req.params.id;

    // Read the existing avatars from avatars.json
    let avatars = [];
    if (fs.existsSync(avatarsFilePath)) {
        const data = fs.readFileSync(avatarsFilePath, 'utf8');
        avatars = JSON.parse(data);
    }

    // Find the avatar with the given ID
    const avatarIndex = avatars.findIndex(av => av.id === avatarId);

    if (avatarIndex === -1) {
        res.status(404).send('Avatar not found');
        return;
    }

    // Update the avatar with new data from the request body
    avatars[avatarIndex] = {
        ...avatars[avatarIndex],
        ...req.body,
    };

    // Save the updated avatars list back to avatars.json
    fs.writeFileSync(avatarsFilePath, JSON.stringify(avatars, null, 2));

    res.status(204).send();
});

// API endpoint to delete an avatar by ID
app.delete('/api/avatars/:id', (req, res) => {
    const avatarId = req.params.id;

    // Read the existing avatars from avatars.json
    let avatars = [];
    if (fs.existsSync(avatarsFilePath)) {
        const data = fs.readFileSync(avatarsFilePath, 'utf8');
        avatars = JSON.parse(data);
    }

    // Find the avatar with the given ID
    const avatarIndex = avatars.findIndex(av => av.id === avatarId);

    if (avatarIndex === -1) {
        res.status(404).send('Avatar not found');
        return;
    }

    // Remove the avatar from the list
    avatars.splice(avatarIndex, 1);

    // Save the updated avatars list back to avatars.json
    fs.writeFileSync(avatarsFilePath, JSON.stringify(avatars, null, 2));

    res.status(204).send();
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
