import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
import { useAuth } from '../../store/AuthContext';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { theme } from '../../styles/theme';

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  padding: 24px;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${theme.colors.text};
  margin-top: 16px;
  margin-bottom: 30px;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  margin-top: 15px;
  justify-content: center;
`;

const RegularText = styled.Text`
  color: #666;
  font-size: 15px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
  font-weight: bold;
  font-size: 15px;
`;

const LoginScreen = ({ navigation }) => {
  const { authenticate } = useAuth();
  const [form, setForm] = useState({ phone_e164: '+250', password: '' });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => authenticate(data),
    onError: (err) => Alert.alert('Login Error', err.message)
  });

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          <BrandLogo size={80} />
          <HeaderTitle>Sign In</HeaderTitle>
          
          <AppInput 
            label="Phone Number" 
            icon="call-outline"
            placeholder="+250..."
            value={form.phone_e164}
            onChangeText={(v) => setForm({...form, phone_e164: v})}
            keyboardType="phone-pad"
          />
          <AppInput 
            label="Password" 
            icon="lock-closed-outline"
            placeholder="••••••••"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => setForm({...form, password: v})}
          />
          <AppButton title="Login" isLoading={mutation.isPending} onPress={() => mutation.mutate(form)} />
          
          <FooterContainer>
            <RegularText>Don't have an account? </RegularText>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <HighlightText>Sign Up</HighlightText>
            </TouchableOpacity>
          </FooterContainer>
        </Content>
      </ScrollView>
    </Screen>
  );
};

export default LoginScreen;