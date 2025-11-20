import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore";

export default function () {

    const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVER as string)

    if (getApps().length === 0) {
        initializeApp({
            credential: cert(firebaseConfig),
        });
    }
    const $db = getFirestore();
    const $auth = getAuth();

    async function isLoggedIn(token: string | undefined) {
        const isLoggedIn: false | DecodedIdToken = false;
        if (!token) {
            return isLoggedIn
        }

        return await $auth.verifySessionCookie(token)
            .then((decodedToken) => {
                return decodedToken
            })
            .catch(() => {
                return false;
            })
    }
    return { $auth, $db, isLoggedIn }
}




// const x = {
//     "type": "service_account",
//     "project_id": "swiftdox-dev",
//     "private_key_id": "e98f5ead482c750e14ec148af8410e936dacf7f6",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCjv9l2ez0jZfzk\nRdlcd0/o3edgzqKAOq4Xj7R8F//vPwaQnlgUcjUObgrnTAgNg50fSBKyHAdoRzNO\ngWeP59Rpr7TLLO/Vmm25qgZGA2YMiFAiVoE16ydzTsX49RNianqCyMlkO+Ly7uz0\nkKTF94MStZFJGIHtRQSIDhpK1N3+hX58jKdIP8Aofs8zvxM3L01wHMJrauHqWef+\nKYEIQaXCpTBzQm7en0ubisVRKo3eBm6p7YLek5OchTUWY+CrtmwLpfdYqi9vE5Co\nagNzA7+UBBdq69xvKMsBJNw/C/J484Ie3dHCrIeHSupcHS6WaxLTTLbiXXR2DJuL\nig3MWMgTAgMBAAECggEAT2TEC+G55XFcGdPSDTaeLIJ23mWhvXl2El9vO2Gpijbt\nOG5Ft3geSGZLbBTdrKu9IT8hLXFQmBs5gZ1VeJ0HTMzP5Fjf2hm7jLMmwoiAUKBA\n9j0p/doLsSkm7Mvqv6NvzfyLRMmSgoYcpoGBGqkkyIv3KtEyobd+eHcaAWFPV0lc\nHTlKmv4c2OmrasDFh9uDCMd6KPQoaxkNa0AvuC2LcJktdm1ddfkM88NP4xW7FUTM\nuwKEVNMlsSpEXs3eOZbR+tmy+5g76PX371k6wNUIxjwtridqmyhnRQPc3kBdoP6U\n69Ztx+K65wvO7sW7h3Tz1OWa4Krh3kzMNKnf0nKaPQKBgQDfVU0Gv9PRgIR5AccP\n71UJoTQam1hbGQfB4fyUjfMwPmzatuBl5lM/cglVHZ4yVvjxK5MOlqhga/QADrBI\nQhfh99CvlhGMuIIdcXGn55i7n2Iifl5alX2h+sV6QPTGiYMVmhwZSenBlmH0nT+u\nCEf5U9B+NNg1tHa1UAhFa/mbrwKBgQC7s2/Sk+V4Xr98NNwM5STM99oaFkhK+MUX\nU/Mu0f3VHCg0i9La/h4ofYhzRY/L2wjqAy3g9vV87bTbYnTSnwy+dKBzddsqk6b1\nMSsKVJEhR3dVmohWPV4zb0BWgc4A1YP+bk71YWm2zwXHPh/uBpUOiMZhJL4qB4G6\n1AhKXac+3QKBgQCesRYSfawdaZy3/zNbd0yNkyZa4Zde4+JHOjUnudXbqf/fSaMZ\nxRfSNU28VVdbncE2XSgZbaQnH445nDZWoeAmiNiYa6H8w/5wvXNtQ3ublh09NV4G\nL8MdnftEa3OCv6ONbfwZXBPlot3n2vSszOWXnJ7Bjvsy7hCLtVqrOZYbsQKBgAfl\na43bROsEaV/LRXqRZTPuNVGloFLvFjN+B5vvn5MIhTR4sV0fFZu0dDoNMhhsVXqq\nuZJeMUOZKGOWR73YjQuyElHpIlgvL/XepKXhmt1giUejoZqnKEBXrMg227izQsNA\nVrgB6hWTrfWMyoET689Zt6a8ifdwq2d1pgei2vdNAoGBAKwxRWesevPalzFsHF70\n9a6pDITBX4ulcqOGnZvS0wtA71r5yC6WVPu/PVaADrIyfk9oo1rPOoShlcyWxXba\nDr+GlzIXbQ4FV8uY+fPCJy235cuJaoWJcek4dhXJ5lGtkztTr4Sz6ftGTpFKWGnR\nlcqR/p8Nnc3iWlljZBx39/ez\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-8kc2f@swiftdox-dev.iam.gserviceaccount.com",
//     "client_id": "112634102705387082608",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8kc2f%40swiftdox-dev.iam.gserviceaccount.com",
//     "universe_domain": "googleapis.com"
// }