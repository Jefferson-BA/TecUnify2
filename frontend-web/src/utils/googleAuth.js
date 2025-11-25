import { GOOGLE_CLIENT_ID } from "../config/google.js";

export function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,

      scope: "https://www.googleapis.com/auth/calendar.readonly",


      prompt: "consent",

      callback: (tokenResponse) => {
        if (!tokenResponse.access_token) {
          reject("No se pudo obtener el Access Token");
        } else {
          resolve(tokenResponse.access_token);
        }
      },
    });

    tokenClient.requestAccessToken();
  });
}
