import { ActionIcon } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';

const editDeleteRenderer = (obj, handlers) => (
  <div style={{ display: 'flex' }}>
    <ActionIcon
      variant="filled"
      sx={{ backgroundColor: '#211c57', marginLeft: 'auto' }}
      onClick={() => handlers.handleEdit && handlers.handleEdit(obj)}
    >
      <IconPencil />
    </ActionIcon>
    <ActionIcon
      variant="filled"
      sx={{ backgroundColor: '#211c57', marginLeft: 'auto' }}
      onClick={() => handlers.handleDelete && handlers.handleDelete(obj)}
    >
      <IconTrash />
    </ActionIcon>
  </div>
);

export default editDeleteRenderer;
