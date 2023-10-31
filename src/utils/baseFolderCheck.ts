import { exists } from 'tauri-plugin-fs-extra-api';
import { appConfigStore } from '../utils/appConfigStore';

export const checkBaseFolderExistence = async (): Promise<string> => {
  const baseFolder = await appConfigStore.get<string>('baseFolder');
  const folderExists = baseFolder ? await exists(baseFolder) : false;
  console.log(baseFolder, folderExists);
  return folderExists ? 'available' : 'unavailable';
};
