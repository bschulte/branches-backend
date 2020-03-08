export function generateRandomStr(length: number, uppercase: boolean = false) {
  // Create a random string (like for generating API key)
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  if (!uppercase) {
    possible += 'abcdefghijklmnopqrstuvwxyz0123456789';
  }

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
