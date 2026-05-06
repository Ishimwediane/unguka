import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { TouchableOpacity } from 'react-native';

const Container = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-left: 4px;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: 18px;
  border-width: 1.5px;
  border-color: ${(props) => (props.$isFocused ? theme.colors.primary : '#E8EEEA')};
  padding: 0 16px;
  height: 64px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-left: 12px;
`;

export const AppInput = ({ label, icon, secureTextEntry, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputWrapper $isFocused={isFocused}>
        <Ionicons name={icon} size={22} color={isFocused ? theme.colors.primary : '#99B0A0'} />
        <StyledTextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
          </TouchableOpacity>
        )}
      </InputWrapper>
    </Container>
  );
};