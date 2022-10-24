import React, { forwardRef } from 'react';
import {
  Grid, MultiSelect, Box, CloseButton,
} from '@mantine/core';

const option = ({
  label,
  image,
  onRemove,
  classNames,
  ...others
}) => (
  <div {...others}>
    <Box
      sx={(theme) => ({
        display: 'flex',
        cursor: 'default',
        alignItems: 'center',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,
        paddingLeft: 10,
        borderRadius: 4,
      })}
    >
      <Box mr={10} className="d-flex-all">
        {image && <img src={image} width="20" alt={label} />}
      </Box>
      <Box sx={{ lineHeight: 1, fontSize: 12 }} mr={10}>{label}</Box>
      <CloseButton
        onMouseDown={onRemove}
        variant="transparent"
        size={22}
        iconSize={14}
        tabIndex={-1}
      />
    </Box>
  </div>
);

const Item = forwardRef(({
  label, image, ...others
}, ref) => (
  <div ref={ref} {...others}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {image && <img src={image} width="20" style={{ marginRight: 10 }} alt={label} />}
      <div>{label}</div>
    </Box>
  </div>
));

export default function SelectTechType(props) {
  const { techTypes, onChange, selectedTechIds } = props;

  return (
    <Grid.Col
      mt={10}
    >
      <MultiSelect
        data={techTypes}
        limit={20}
        value={selectedTechIds}
        valueComponent={option}
        itemComponent={Item}
        transitionDuration={350}
        transition="pop"
        searchable
        size="md"
        onChange={(e) => onChange(e)}
        placeholder="Select Tech Type"
      />
    </Grid.Col>
  );
}
