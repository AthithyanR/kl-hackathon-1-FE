import { LoadingOverlay } from '@mantine/core';
import React from 'react';

function CustomLoadingOverlay() {
  return (
    <LoadingOverlay visible overlayBlur={2} loaderProps={{ color: 'violet', size: 'xl', variant: 'dots' }} />
  );
}

export default CustomLoadingOverlay;
