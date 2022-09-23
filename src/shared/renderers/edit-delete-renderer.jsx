import { ActionIcon } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';
import './style.scss';

const editDeleteRenderer = (obj, handlers) => (
  <div className="edit-delete-element">
    <ActionIcon
      variant="filled"
      sx={{ backgroundColor: '#cfccf1', color: '#5F55D2' }}
      onClick={() => handlers.handleEdit && handlers.handleEdit(obj)}
    >
      <IconPencil size={18} />
    </ActionIcon>
    <ActionIcon
      variant="filled"
      sx={{ backgroundColor: '#cfccf1', color: '#5F55D2' }}
      onClick={() => handlers.handleDelete && handlers.handleDelete(obj)}
    >
      <IconTrash size={18} />
    </ActionIcon>
  </div>
);

export default editDeleteRenderer;
