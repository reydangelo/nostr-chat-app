import { schnorr } from "@noble/curves/secp256k1";
import * as utils from './utils.js';

const RELAY_URL = 'wss://nostrue.com'     // can be replaced with other relay urls

export function register(name, bio, picture){
    try {
        const [privKey, pubKey] = utils.generateKeyPair()
        const registerEvent = utils.createEvent(privKey, pubKey, 0, [], JSON.stringify({
            name: name,
            about: bio,
            picture: picture
        }))

        const relay = new WebSocket(RELAY_URL)            

        relay.on('open', ()=> {
            relay.send(JSON.stringify(['EVENT', registerEvent]))    // sends the register event to the relay
        })
        relay.on('message', (message) => {
            const msg = JSON.parse(message)
            if (msg[0] == 'OK' && msg[1] == registerEvent.id && msg[2] == true){        // check whether the relay accepts or denies the event 
                relay.close()
                return true
            } else {
                relay.close()
                return false
            }
        })

        return true; 
    } catch(err) {
        console.error(err)
        return false;
    }
    
}

export function login(privKey, pubKey){
    try{
        const loginEvent = utils.createEvent(privKey, pubKey, 22219, [], "Logged In")       
        const relay = new WebSocket(RELAY_URL)
        
        relay.on('open', () => {
            relay.send(JSON.stringify(['EVENT', loginEvent]))
        })
        
        relay.on('message', (message) => {
            const msg = JSON.parse(message)
            if (msg[0] == 'OK' && msg[1] == loginEvent.id && msg[2] == true){
                return true;
            } else {
                return false
            }
        })
    }   catch (err) {
        console.error(err)
        return false
    }
    
}