import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function hashPassword(password: string) {
    if(!password) {
        throw new Error('Password is required')
    }
    return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}

export function generateToken() {
    return crypto.randomBytes(32).toString('hex')
}