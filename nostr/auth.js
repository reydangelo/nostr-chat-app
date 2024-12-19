import { schnorr } from "@noble/curves/secp256k1";
import * as utils from './utils.js'

export function register(name, bio, picture){
    try {
    const [privKey, pubKey] = utils.generateKeyPair()
    const registerEvent = {
        pubkey: pubKey,
        created_at: Math.floor(new Date.now() / 1000),
        kind: 0,
        tags: [],
        content: JSON.stringify({
            name: name,
            about: bio,
            picture: picture
        })
    }
    const eventSigAndId = utils.eventIdAndSig(registerEvent, privKey)
    registerEvent.id = eventSigAndId.id
    registerEvent.sig = eventSigAndId.sig

    return true } catch(err) {
        console.log(err)
    }
    
}