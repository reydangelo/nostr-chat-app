import crypto from 'node:crypto';
import { schnorr } from "@noble/curves/secp256k1";
import * as secp from '@noble/secp256k1'

export function eventIdAndSig(event, privateKey){
    const eventStr = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
    const eventHash = crypto.createHash('sha256').update(eventStr).digest();

    const eventId = eventHash.toString('hex');
    const eventSig = Buffer.from(schnorr.sign(eventHash.toString('hex'), privateKey)).toString('hex');
    return {id: eventId, sig: eventSig};
}

export function createSharedSecret(myPrivKey, theirPubKey){
    const sharedPoint = secp.getSharedSecret(myPrivKey, '02' + theirPubKey)
    const sharedX = sharedPoint.slice(1, 33)

    const iv = crypto.randomFillSync(new Uint8Array(16))
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sharedX), iv)
    return {cipher: cipher, iv: iv}
}

export function generateKeyPair(){
    const privKey = Buffer.from(schnorr.utils.randomPrivateKey()).toString('hex');
    const pubKey = Buffer.from(schnorr.getPublicKey(privKey)).toString('hex')
    return {privateKey : privKey, publicKey: pubKey}
}

export function createEvent(privKey, pubKey, kind, tags, content){
        const event = {
            pubkey: pubKey,
            created_at: Math.floor(Date.now() / 1000),
            kind : kind,
            tags: tags,
            content: content
        }

        const sigAndId = eventIdAndSig(event, privKey)
        event.id = sigAndId.id
        event.sig = sigAndId.sig

        return event
        
}