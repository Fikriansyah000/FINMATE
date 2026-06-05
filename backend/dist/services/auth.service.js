"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async register(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw { statusCode: 400, message: 'Email already in use' };
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: hashedPassword,
            },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }
    static async login(data) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        const isMatch = await (0, password_1.comparePassword)(data.password, user.passwordHash);
        if (!isMatch) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        const expiresIn = data.rememberMe ? '30d' : '1d';
        const token = (0, jwt_1.generateToken)(user.id, expiresIn);
        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }
}
exports.AuthService = AuthService;
