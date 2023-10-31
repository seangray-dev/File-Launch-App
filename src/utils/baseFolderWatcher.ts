import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { exists } from 'tauri-plugin-fs-extra-api';
import { watchImmediate } from 'tauri-plugin-fs-watch-api';

/**
 * Watches the base folder for file system events.
 * @returns void
 */

const baseFolderWatcher = () => {
  const baseFolder = useSelector(
    (state: RootState) => state.recentFiles.baseFolder
  );

  // Define state to hold the unlisten function
  const [unlisten, setUnlisten] = useState<null | (() => void)>(null);

  useEffect(() => {
    const startWatching = async () => {
      validateBaseFolder();
      // Define an async function
      if (baseFolder) {
        // Start watching the baseFolder path
        const stopWatching = await watchImmediate(
          baseFolder,
          (event) => {
            // Log the entire event object to see its structure
            console.log('Event object:', event);

            // // Destructure the event object
            // const { kind, path } = event;
            // // Handle the file system event
            // console.log(kind, path);
          },
          { recursive: true }
        );

        // Save the unlisten function
        setUnlisten(() => stopWatching);
      }
    };

    // Call the async function
    startWatching();

    // Return a cleanup function to stop watching when component unmounts
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
    // Re-run the effect when baseFolder changes
  }, [baseFolder]);

  const validateBaseFolder = async () => {
    if (!baseFolder) {
      console.log('Base folder is null');
      return;
    }

    const folderExists = await exists(baseFolder);
    if (!folderExists) {
      console.log('Base folder does not exist');
    }
  };
};

export default baseFolderWatcher;
