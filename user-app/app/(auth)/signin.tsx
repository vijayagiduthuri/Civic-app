import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn(): React.ReactElement {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [emailAddress] = useState("");
  const [password] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const onGoogleSignIn = async (): Promise<void> => {
    if (!isLoaded || isGoogleLoading) return;
    setIsGoogleLoading(true);
    setError("");
    try {
      const { createdSessionId } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      Alert.alert("Sign In Failed", errorObj?.message || "Unable to sign in with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={50}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <View style={styles.heroImagePlaceholder}>
            <View style={styles.personSilhouette}>
              <Ionicons name="person" size={80} color="#666" />
            </View>
            <View style={styles.crossIcon}>
              <Text style={styles.crossText}>✚</Text>
            </View>
          </View>
        </View>

        {/* Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="shield" size={24} color="#FF4444" />
            </View>
            <Text style={styles.brandName}>CivicApp</Text>
          </View>
          <Text style={styles.tagline}>Building stronger communities together</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Social Sign In */}
          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={onGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Error Display */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#FF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroImagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#2a2a2a',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  personSilhouette: {
    opacity: 0.7,
  },
  crossIcon: {
    position: 'absolute',
    right: 40,
    top: 80,
    backgroundColor: '#333',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    marginRight: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
  },
  emailSignUpButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 24,
    alignItems: 'center',
  },
  emailSignUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    color: '#999',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});