/* eslint-disable react/function-component-definition */
/* eslint-disable arrow-body-style */
/* eslint-disable react/destructuring-assignment */
import { ActionIcon } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons';

const stateRenderer = ({ key }) => (obj) => {
  return (
    <ActionIcon
      variant="filled"
      sx={{ backgroundColor: '#cfccf1', color: '#5F55D2', margin: 'auto' }}
      // className="d-flex-all"
    >
      {obj[key] ? <IconCheck size={18} /> : <IconX size={18} />}
    </ActionIcon>
  );
};

export default stateRenderer;
