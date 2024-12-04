import { Button, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';

interface ConfirmatorProps {
  onConfirm: () => void;
  header?: string;
  showConfirmator: boolean;
  setShowConfirmator: React.Dispatch<React.SetStateAction<boolean>>;
  mutationLoading?: boolean;
  closeOnConfirm?: boolean;
}

export const Confirmator: React.FC<ConfirmatorProps> = ({
  onConfirm,
  header = 'Вы уверены?',
  showConfirmator,
  setShowConfirmator,
  mutationLoading = false,
  closeOnConfirm = true,
}) => {
  return (
    <Modal
      style={{zIndex: 6000}}
      opened={showConfirmator}
      onClose={() => setShowConfirmator(false)}
      withCloseButton={false}
      centered
      // title={header}
    >
      <Stack align="center" gap={'xl'}>
        <div className="form-header">{header}</div>
        <Group>
          <Button onClick={() => setShowConfirmator(false)} variant="outline">
            Нет
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              closeOnConfirm && setShowConfirmator(false);
            }}
            //onClick={onConfirm}
            disabled={mutationLoading}
          >
            Да
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
