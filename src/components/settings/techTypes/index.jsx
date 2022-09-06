/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon, Box, Button, Card, Grid, LoadingOverlay, Modal, Paper, TextInput, Title,
} from '@mantine/core';
import { IconTrash, IconSquarePlus, IconEdit } from '@tabler/icons';

import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { dbMessageSnip, queryConstants } from '../../../shared/constant-values';
import baseApi from '../../../shared/api';

function TechType({ techType, handleDelete, handleEdit }) {
  return (
    <Grid.Col span={3}>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          display: 'flex', justifyContent: 'space-between',
        }}
      >
        {
          techType.imgUrl
            && <img height={35} width={35} src={techType.imgUrl} alt={`${techType.name}-logo`} />
        }
        <Title order={3}>{techType.name}</Title>
        <Box style={{ display: 'flex' }}>
          <ActionIcon mt={5} mr={5} onClick={() => handleEdit(techType.id)} variant="light"><IconEdit size={16} /></ActionIcon>
          <ActionIcon mt={5} onClick={() => handleDelete(techType.id)} variant="light"><IconTrash size={16} /></ActionIcon>
        </Box>
      </Card>
    </Grid.Col>
  );
}

function TechTypes() {
  const [opened, setOpened] = useState(false);
  const [editId, setEditId] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(
    [queryConstants.techTypes],
    () => baseApi.get('/techTypes'),
  );

  const addMutation = useMutation(
    (payload) => baseApi.post('/techTypes', [payload]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryConstants.techTypes]);
        form.reset();
        setOpened(false);
      },
      onError: () => {
        showNotification({
          title: '',
          message: 'Unable to add new tech type!',
        });
      },
    },
  );

  const updateMutation = useMutation(
    (payload) => baseApi.put('/techTypes', [payload]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryConstants.techTypes]);
        form.reset();
        setOpened(false);
      },
      onError: () => {
        showNotification({
          title: '',
          message: 'Unable to update the tech type!',
        });
      },
    },
  );

  const deleteMutation = useMutation(
    (payload) => baseApi.delete('/techTypes', { data: [payload] }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryConstants.techTypes]);
      },
      onError: (err) => {
        showNotification({
          message: err?.data?.includes(dbMessageSnip.foreignKey)
            ? 'Please delete related questions!'
            : 'Unable to delete tech type!',
        });
      },
    },
  );

  const form = useForm({
    initialValues: {
      name: '',
      imgUrl: '',
    },
  });

  if (isLoading) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  const techTypes = data.data || [];

  const handleEdit = (id) => {
    const selected = techTypes.find((el) => el.id === id);
    form.setValues({
      ...selected,
    });
    setEditId(id);
    setOpened(true);
  };

  const handleModalClose = () => {
    setOpened(false);
    setEditId(null);
    form.reset();
  };

  return (
    <>
      <Paper p={10}>
        <Grid>
          <Grid.Col span={6}>
            <Title order={1} mb={20}>
              Tech Types
            </Title>
          </Grid.Col>
          <Grid.Col
            span={6}
            mt={10}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <ActionIcon
              onClick={() => setOpened(true)}
              variant="light"
            >
              <IconSquarePlus size={30} />
            </ActionIcon>
          </Grid.Col>
        </Grid>
        <Grid>
          {techTypes.map((t) => (
            <TechType
              techType={t}
              key={t.id}
              handleEdit={handleEdit}
              handleDelete={deleteMutation.mutate}
            />
          ))}
        </Grid>
      </Paper>
      <Modal
        opened={opened}
        onClose={handleModalClose}
      >
        <form onSubmit={form.onSubmit(editId ? updateMutation.mutate : addMutation.mutate)}>
          <TextInput
            required
            label="Tech name"
            mt="md"
            {...form.getInputProps('name')}
            size="large"
          />
          <TextInput
            label="Image url"
            mt="md"
            {...form.getInputProps('imgUrl')}
            size="large"
          />
          <p>
            Trouble finding image url?
            {' '}
            <a href="https://devicon.dev/" target="_blank" rel="noreferrer">
              check this out
            </a>
          </p>
          <Button fullWidth mt="xl" type="submit" loading={addMutation.isLoading}>
            Add
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default TechTypes;
