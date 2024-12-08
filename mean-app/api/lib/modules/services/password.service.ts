import PasswordModel  from '../schemas/password.schema';
import bcrypt from 'bcrypt';

class PasswordService {
    public async createOrUpdate(data: any) {
        const result = await PasswordModel.findOneAndUpdate({ userId: data.userId }, { $set: { password: data.password } }, { new: true });
        if (!result) {
            const dataModel = new PasswordModel({ userId: data.userId, password: data.password });
            return await dataModel.save();
        }
        return result;
    }

    public async authorize(userId: string, password: string) {
        try {
            const result = await PasswordModel.findOne({ userId: userId });
            if (result) {
                const isPasswordValid = await bcrypt.compare(password, result.password);
                return isPasswordValid;
            }
            return false;
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }

    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('hash', hashedPassword)
        return hashedPassword;
    }

    public async changePassword(userId: string, password: string, newPassword: string) {
        try {
            const userPasswordRecord = await PasswordModel.findOne({ userId });
            if (!userPasswordRecord) {
                throw new Error('User password record not found');
            }

            const isPasswordValid = await bcrypt.compare(password, userPasswordRecord.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            const hashedNewPassword = await this.hashPassword(newPassword);

            userPasswordRecord.password = hashedNewPassword;
            await userPasswordRecord.save();

            return { message: 'Password updated successfully' };
        } catch (error) {
            console.error(`Error changing password: ${error.message}`);
            throw new Error(error.message);
        }
    }

}

export default PasswordService;
