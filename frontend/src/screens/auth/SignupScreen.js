import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
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

const FormTitle = styled.Text`
  font-size: 26px;
  font-weight: 800;
  margin-top: 12px;
  margin-bottom: 25px;
`;

const FooterRow = styled.View`
  flex-direction: row;
  margin-top: 15px;
  margin-bottom: 30px;
  justify-content: center;
`;

const NormalText = styled.Text`
  color: #666;
  font-size: 15px;
`;

const ClickableText = styled.Text`
  color: ${theme.colors.primary};
  font-weight: bold;
  font-size: 15px;
`;

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({ full_name: '', phone_e164: '+250', password: '', district: '', sector: '' });

  const mutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      Alert.alert(
        "Great Job!", 
        "Your account is ready. Please sign in to start.",
        [{ text: "Sign In", onPress: () => navigation.navigate('Login') }]
      );
    },
    onError: (err) => Alert.alert('Oops', err.message)
  });

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          <BrandLogo size={60} />
          <FormTitle>Register</FormTitle>
          
          <AppInput label="Full Name" icon="person-outline" placeholder="Your name" onChangeText={(v) => setForm({...form, full_name: v})} />
          <AppInput label="Phone Number" icon="call-outline" placeholder="+250..." onChangeText={(v) => setForm({...form, phone_e164: v})} keyboardType="phone-pad" />
          <AppInput label="District" icon="map-outline" placeholder="District" onChangeText={(v) => setForm({...form, district: v})} />
          <AppInput label="Sector" icon="location-outline" placeholder="Sector" onChangeText={(v) => setForm({...form, sector: v})} />
          <AppInput label="Password" icon="lock-closed-outline" secureTextEntry onChangeText={(v) => setForm({...form, password: v})} />

          <AppButton title="Join Unguka" isLoading={mutation.isPending} onPress={() => mutation.mutate(form)} />
          
          <FooterRow>
            <NormalText>Already a member? </NormalText>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <ClickableText>Login Here</ClickableText>
            </TouchableOpacity>
          </FooterRow>
        </Content>
      </ScrollView>
    </Screen>
  );
};

export default SignupScreen;