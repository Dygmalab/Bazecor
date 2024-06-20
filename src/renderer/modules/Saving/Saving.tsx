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
import { Button } from "@Renderer/components/atoms/Button";

interface SavingProps {
  saveContext: () => Promise<void> | void;
  destroyContext: () => Promise<void> | void;
  inContext: boolean;
  isSaving: boolean;
}

function Saving(props: SavingProps) {
  const { saveContext, destroyContext, inContext, isSaving } = props;
  return (
    <div className="savingButtons flex gap-2">
      <Button onClick={destroyContext} variant="outline" size="sm" disabled={!inContext || isSaving}>
        Discard&nbsp;<span className="sm:hidden md:hidden lg:inline-block">changes</span>
      </Button>
      <Button onClick={saveContext} variant="primary" size="sm" disabled={!inContext || isSaving}>
        {isSaving ? (
          "Saving"
        ) : (
          <>
            Save&nbsp;<span className="sm:hidden md:hidden lg:inline-block">changes</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default Saving;
