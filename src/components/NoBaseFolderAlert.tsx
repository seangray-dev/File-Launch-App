import { checkBaseFolderExistence } from '@/utils/baseFolderCheck';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { ButtonLoading } from './ui/button-loading';

const NoBaseFolderAlert = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBaseFolder = async () => {
    setIsLoading(true);
    const status = await checkBaseFolderExistence();
    setTimeout(() => {
      setIsLoading(false);
      if (status === 'exists') {
        onClose(); // Close the modal if the base folder exists
      }
    }, 1000);
  };

  return (
    <Modal
      className='bg-secondary'
      size='xl'
      isOpen={isOpen}
      onClose={onClose}
      isDismissable
      backdrop='blur'>
      <ModalContent>
        <ModalHeader className='text-destructive'>
          Base Folder Unavailable!
        </ModalHeader>
        <ModalBody>
          <p>
            The base folder is currently unavailable. This may be due to an
            external drive being unplugged or the folder being deleted or moved.
          </p>
          <p>Please check the base folder path and ensure it is accessible.</p>
          You can update the base folder path in the settings if necessary.
        </ModalBody>
        <ModalFooter>
          <div className='w-full'>
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                // variant={'destructive'}
                className='w-full'
                onClick={handleCheckBaseFolder}>
                Check Again
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NoBaseFolderAlert;
