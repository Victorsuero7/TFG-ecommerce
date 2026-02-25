import { HttpErrors } from "../utils/HttpErrors";
import { RefreshToken } from "../Models/RefreshToken";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { generateToken } from "../utils/RefreshTokenGenerator";
import { User } from "../Models/user.entity";
import { UserServiceImpl } from "./UserServiceImpl";
import { JWTAdapter } from "../utils/Jwt";

export class RefreshTokenServiceImpl implements RefreshTokenServiceImpl {
    private readonly repo: RefreshTokenRepository;
    private readonly userService: UserServiceImpl;
    constructor(repo: RefreshTokenRepository, userService: UserServiceImpl) {
        this.repo = repo;
        this.userService = userService;
    }

    async getById(tk: string): Promise<RefreshToken | null> {
        try {
            const token = await this.repo.getToken(tk)
            if (!token) throw HttpErrors.NotFound
            return token
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async insert(token: RefreshToken): Promise<RefreshToken> {
        try {
            return await this.repo.save(token)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async invalidate(token: RefreshToken): Promise<RefreshToken> {
        try {
            token.enabled = false
            return await this.repo.save(token)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async validateToken(token: RefreshToken): Promise<boolean> {
        try {
            if (token.enabled != true || token.validUntil < new Date()) return false
            return true
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async createToken(forUserId: number): Promise<RefreshToken> {
        try {
            const token = new RefreshToken()
            token.enabled = true
            token.user = { id: forUserId } as User
            token.token = await generateToken()
            return token
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async refreshAccess(tk: string): Promise<{ jwt: string, refresh: string }> {
        try {
            let newAccessToken
            let newRefreshToken
            let invalidateCurrentToken
            const refreshToken = await this.repo.getToken(tk)
            if (!refreshToken) throw HttpErrors.NotFound()
            const isValid = await this.validateToken(refreshToken)
            if (!isValid) throw HttpErrors.forbidden("Invalid Token")
            const user = await this.userService.getOne(refreshToken.user.id)
            if (!newAccessToken) throw HttpErrors.NotFound("User not found")
            newAccessToken = await JWTAdapter.generateToken({ id: user!.id, name: user!.name, role: user!.role }, '2h')
            if (!newAccessToken) throw HttpErrors.internalServerError("Token generation failure")
            newRefreshToken = await this.createToken(user!.id)
            invalidateCurrentToken = await this.invalidate(refreshToken)
            if (!newRefreshToken || !invalidateCurrentToken) throw HttpErrors.internalServerError("Token invalidation failure")

            return { jwt: newAccessToken, refresh: newRefreshToken.token }
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}