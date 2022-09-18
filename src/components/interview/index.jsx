import React, { useState } from 'react';
import {
  ActionIcon, Grid, Paper, Title,
} from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons';
import UpsertInterview from './upsert';

export default function Interview() {
  const [opened, setOpened] = useState(false);

  return (
    <Paper p={10}>
      <Grid justify="space-between">
        <Grid.Col span={4}>
          <Title order={2} mb={4}>
            Interview
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
      <Grid>
        Table
        <UpsertInterview opened={opened} setOpened={setOpened} />
      </Grid>
    </Paper>
  );
}
