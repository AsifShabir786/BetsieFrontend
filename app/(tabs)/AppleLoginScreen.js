import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert, Button, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function AppleLoginScreen() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: 'com.yourcompany.yourapp', // Your Services ID
    redirectUri: 'https://auth.expo.io/@your-username/your-app-slug',
    scopes: ['name', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication || {};
      if (id_token) {
        console.log('Apple ID Token:', id_token);

        // ✅ Send to backend
        fetch('http://192.168.18.55:3000/users/apple-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: id_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Backend User:', data);
            Alert.alert('Login Success', `Welcome ${data.FullName || data.email}`);
          })
          .catch((err) => {
            console.error('Apple Login Error:', err);
            Alert.alert('Error', 'Apple login failed');
          });
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Apple Login</Text>
      <Button title="Sign in with Apple" disabled={!request} onPress={() => promptAsync()} />
    </View>
  );
}
