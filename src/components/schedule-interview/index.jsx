import React, { useState } from 'react';
import {
  ActionIcon, Grid, Paper, Title,
} from '@mantine/core';
import { IconSquarePlus } from '@tabler/icons';
import AddInterview from './add-schedule';

function ScheduleInterview() {
  const [opened, setOpened] = useState(false);

  return (
    <Paper p={10}>
      <Grid>
        <Grid.Col span={6}>
          <Title order={1} mb={20}>
            Schedule Interview
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
        Table
        <AddInterview opened={opened} setOpened={setOpened} />
      </Grid>
    </Paper>
  );
}

export default ScheduleInterview;
