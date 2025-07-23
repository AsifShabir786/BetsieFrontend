import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Manual login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Google Auth Setup
  const redirectUri = makeRedirectUri();
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: '1031099142577-3h0hc3pnlhbpp6ivd4tmrbeo975n4g8m.apps.googleusercontent.com',
    redirectUri: redirectUri,
  });

  // Apple Auth Setup
  const [appleRequest, appleResponse, applePromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'com.yourcompany.yourapp',
      redirectUri: 'https://auth.expo.io/@your-username/your-app-slug',
      scopes: ['name', 'email'],
    },
    null // Pass null for the discovery document
  );

  // Facebook Auth Setup
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: '784547960567130', // Your Facebook App ID
  });

  // Handle Google Login Response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      if (authentication?.accessToken) {
        console.log('Google Access Token:', authentication.accessToken);
        fetch('http://192.168.18.55:3000/users/google-login', {
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
            console.log('Google Backend User:', data);
            Alert.alert('Success', `Welcome ${data.FullName || data.email}`);
          })
          .catch((err) => {
            console.error('Google Login Error:', err);
            Alert.alert('Error', 'Login with Google failed');
          });
      }
    }
  }, [googleResponse]);

  // Handle Apple Login Response
  useEffect(() => {
    if (appleResponse?.type === 'success') {
      const { idToken } = appleResponse.authentication || {};
      if (idToken) {
        console.log('Apple ID Token:', idToken);
        fetch('http://192.168.18.55:3000/users/apple-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Apple Backend User:', data);
            Alert.alert('Login Success', `Welcome ${data.FullName || data.email}`);
          })
          .catch((err) => {
            console.error('Apple Login Error:', err);
            Alert.alert('Error', 'Apple login failed');
          });
      }
    }
  }, [appleResponse]);

  // Handle Facebook Login Response
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { accessToken } = facebookResponse.authentication || {};
      if (accessToken) {
        console.log('Facebook Access Token:', accessToken);
        fetch('http://192.168.18.55:3000/users/facebook-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Facebook Backend User:', data);
            Alert.alert('Login Success', `Welcome ${data.FullName || data.email}`);
          })
          .catch((err) => {
            console.error('Facebook Login Error:', err);
            Alert.alert('Error', 'Login with Facebook failed');
          });
      }
    }
  }, [facebookResponse]);

  // Social Login Handlers
  const handleFacebookLogin = () => {
    facebookPromptAsync();
  };

  const handleGoogleLogin = () => {
    googlePromptAsync();
  };

  const handleAppleLogin = () => {
    applePromptAsync();
  };

  const handleManualLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Implement manual login logic here
    console.log('Manual login', { email, password, rememberMe });
    Alert.alert('Manual Login', `Logging in with: ${email}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.loginContainer}>
          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
              onPress={handleFacebookLogin}
              disabled={!facebookRequest}
            >
              <Ionicons name="logo-facebook" size={24} color="white" />
              <Text style={styles.socialButtonText}>Login with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.twitterButton]}
              onPress={handleGoogleLogin}
              disabled={!googleRequest}
            >
              <Ionicons name="logo-google" size={24} color="white" />
              <Text style={styles.socialButtonText}>Login with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={handleAppleLogin}
              disabled={!appleRequest}
            >
              <Ionicons name="logo-apple" size={24} color="white" />
              <Text style={styles.socialButtonText}>Login with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.orCircle}>
              <Text style={styles.orText}>OR</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* Manual Login Section */}
          <View style={styles.manualSection}>
            <Text style={styles.manualTitle}>Sign in manually</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Username or email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleManualLogin}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Register now</Text>
              </TouchableOpacity>
              <Text style={styles.linkSeparator}>|</Text>
              <TouchableOpacity>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    minHeight: 400,
  },
  socialSection: {
    flex: 1,
    paddingRight: 20,
    justifyContent: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  twitterButton: {
    backgroundColor: '#DB4437', // Google red color
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  dividerContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dividerLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  orCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  manualSection: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  manualTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rememberContainer: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#666',
    borderColor: '#666',
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#FF5A5A',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLink: {
    color: '#FF5A5A',
    fontSize: 14,
    fontWeight: '500',
  },
  linkSeparator: {
    color: '#ccc',
    marginHorizontal: 15,
    fontSize: 14,
  },
  forgotLink: {
    color: '#999',
    fontSize: 14,
  },
});