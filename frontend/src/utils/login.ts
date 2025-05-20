import CryptoJS from 'crypto-js';
import { User } from '../types/user.dto';

const SECRET_KEY = 'secretKey'

export const encryptUser = (user: User): string => {
    const userJson = JSON.stringify(user)
    const encryptedUser = CryptoJS.AES.encrypt(userJson, SECRET_KEY).toString();
    return encryptedUser;
}

export const decryptUser = (encryptedUser: string): User | false => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const decryptedUserJson = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedUserJson) {
            return false;
        }
        const user: User = JSON.parse(decryptedUserJson);
        return user;
    } catch (error) {
        return false;
    }
}