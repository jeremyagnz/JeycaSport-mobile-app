import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts';
import { theme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AdminLoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login({ username, password });
      if (success) {
        navigation.navigate('AdminDashboard');
      } else {
        Alert.alert('Error', 'Invalid credentials. Try username: admin, password: admin123');
      }
    } catch {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Title style={[styles.title, { color: paperTheme.colors.primary }]}>Admin Login</Title>
        <Paragraph style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          Sign in to manage players, teams, and statistics
        </Paragraph>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          disabled={isLoading}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
          disabled={isLoading}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Home')}
          disabled={isLoading}
          style={styles.backButton}
        >
          Back to Home
        </Button>
      </View>

      <View style={styles.footer}>
        <Paragraph style={[styles.helpText, { color: paperTheme.colors.onSurfaceVariant }]}>
          Default credentials:
        </Paragraph>
        <Paragraph style={[styles.helpText, { color: paperTheme.colors.onSurfaceVariant }]}>
          Username: admin | Password: admin123
        </Paragraph>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  backButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
});
