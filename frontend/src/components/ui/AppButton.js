import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { theme } from '../../styles/theme';

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${(props) => (props.$variant === 'secondary' ? theme.colors.secondary : theme.colors.primary)};
  height: 62px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 4;
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.$variant === 'secondary' ? theme.colors.text : theme.colors.white)};
  font-weight: 700;
  font-size: 18px;
`;

export const AppButton = ({ title, onPress, $variant, isLoading }) => (
  <ButtonContainer onPress={onPress} $variant={$variant} disabled={isLoading}>
    {isLoading ? (
      <ActivityIndicator color={theme.colors.white} />
    ) : (
      <ButtonText $variant={$variant}>{title}</ButtonText>
    )}
  </ButtonContainer>
);