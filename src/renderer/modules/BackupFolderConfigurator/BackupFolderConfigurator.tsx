// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import { i18n } from "@Renderer/i18n";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

interface BackupFolderConfiguratorProps {
  chooseBackupFolder: () => void;
  getBackup: () => void;
  backupFolder: string;
  connected: boolean;
}

function BackupFolderConfigurator(props: BackupFolderConfiguratorProps) {
  const { chooseBackupFolder, getBackup, backupFolder, connected } = props;
  return (
    <div className="w-full">
      <div className="backupFolderConfigurator">
        <Heading headingLevel={6} renderAs="h6" className="tracking-tight leading-[1.5em] text-gray-500 dark:text-gray-100">
          {i18n.keyboardSettings.backupFolder.title}
        </Heading>
        <div className="containerInfo flex w-full rounded-regular py-[2px] px[0] border-[1px] border-gray-100/60 dark:border-gray-600 bg-white/40 dark:bg-gray-900/20">
          <div className="containerInfoInner flex w-full">
            <div className="flex items-center bg-transparent border-none font-semibold text-base text-gray-300 dark:text-gray-50">
              {backupFolder}
            </div>
            <Button variant="short" onClick={chooseBackupFolder}>
              {i18n.keyboardSettings.backupFolder.selectButtonText}
            </Button>
            <Button variant="short" onClick={getBackup} disabled={!connected}>
              {i18n.keyboardSettings.backupFolder.restoreButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackupFolderConfigurator;
