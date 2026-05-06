import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';

const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

const Circle = styled.View`
  background-color: white;
  border-radius: ${(props) => props.$size / 2}px;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  padding: ${(props) => props.$size * 0.15}px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 5;
`;

export const BrandLogo = ({ size = 100 }) => (
  <Container>
    <Circle $size={size}>
      <Image 
        source={require('../../../assets/logo.png')} 
        style={{ width: '100%', height: '100%' }} 
        resizeMode="contain" 
      />
    </Circle>
  </Container>
);