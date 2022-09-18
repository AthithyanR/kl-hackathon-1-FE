import { Avatar, Group, Text } from '@mantine/core';
import React from 'react';

export default function selectItem({ image, label, ...others }, ref) {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text>{label}</Text>
        </div>
      </Group>
    </div>
  );
}
