import React, { useState, useMemo, useCallback } from 'react';
import {
  ActionIcon, Grid, LoadingOverlay, Paper, Title,
} from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';

import UpsertInterview from './upsert';
import { queryConstants } from '../../shared/constant-values';
import baseApi from '../../shared/api';
import TableComponent from '../../shared/components/table';
import tableConfig from '../../shared/meta-data/table/assessment';

export default function Interview() {
  const [opened, setOpened] = useState(false);
  const { data: assessmentSessionQuery, isLoading, isError } = useQuery(
    [queryConstants.assessments],
    () => baseApi.get('/assessmentSession'),
  );

  const assessmentSessions = assessmentSessionQuery?.data || [];

  const handleEdit = useCallback((obj) => {
    console.log('edit', obj);
    setOpened(true);
  }, []);

  const handleDelete = useCallback((obj) => {
    console.log('delete', obj);
  }, []);

  const handlers = useMemo(() => ({
    handleEdit,
    handleDelete,
  }), []);

  if (isLoading) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  return (
    <Paper p={10}>
      <Grid justify="space-between">
        <Grid.Col span={4}>
          <Title order={2} mb={4}>
            Assessment
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
        <TableComponent data={assessmentSessions} config={tableConfig} handlers={handlers} />
        {opened && <UpsertInterview opened={opened} setOpened={setOpened} />}
      </Grid>
    </Paper>
  );
}
