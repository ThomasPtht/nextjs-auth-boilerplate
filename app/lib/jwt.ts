import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET 
const REFRESH_SECRET = process.env.REFRESH_SECRET

// Ensure that the secrets are defined at runtime
export function generateAccessToken(userId: string) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' })
}

// Generate a refresh token with a longer expiration time
export function generateRefreshToken(userId: string) {
  if (!REFRESH_SECRET) {
    throw new Error('REFRESH_TOKEN is not defined')
  }
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' }) 
}

// Verify the access token and return the decoded payload
export function verifyAccessToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
    return jwt.verify(token, JWT_SECRET) as { userId: string }
}

// Verify the refresh token and return the decoded payload
export function verifyRefreshToken(token: string) {
  if (!REFRESH_SECRET) {
    throw new Error('REFRESH_TOKEN is not defined')
  }
    return jwt.verify(token, REFRESH_SECRET) as { userId: string }
}