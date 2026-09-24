import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { loginAsStudent, loginAsGuest } = useAuth();
  const [studentId, setStudentId] = useState('ST-2024-8831');
  const [password, setPassword] = useState('canteen123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStudentLogin = () => {
    if (!studentId.trim()) {
      setErrorMessage('Please enter your Student ID or University Email.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setErrorMessage('');
    loginAsStudent('kavindu.p@campus.ac.lk', studentId.trim());
    navigation.replace('Home');
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigation.replace('Home');
  };

  const handleFillDemo = () => {
    setStudentId('ST-2024-8831');
    setPassword('canteen123');
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="school-outline" size={38} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Welcome to QuickBite</Text>
          <Text style={styles.subtitle}>Enter university credentials to link your student meal account</Text>
        </View>

        <TouchableOpacity style={styles.demoBanner} onPress={handleFillDemo} activeOpacity={0.8}>
          <Ionicons name="flash-outline" size={16} color={COLORS.primary} />
          <Text style={styles.demoBannerText}>Tap here to auto-fill sample Student credentials</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Student ID or University Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. ST-2024-8831"
              placeholderTextColor={COLORS.textMuted}
              value={studentId}
              onChangeText={(txt) => {
                setStudentId(txt);
                if (errorMessage) setErrorMessage('');
              }}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleStudentLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Sign In as Student</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.perksCard}>
          <Text style={styles.perksTitle}>Campus Benefits:</Text>
          <View style={styles.perkItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
            <Text style={styles.perkText}>10% student discount on orders above Rs. 1000</Text>
          </View>
          <View style={styles.perkItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
            <Text style={styles.perkText}>Live order tracking direct from lecture halls</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    width: '100%',
    maxWidth: 420,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FED7AA',
    width: '100%',
    maxWidth: 420,
  },
  demoBannerText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 6,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: COLORS.surface,
    gap: 8,
  },
  guestButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  perksCard: {
    marginTop: SPACING.lg,
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  perksTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  perkText: {
    fontSize: 13,
    color: COLORS.text,
  },
});
