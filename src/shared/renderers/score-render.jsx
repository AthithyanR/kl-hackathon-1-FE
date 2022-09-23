/* eslint-disable react/function-component-definition */
/* eslint-disable arrow-body-style */
/* eslint-disable react/destructuring-assignment */
import { Progress } from '@mantine/core';
// import { IconX, IconCheck } from '@tabler/icons';

const scoreRenderer = ({ key }) => (obj) => {
  return (
    <Progress
      value={obj[key]}
      size="md"
      style={{ width: '80%' }}
      striped
      animate
    />
  );
};

export default scoreRenderer;
