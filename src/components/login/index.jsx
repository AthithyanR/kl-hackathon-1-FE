import React from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';

import baseApi from '../../shared/api';
import { setToLs } from '../../shared/utils';

export default function AuthenticationTitle() {
  const navigate = useNavigate();
  const loginMutation = useMutation(
    (payload) => baseApi.post('/authenticate', payload),
    {
      onSuccess: ({ data: token }) => {
        setToLs('token', token);
        navigate('/', { replace: true });
      },
      onError: () => {
        // navigate('/', { replace: true });
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
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Entretien
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
      </Paper>
    </Container>
  );
}
