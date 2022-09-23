import React, { useState, useMemo, useCallback } from 'react';
import {
  ActionIcon, Grid, LoadingOverlay, Paper, Title,
} from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';

import { showNotification } from '@mantine/notifications';
import UpsertAssessment from './upsert';
import { queryConstants } from '../../shared/constant-values';
import baseApi from '../../shared/api';
import TableComponent from '../../shared/components/table';
import tableConfig from '../../shared/meta-data/table/assessment';

export default function Assessment() {
  const [opened, setOpened] = useState(false);
  const [editOption, setEditOption] = useState({});
  const [key, setKey] = useState('Add');
  const {
    data: assessmentSessionQuery, isLoading, isError, refetch,
  } = useQuery(
    [queryConstants.assessments],
    () => baseApi.get('/assessmentSession'),
  );

  const assessmentSessions = assessmentSessionQuery?.data || [];

  const showModal = (visible, option) => {
    if (option === 'Add') {
      setEditOption({});
    }
    setKey(option);
    setOpened(visible);
    refetch();
  };

  const handleEdit = useCallback((obj) => {
    setEditOption(obj);
    showModal(true, 'Edit');
  }, []);

  const handleDelete = useCallback((obj) => {
    const { id } = obj;
    baseApi.delete(
      '/assessmentSession',
      { data: [id] },
    ).then(() => {
      refetch();
      showNotification({
        title: '',
        message: 'Deleted Successfully',
      });
    }).catch(() => {
      showNotification({
        title: '',
        message: 'Something went to wrong',
      });
    });
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
            onClick={() => showModal(true, 'Add')}
            variant="filled"
            sx={{ backgroundColor: '#211c57', marginLeft: 'auto' }}
          >
            <IconPlaylistAdd size={24} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Grid>
        <TableComponent data={assessmentSessions} config={tableConfig} handlers={handlers} />
        {opened && (
        <UpsertAssessment
          option={key}
          opened={opened}
          editOption={editOption}
          setOpened={showModal}
        />
        )}
      </Grid>
    </Paper>
  );
}
