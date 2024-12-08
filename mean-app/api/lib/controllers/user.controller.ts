import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();
    private tokenService = new TokenService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);

        this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);

        this.router.patch(`${this.path}/change-password`, this.changePassword);

    }



    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const { login, password } = request.body;
        const maxLoginAttempts = 5;
        const lockDuration = 10 * 60 * 1000;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
                const lockTimeRemaining = user.lockUntil.getTime() - Date.now();
                return response.status(403).json({ error: `Account locked. Try again in ${Math.ceil(lockTimeRemaining / 1000)} seconds.` });
            }

            if (user.failedLoginAttempts >= maxLoginAttempts) {
                await this.userService.resetFailedLoginAttempts(user._id);
            }

            const isPasswordValid = await this.passwordService.authorize(user.id, password);

            if (isPasswordValid) {
                await this.userService.resetFailedLoginAttempts(user._id);

                const token = await this.tokenService.create(user);
                return response.status(200).json(this.tokenService.getToken(token));
            } else {
                const updatedUser = await this.userService.incrementFailedLoginAttempts(user._id);

                if (updatedUser.failedLoginAttempts >= maxLoginAttempts) {
                    updatedUser.lockUntil = new Date(Date.now() + lockDuration);
                    await updatedUser.save();
                    return response.status(403).json({ error: 'Maximum login attempts exceeded. Account is locked for 10 minutes.' });
                }

                return response.status(401).json({ error: 'Unauthorized' });
            }
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({ error: 'Unauthorized' });
        }
    };


    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword
                });
            }
            response.status(200).json(user);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }

    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const {userId} = request.params
        try {
            const result = await this.tokenService.remove(userId);
            response.status(200).send(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };

    private changePassword = async (request: Request, response: Response, next: NextFunction) => {
        const { login, password, newPassword } = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            const result = await this.passwordService.changePassword(user._id, password, newPassword);
            response.status(200).json(result);
        } catch (error) {
            console.error(`Error changing password: ${error.message}`);
            response.status(400).json({ error: error.message });
        }
    };
}

export default UserController;