import  UserModel  from '../schemas/user.schema';
import {IUser} from "../models/user.model";
import PasswordService from "../services/password.service";

class UserService {
    public async createNewOrUpdate(user: IUser) {
        console.log(user)
        try {
            if (!user._id) {
                const dataModel = new UserModel(user);
                return await dataModel.save();
            } else {
                return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async getByEmailOrName(name: string) {
        try {
            const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
            if (result) {
                return result;
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }


    public async resetFailedLoginAttempts(userId: string) {
        try {
            return await UserModel.findByIdAndUpdate(userId, { $set: { failedLoginAttempts: 0, lockUntil: null } }, { new: true });
        } catch (error) {
            console.error('Error resetting failed login attempts:', error);
            throw new Error('Error resetting failed login attempts');
        }
    }

    public async incrementFailedLoginAttempts(userId: string) {
        try {
            return await UserModel.findByIdAndUpdate(userId, { $inc: { failedLoginAttempts: 1 } }, { new: true });
        } catch (error) {
            console.error('Error incrementing failed login attempts:', error);
            throw new Error('Error incrementing failed login attempts');
        }
    }
}

export default UserService;