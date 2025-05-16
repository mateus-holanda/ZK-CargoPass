import crypto from "crypto"

const getKeyIV = (secret: string, salt: string) => {
  const result = crypto
    .createHmac('sha256', Buffer.from(`${secret}${salt}`))
    .update('json')
    .digest('hex')
    .substring(0, 48)

  const [key, iv] = result.split(/(?<=^.{32})/)
  return { key, iv }
}

export const encrypt = (text: string, secret: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const { key, iv } = getKeyIV(secret, salt)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]).toString('hex')
  return { salt, encryptedData }
}

export const decrypt = (text: string, secret: string, salt: string) => {
  try {
    const { key, iv } = getKeyIV(secret, salt)
    const encryptedText = Buffer.from(text, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    const decrypted = decipher.update(encryptedText)
    return Buffer.concat([decrypted, decipher.final()]).toString()
  } catch {
    throw new Error('bad decrypt')
  }
}

export const encryptMD5 = (text: string) => crypto.createHash('md5').update(text).digest('hex')

export const encryptSHA256 = (text: string, salt: string) =>
  crypto.createHmac('sha256', salt).update(text).digest('hex')
