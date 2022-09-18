import {
  ActionIcon, Grid, Modal, Title,
} from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons';
import React, { useState } from 'react';
import UpsertInterview from './upsert-interview';

function Interview() {
  const [opened, setOpened] = useState(false);

  const handleModalClose = () => {
    setOpened(false);
    // setEditId(null);
    // form.reset();
  };
  return (
    <>
      <Grid justify="space-between">
        <Grid.Col span={1}>
          <Title order={2} mb={4}>
            Interviews
          </Title>
        </Grid.Col>
        <Grid.Col span={1}>
          <ActionIcon
            onClick={() => setOpened(true)}
            variant="filled"
            sx={{ backgroundColor: '#211c57', marginLeft: 'auto' }}
          >
            <IconPlaylistAdd size={24} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Modal opened={opened} onClose={handleModalClose}>
        <UpsertInterview />
      </Modal>
    </>
  );
}

export default Interview;
