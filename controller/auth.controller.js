const jwt = require("jsonwebtoken");
const { ComparePassword, HashPassword } = require("../helper/passwd.helper");
const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const listTokens = [];

async function Register(req, res, next) {
    const { userid, username, password, email, namalengkap, alamat, role } =
        req.body;

    const hashPass = await HashPassword(password);
    console.log(hashPass);

    // const payload = {
    //     name,
    //     email,
    //     password: hashPass,
    // };

    try {
        const checkUser = await prisma.Users.findUnique({
            where: {
                email,
            },
        });

        if (role == "petugas") {
            let respons = ResponseTemplate(
                null,
                "petugas can't register",
                null,
                400,
            );
            res.status(400).json(respons);
            return;
        }

        if (checkUser) {
            let respons = ResponseTemplate(
                null,
                "email already used",
                null,
                400,
            );
            res.status(400).json(respons);
            return;
        }

        if (password.length < 8) {
            let respons = ResponseTemplate(
                null,
                "password minimum 8 character",
                null,
                400,
            );
            res.status(400).json(respons);
            return;
        }

        await prisma.Users.create({
            data: {
                userid,
                username,
                password: hashPass,
                email,
                namalengkap,
                alamat,
                role,
            },
        });

        let respons = ResponseTemplate(null, "created success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        next(error);
    }
}

async function Login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            let respons = ResponseTemplate(
                null,
                "bad request",
                "invalid email or password",
                400,
            );
            res.status(400).json(respons);
            return;
        }

        let checkPassword = await ComparePassword(password, user.password);

        if (!checkPassword) {
            let respons = ResponseTemplate(
                null,
                "bad request",
                "invalid email or password",
                400,
            );
            res.status(400).json(respons);
            return;
        }

        let token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.SECRET_KEY,
        );
        // console.log(user)

        let respons = ResponseTemplate({ token }, "success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        next(error);
    }
}

function whoami(req, res) {
    // console.log(`listTokens dari whoami ${listTokens}`)
    let respons = ResponseTemplate({ user: req.user }, "success", null, 200);
    res.status(200).json(respons);
    return;
}

function logout(req, res) {
    const token = req.headers.authorization;
    if (token) {
        listTokens.push(token);
        res.status(200).json({ message: "Logout successful" });
    } else {
        res.status(400).json({ message: "Token not provided" });
    }
    // console.log(listTokens)

    return;
}

module.exports = {
    Register,
    Login,
    whoami,
    logout,
    listTokens,
};
