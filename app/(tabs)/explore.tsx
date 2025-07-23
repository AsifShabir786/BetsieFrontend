import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Alert, Button, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function FacebookLoginScreen() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '784547960567130', // Replace with your Facebook App ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { accessToken } = response.authentication || {};
      if (accessToken) {
        console.log('Facebook Access Token:', accessToken);

        // ✅ Send to NestJS backend
        fetch('http://192.168.18.55:3000/users/facebook-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Backend User:', data);
            Alert.alert('Login Success', `Welcome ${data.FullName || data.email}`);
          })
          .catch((err) => {
            console.error('Login Error:', err);
            Alert.alert('Error', 'Login with Facebook failed');
          });
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Facebook Login</Text>
      <Button
        title="Continue with Facebook"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
}
