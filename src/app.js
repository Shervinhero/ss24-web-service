import express from "express"
import path from 'path';
import {fileURLToPath} from 'url';
import * as fs from "fs";

import passport from 'passport'
import {BasicStrategy} from 'passport-http';
import bcrypt from "bcrypt";
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'

import avatarsRouter from "./routers/avatars/avatars.router.js";
import usersRouter from "./routers/users/users.router.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDirectory= path.join(__dirname,'public');

// create the data file in current working directory (cwd) if it does not yet exist

const user_file = path.join(process.cwd(), 'users.json');
if (!fs.existsSync(user_file)) {
    fs.writeFileSync(user_file, JSON.stringify([]))
}


const app = express()

passport.use(new BasicStrategy(
    async function (userid, password, done) {
        try {
            const users = JSON.parse(fs.readFileSync(user_file, 'utf8'))
            const user = users.find(user => user.userName === userid);
            if (user) {
                const isCorrect = await bcrypt.compare(password, user.password);
                if (isCorrect) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    }
));


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'my-secret';

passport.use(new JwtStrategy(opts,
    function(jwtPayload, done) {
        done(null, {
            userName: jwtPayload.subject,
            name: jwtPayload.name,
            roles: jwtPayload.roles
        })
    }
));

app.use(express.static(publicDirectory))
app.use(express.json())

app.get('/', function (req, res) {
    res.sendFile(`index.html`)
})
app.get('/avatars', function (req, res) {
    res.sendFile(path.join(publicDirectory, './avatars.html'));
})
app.use('/', usersRouter);
app.use('/', avatarsRouter);

export default app;