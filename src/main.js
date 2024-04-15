const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
function readAvatars() {
    try {
        const avatarsData = fs.readFileSync('avatars.json', 'utf8');
        return JSON.parse(avatarsData);
    } catch (err) {
        console.error('Error reading avatars file:', err);
        return [];
    }
}
function writeAvatars(avatars) {
    try {
        fs.writeFileSync('avatars.json', JSON.stringify(avatars, null, 2));
    } catch (err) {
        console.error('Error writing avatars file:', err);
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/create-avatar', (req, res) => {
    const { avatarName, age, skinColor, hairstyle, headShape, upperClothing, lowerClothing } = req.body;
    const id = Date.now();
    const createdAt = new Date().toISOString();
    const newAvatar = {
        id,
        characterName: avatarName,
        childAge: parseInt(age),
        skinColor,
        hairstyle,
        headShape,
        upperClothing,
        lowerClothing,
        createdAt
    };

    let avatars = readAvatars();
    avatars.push(newAvatar);
    writeAvatars(avatars);

    res.send('Avatar Created!');
});

app.get('/avatars', (req, res) => {
    const avatars = readAvatars();

    let html = '<h1>Avatars</h1><ul>';
    avatars.forEach(avatar => {
        html += `<li><a href="/avatar/${avatar.id}">${avatar.characterName}</a></li>`;
    });
    html += '</ul>';
    res.send(html);
});

app.get('/avatar/:id', (req, res) => {
    const id = req.params.id;
    const avatars = readAvatars();
    const avatar = avatars.find(av => av.id == id);

    if (avatar) {
        res.send(`<h1>${avatar.characterName}</h1>
                  <table>
                      <tr><td>ID:</td><td>${avatar.id}</td></tr>
                      <tr><td>Character Name:</td><td>${avatar.characterName}</td></tr>
                      <tr><td>Child Age:</td><td>${avatar.childAge}</td></tr>
                      <tr><td>Skin Color:</td><td>${avatar.skinColor}</td></tr>
                      <tr><td>Hairstyle:</td><td>${avatar.hairstyle}</td></tr>
                      <tr><td>Head Shape:</td><td>${avatar.headShape}</td></tr>
                      <tr><td>Upper Clothing:</td><td>${avatar.upperClothing}</td></tr>
                      <tr><td>Lower Clothing:</td><td>${avatar.lowerClothing}</td></tr>
                      <tr><td>Created At:</td><td>${avatar.createdAt}</td></tr>
                  </table>`);
    } else {
        res.send('Avatar not found');
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
