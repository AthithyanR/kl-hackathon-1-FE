/* eslint-disable react/function-component-definition */
/* eslint-disable arrow-body-style */
/* eslint-disable react/destructuring-assignment */
import { ActionIcon } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons';

const stateRenderer = ({ key }) => (obj) => {
  return (
    <ActionIcon
      variant="filled"
      sx={{ backgroundColor: '#211c57' }}
      // className="d-flex-all"
    >
      {obj[key] ? <IconCheck /> : <IconX />}
    </ActionIcon>
  );
};

export default stateRenderer;
