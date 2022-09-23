import React from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';

import baseApi from '../../shared/api';
import { setToLs } from '../../shared/utils';
import { TOKEN_NAME } from '../../shared/constant-values';

export default function AuthenticationTitle() {
  const navigate = useNavigate();
  const loginMutation = useMutation(
    (payload) => baseApi.post('/authenticate', payload),
    {
      onSuccess: ({ data: token }) => {
        setToLs(TOKEN_NAME, token);
        navigate('/schedule-assessment', { replace: true });
      },
      onError: () => {
        showNotification({
          title: '',
          message: 'Login failed!',
        });
      },
    },
  );

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 7 ? null : 'Invalid password'),
    },
  });

  return (
    <div className="login-wrapper">
      <Grid align="center" style={{ margin: 'auto', height: '100%' }}>
        <Grid.Col span={4} offset={7} className="login-wrapper-grid">
          <Title align="center">
            Entretien
          </Title>
          <form onSubmit={form.onSubmit(loginMutation.mutate)}>
            <TextInput
              required
              label="Email"
              mt="md"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Password"
              mt="md"
              {...form.getInputProps('password')}
            />
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
          </form>

        </Grid.Col>
      </Grid>
    </div>
  );
}
