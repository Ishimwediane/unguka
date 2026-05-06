import React from 'react';
import styled from 'styled-components/native';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';
import { GradientView } from '../../components/GradientView';
import { AppButton } from '../../components/ui/AppButton';
import { BrandLogo } from '../../components/ui/BrandLogo';

const Screen = styled(SafeAreaView)`
  flex: 1;
`;

const HeroSection = styled.View`
  flex: 1.2;
  justify-content: center;
  align-items: center;
`;

const ActionCard = styled.View`
  background-color: ${theme.colors.surface};
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  padding: 40px 24px;
`;

const BigTitle = styled.Text`
  font-size: 34px;
  font-weight: 900;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 8px;
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
`;

const WelcomeScreen = ({ navigation }) => {
  return (
    <GradientView $colors={theme.colors.gradient}>
      <StatusBar barStyle="light-content" />
      <Screen>
        <HeroSection>
          <BrandLogo size={160} />
        </HeroSection>
        <ActionCard>
          <BigTitle>Unguka</BigTitle>
          <DescriptionText>The smartest way to track your farm profits and discover daily market prices.</DescriptionText>
          <AppButton title="Sign In" onPress={() => navigation.navigate('Login')} />
          <AppButton title="Create Account" $variant="secondary" onPress={() => navigation.navigate('Signup')} />
        </ActionCard>
      </Screen>
    </GradientView>
  );
};

export default WelcomeScreen;