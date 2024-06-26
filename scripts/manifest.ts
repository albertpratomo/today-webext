import {log, r} from './utils';
import fs from 'fs-extra';
import {getManifest} from '../src/manifest';

export async function writeManifest() {
    await fs.writeJSON(r('extension/manifest.json'), await getManifest(), {spaces: 2});
    log('PRE', 'write manifest.json');
}

writeManifest();
