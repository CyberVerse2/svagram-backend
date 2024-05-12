import { randomBytes } from 'crypto'
import { compare, hash } from 'bcrypt'
// import { ENVIRONMENT } from "../config/environment.js";
import jwt from 'jsonwebtoken'
import { log } from 'console'
// import { ValidationError, validate } from "class-validator";
// import AppError from "./appError.js";

/**
 * Generates a random string of the specified length.
 *
 * @param {number} length - The length of the random string to generate.
 * @return {string} - The generated random string.
 */
export function generateRandomString(length) {
    return randomBytes(length).toString('hex')
}

export const hashData = async (data) => {
    const hashedData = await hash(data, 10)
    return hashedData
}

export const compareData = async (data, hashedData) => {
    const isValid = await compare(data, hashedData)
    return isValid
}

export const signData = (data, secret) => {
    return jwt.sign({ ...data }, secret)
}

export const decodeData = (token, secret) => {
    return jwt.verify(token, secret)
}

export const setCookie = (res, name, value, options = {}) => {
    res.cookie(name, value, {
        httpOnly: false,
        secure: true,
        path: '/',
        sameSite: 'none',
        ...options,
    })
}

export const generateTeamCode = function () {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = []
    for (let i = 0; i <= 6; i++) {
        const letter = letters[Math.floor(Math.random() * letters.length)]
        code.push(letter)
    }
    return code.join('')
}

export function removeBackticks(text) {
    console.log(text)
    if (!text) {
        return text // Handle empty string case
    }

    const trimmedText = text.trim() // Remove leading/trailing whitespace

    // Check if the trimmed string starts with "json" followed by a space

    if (trimmedText.startsWith('`') && trimmedText.endsWith('`')) {
        console.log(true)
        console.log(text)
        const cleanedJson = trimmedText
            .replace(/```json\n/i, '')
            .replace(/\n```$/i, '')
        return cleanedJson
    } else {
        console.log(false)
        return text
    }
}
