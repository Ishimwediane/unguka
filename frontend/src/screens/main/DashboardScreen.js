import React from 'react';
import styled from 'styled-components/native';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/AppButton';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  return (
    <Container>
      <styled.Text style={{fontSize: 24, marginBottom: 20}}>Hello, {user?.full_name}</styled.Text>
      <Button title="Logout" onPress={logout} $variant="secondary" />
    </Container>
  );
};

export default DashboardScreen;