import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { GradientView } from '../../components/GradientView';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.View`
  width: 180px;
  height: 180px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.xl}px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  elevation: 10;
`;

const AppName = styled.Text`
  font-size: ${(props) => props.theme.typography.h1}px;
  color: ${(props) => props.theme.colors.white};
  font-weight: bold;
  margin-top: ${(props) => props.theme.spacing.lg}px;
  letter-spacing: 2px;
`;

const Tagline = styled.Text`
  font-size: ${(props) => props.theme.typography.body}px;
  color: ${(props) => props.theme.colors.secondary};
  margin-top: ${(props) => props.theme.spacing.sm}px;
  font-weight: 600;
`;

const FooterText = styled.Text`
  position: absolute;
  bottom: 50px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.typography.caption}px;
  opacity: 0.8;
`;

const SplashScreen = () => {
  const { t } = useTranslation();

  return (
    <GradientView $colors={theme.colors.gradient}>
      <Container>
        <LogoContainer>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={{ width: 140, height: 140 }}
            resizeMode="contain"
          />
        </LogoContainer>
        <AppName>UNGUKA</AppName>
        <Tagline>{t('subtitle')}</Tagline>
        <FooterText>Farmer Profit Intelligence System</FooterText>
      </Container>
    </GradientView>
  );
};

export default SplashScreen;