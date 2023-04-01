import * as DataStore from "nedb"
import * as crypto from "crypto"
import { DATABASE_LOCATION, NEDB_ENCRYPTION_SECRET } from "../config";

const NEDB_ENCRYPTION_KEY = crypto.createHash("sha512")
    .update(NEDB_ENCRYPTION_SECRET)
    .digest("base64")
    .substr(0, 32)

export const UsersStore = new DataStore({
    filename: `${DATABASE_LOCATION}/Users.db`,
    autoload: true,
    afterSerialization: plaintext => {
        const iv = crypto.randomBytes(16)
        const aes = crypto.createCipheriv("aes-256-cbc", NEDB_ENCRYPTION_KEY, iv)
        let ciphertext = aes.update(plaintext)
        ciphertext = Buffer.concat([iv, ciphertext, aes.final()])
        return ciphertext.toString('base64')
    },
    beforeDeserialization: ciphertext => {
        const ciphertextBytes = Buffer.from(ciphertext, 'base64')
        const iv = ciphertextBytes.slice(0, 16)
        const data = ciphertextBytes.slice(16)
        const aes = crypto.createDecipheriv("aes-256-cbc", NEDB_ENCRYPTION_KEY, iv)
        let plaintextBytes = Buffer.from(aes.update(data))
        plaintextBytes = Buffer.concat([plaintextBytes, aes.final()])
        return plaintextBytes.toString()
    }
})
