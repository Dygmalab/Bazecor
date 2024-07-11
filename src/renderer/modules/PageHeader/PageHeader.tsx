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
import Heading from "@Renderer/components/atoms/Heading";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeaderType } from "./Types";
import Saving from "../Saving";

function PageHeader(props: PageHeaderType) {
  const {
    size,
    text,
    styles,
    contentSelector,
    colorEditor,
    isColorActive,
    showSaving,
    saveContext,
    destroyContext,
    inContext,
    isSaving,
    primaryButton,
    secondaryButton,
  } = props;
  return (
    <div
      className={`w-full flex-1 self-start z-30 ${styles === "pageHeaderFlatBottom" ? "pageHeaderSticky sticky top-0 backdrop-blur-md z-[12]" : ""}`}
    >
      <div
        className={`pageHeader py-2 px-6 mt-4 flex flex-nowrap items-center min-h-16 bg-gray-25/90 dark:bg-gray-400/15 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_h4]:m-0 [&_h5]:m-0 [&_h6]:m-0 ${size && size} ${styles && styles} ${isColorActive ? "extraPanelActive rounded-tr-regular rounded-tl-regular rounded-br-none rounded-bl-none" : "rounded-regular"}`}
      >
        <div className="pageTitle w-48 text-nowrap [&_br]:content-[' ']">
          <Heading headingLevel={2} renderAs="h2" className="text-purple-200 dark:text-gray-50 text-xl mb-0">
            {text}
          </Heading>
        </div>
        <div className="pageTools flex items-center">
          {contentSelector || ""}
          {showSaving ? (
            <Saving saveContext={saveContext} destroyContext={destroyContext} inContext={inContext} isSaving={isSaving} />
          ) : (
            ""
          )}
          {secondaryButton || primaryButton ? (
            <div className="savingButtons ml-[auto] flex gap-2">
              {secondaryButton || ""}
              {primaryButton || ""}
            </div>
          ) : null}
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        {isColorActive && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            {colorEditor}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PageHeader;
