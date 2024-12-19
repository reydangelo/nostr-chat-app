


const pubKey1 = 'c9432e538b6d8b25f937f043feae2d31529cd90a4cf6ea4dfeef5c4baae1e804';
const privKey1 = '2b9fb2408b5fe1b83b488cea82c9a3ca58e11ac6d92072a16d7145ef0e167da5';

const pubKey2 = '033aa749ffd5545daf26fc78289b2636a306db3b631cd934017d29041824dddd'
const privKey2 = 'b9eaa1f3e4a44485ea115ece40805dec954f1c89b2ba3bb64ae5f9965a4ffcf1'





const message = 'THIS IS A TEST MESSAGE'

const encryptedMessage = encryptMessage(message, privKey1, pubKey2)

console.log(`Encrypted Messagae: ${encryptedMessage}`)

const decryptedMessage = decryptMessage(encryptedMessage, privKey2, pubKey1)

console.log(`Decrypted Message: ${decryptedMessage}`)



