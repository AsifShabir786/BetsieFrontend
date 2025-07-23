import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Alert, Button, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const redirectUri = makeRedirectUri(); // Call it here
  console.log('Redirect URI:', redirectUri); // Log it

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '1031099142577-3h0hc3pnlhbpp6ivd4tmrbeo975n4g8m.apps.googleusercontent.com',
    redirectUri: redirectUri, // Use the logged URI
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        console.log('Access Token:', authentication.accessToken);

        // ✅ Send access token to NestJS backend
        fetch('http://localhost:3000/users/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: authentication.accessToken,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Backend User:', data);
            Alert.alert('Success', `Welcome ${data.FullName || data.email}`);
            // ✅ Store token or navigate to another screen here if needed
          })
          .catch((err) => {
            console.error('Login Error:', err);
            Alert.alert('Error', 'Login with Google failed');
          });
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Google Login</Text>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
}
