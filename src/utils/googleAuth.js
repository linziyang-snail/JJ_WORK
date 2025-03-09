// utils/googleAuth.js
import { loadGapiInsideDOM } from "gapi-script";

// 使用環境變數，避免敏感資訊外洩
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/drive.file";
let isInited = false;

export async function getGoogleAccessToken() {
    return new Promise((resolve, reject) => {
        loadGapiInsideDOM()
            .then(() => {
                // 確保只初始化一次
                if (!isInited) {
                    isInited = true;
                    window.gapi.load("client:auth2", async () => {
                        try {
                            await window.gapi.client.init({
                                apiKey: API_KEY,
                                clientId: CLIENT_ID,
                                scope: SCOPES,
                                discoveryDocs: [
                                    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
                                ],
                            });
                            resolve(doSignIn());
                        } catch (error) {
                            reject(error);
                        }
                    });
                } else {
                    // 已初始化過，直接登入
                    resolve(doSignIn());
                }
            })
            .catch(reject);
    });
}

async function doSignIn() {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    let user = GoogleAuth.currentUser.get();
    let authResponse = user.getAuthResponse(true);

    if (!authResponse || !authResponse.access_token) {
        // 若尚未登入，則執行 signIn
        await GoogleAuth.signIn();
        user = GoogleAuth.currentUser.get();
        authResponse = user.getAuthResponse(true);
    }

    return authResponse.access_token;
}