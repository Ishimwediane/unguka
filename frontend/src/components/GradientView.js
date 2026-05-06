import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

const StyledGradient = styled(LinearGradient)`
  flex: 1;
`;

export const GradientView = ({ children, $colors }) => {
  return (
    <StyledGradient colors={$colors}>
      {children}
    </StyledGradient>
  );
};