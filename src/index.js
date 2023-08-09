const express = require('express');
const app = express();
const userSchema = require('./mongo.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
const templatePath = path.join(__dirname, '../templates/');
const publicPath = path.join(__dirname, '../public/');
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));
const SECRET_KEY = 'ThisIsATokenStringJWTandHaveMoreThan32Characters'

async function hashPass(password) {
    const result = await bcryptjs.hash(password, 10);
    return result;
}
async function comparePass(userPass, hashPass) {
    const result = await bcryptjs.compare(userPass, hashPass);
    return result;
}


app.get('/', (req, res) => {
    if (req.cookies.jwt) {
        const verify = jwt.verify(req.cookies.jwt, SECRET_KEY);
        res.render('home.hbs', { name: verify.name });
    } else {
        res.render('login.hbs');
    }
});
app.get('/signup', (req, res) => {
    res.render('signup.hbs');
});


app.post('/signup', async (req, res) => {
    try {
        const check = await userSchema.findOne({ name: req.body.name });
        if (check) {
            res.send('user already exists...');
        }
        else {
            const token = jwt.sign({ name: req.body.name }, SECRET_KEY);
            res.cookie('jwt', token, {
                maxAge: 600000,
                httpOnly: true
            });
            const data = {
                name: req.body.name,
                password: await hashPass(req.body.password),
                token: token
            }
            await userSchema.insertMany([data]);
            res.render('home.hbs', { name: req.body.name });
        }
    } catch {
        res.send('wrong details...');
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await userSchema.findOne({ name: req.body.name });
        const passCheck = await comparePass(req.body.password, check.password);
        if (check && passCheck) {
            res.cookie('jwt', check.token, {
                maxAge: 600000,
                httpOnly: true
            });
            res.render('home.hbs', { name: req.body.name });
        } else {
            res.send('wrong details')
        }
    } catch {

    }
});


app.listen(5000, () => {
    console.log('connected...');
})