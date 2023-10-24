import { appConfigDir } from '@tauri-apps/api/path';
import { Store } from 'tauri-plugin-store-api';

// Returns the path to the suggested directory for our app's config files.
const appConfigDirPath = await appConfigDir();

// Creates a new store instance, using the path to our app's config directory
export const appConfigStore = new Store(appConfigDirPath + 'settings.json');
