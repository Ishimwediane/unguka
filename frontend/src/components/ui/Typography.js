import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 900;
  color: ${theme.colors.text};
  letter-spacing: -0.5px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  line-height: 24px;
  margin-top: 8px;
`;

export const LinkText = styled.Text`
  color: ${theme.colors.primary};
  font-weight: 700;
  font-size: 14px;
`;

export const CenterLink = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
`;