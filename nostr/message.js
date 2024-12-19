import * as secp from '@noble/secp256k1'
import crypto from 'node:crypto'
import { deflate } from 'node:zlib'


function encryptMessage(message, myPrivKey, theirPubKey){

    const sharedPoint = secp.getSharedSecret(myPrivKey, '02' + theirPubKey)
    const sharedX = sharedPoint.slice(1, 33)
    const iv = crypto.randomFillSync(new Uint8Array(16))
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(sharedX), iv)

    let encryptMessage = cipher.update(message, 'utf-8', 'base64')
    encryptMessage += cipher.final('base64')

    const authTag = cipher.getAuthTag();
    
    const ivBase64 = Buffer.from(iv.buffer).toString('base64');
    const authTagBase64 = Buffer.from(authTag).toString('base64');

    const content = encryptMessage + '?iv=' + ivBase64 + '?tag=' + authTagBase64
    
    return content
}

function decryptMessage(message, myPrivKey, theirPubKey){

    const [encryptedMessage, ivPart, authTagPart] = message.split('?');

    const ivBase64 = ivPart.split('=')[1]
    const authTagBase64 = authTagPart.split('=')[1]
    
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    const sharedPoint = secp.getSharedSecret(myPrivKey, '02' + theirPubKey);
    const sharedX = sharedPoint.slice(1, 33);

    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(sharedX), iv);
    decipher.setAuthTag(authTag)

    let decryptedMessage = decipher.update(encryptedMessage, 'base64', 'utf-8')
    decryptedMessage += decipher.final('utf-8')

    return decryptedMessage
}

export default function send_message(){
    
}