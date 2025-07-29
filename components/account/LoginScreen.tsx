import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

type AuthMode = 'login' | 'signup';

export function LoginScreen() {
  const { t } = useTranslation();
  const { signIn, signUp, signInWithGoogle, isLoading, error, resetAuthError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');


  // Show error alert when auth error occurs
  React.useEffect(() => {
    if (error) {
      Alert.alert(
        t('auth.errorTitle'),
        error.message,
        [{ text: t('common.ok'), onPress: resetAuthError }]
      );
    }
  }, [error, resetAuthError, t]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(
        t('auth.validationError'),
        t('auth.provideCredentials')
      );
      return;
    }

    if (mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>
          {mode === 'login' ? t('auth.signIn') : t('auth.signUp')}
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'login' ? t('auth.signIn') : t('auth.signUp')}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.googleButton}
          onPress={signInWithGoogle}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>{t('auth.continueWithGoogle')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {mode === 'login' 
              ? t('auth.needAccount') 
              : t('auth.alreadyHaveAccount')}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 24,
  },
  title: {
    fontSize: 28, // Larger font size
    fontWeight: 'bold',
    marginBottom: 28, // Increased margin
    color: '#FF69B4', // Bright pink
  },
  input: {
    width: '100%',
    height: 55, // Slightly taller input
    backgroundColor: '#F0F8FF', // AliceBlue
    borderRadius: 15, // More rounded input fields
    marginBottom: 18, // Increased margin
    paddingHorizontal: 18,
    color: '#333333', // Darker text for contrast
    borderWidth: 1,
    borderColor: '#ADD8E6', // Light blue border
  },
  primaryButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#8A2BE2', // BlueViolet
    borderRadius: 15, // More rounded buttons
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, // Larger font size
    fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#FFD700', // Gold
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  googleButtonText: {
    color: '#8B4513', // SaddleBrown
    fontSize: 18,
    fontWeight: 'bold',
  },
  anonymousButton: {
    width: '100%',
    height: 55,
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2, // Thicker border
    borderColor: '#FF6347', // Tomato
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  anonymousButtonText: {
    color: '#FF6347', // Tomato
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  toggleText: {
    color: '#4682B4', // SteelBlue
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#A3A3A3',
    fontSize: 16,
  },
});
