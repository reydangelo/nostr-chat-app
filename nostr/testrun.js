import { schnorr } from '@noble/curves/secp256k1';
import WebSocket from 'ws';
import crypto from 'node:crypto';


const secp = schnorr;

const sk = secp.utils.randomPrivateKey();
const pk = secp.getPublicKey(sk);


const privkey = Buffer.from(sk).toString('hex');
const pubkey = Buffer.from(secp.getPublicKey(sk)).toString('hex');

console.log(`Private Key: ${privkey} \nPublic Key: ${pubkey}`)



const event = {
    pubkey: pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind: 1,
    tags: [],
    content: 'Hello NOSTR!'
}
const eventStr = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
const eventHash = crypto.createHash('sha256').update(eventStr).digest();
const eventId = eventHash.toString('hex');
const eventSig = Buffer.from(secp.sign(eventHash.toString('hex'), sk)).toString('hex');

event.id = eventId
event.sig = eventSig

const relay = new WebSocket('wss://nostrue.com');

relay.on('open', () => {
    console.log('Connected to Nostr!')
    relay.send(JSON.stringify(['EVENT', event]))
})

relay.on('message', (msg) => {
    console.log(JSON.parse(msg))
})

relay.on('close', () => {
    console.log('Connection closed.')
})

