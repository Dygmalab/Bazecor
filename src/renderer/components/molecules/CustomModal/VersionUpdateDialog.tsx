// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/core";
// import log from "electron-log/renderer";
import SemVer from "semver";
import parse, { domToReact } from "html-react-parser";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { i18n } from "@Renderer/i18n";
import Heading from "@Renderer/components/atoms/Heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@Renderer/components/atoms/Accordion";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { version } from "../../../../../package.json";

interface VersionUpdateProps {
  open: boolean;
  onCancel: () => void;
  oldVersion: string;
  handleUpdate: () => void;
}

interface Releases {
  name: string;
  version: string;
  date: string;
  content: string;
}

const options = {
  // eslint-disable-next-line consistent-return
  replace({ name, children }: any) {
    if (name === "h2") {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return (
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            paddingBottom: ".3rem",
            borderBottom: "1px solid #878787b3",
            lineHeight: "1.25",
            marginTop: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          {domToReact(children, options)}
        </h2>
      );
    }
    if (name === "p") {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return (
        <p style={{ marginBottom: "1rem", fontSize: "16px", fontWeight: "200", lineHeight: "1.5", wordWrap: "break-word" }}>
          {domToReact(children, options)}
        </p>
      );
    }
    if (name === "ul") {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return (
        <p
          style={{
            marginTop: "0",
            marginBottom: "1rem",
            paddingLeft: "1.5rem",
            listStyleType: "disc",
            fontSize: "16px",
            fontWeight: "200",
            lineHeight: "1.5",
            wordWrap: "break-word",
          }}
        >
          {domToReact(children, options)}
        </p>
      );
    }
  },
};

export function VersionUpdateDialog(props: VersionUpdateProps) {
  const { open, onCancel, oldVersion, handleUpdate } = props;
  const [data, setData] = useState<Releases[]>(undefined);

  useEffect(() => {
    async function fetchData() {
      const releases: Releases[] = [];
      const octokit = new Octokit();
      const GHdata = await octokit.request("GET /repos/{owner}/{repo}/releases", {
        owner: "Dygmalab",
        repo: "Bazecor",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        mediaType: {
          format: "full",
        },
      });
      // log.info("Testing", GHdata);
      GHdata.data.forEach(release => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { prerelease, name, published_at, body_html, tag_name } = release;
        const newRelease = { name, version: tag_name, date: published_at, content: body_html };
        if (!prerelease) releases.push(newRelease);
      });
      // log.info("Data from Dialog: ", releases, version, oldVersion);
      const parsedData = releases.filter(r =>
        oldVersion
          ? SemVer.compare(r.version, oldVersion) > 0 && SemVer.compare(r.version, version) <= 0
          : SemVer.compare(r.version, version) === 0,
      );
      setData(parsedData);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        handleUpdate();
        onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.app.updateChanges.title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 mt-2">
          {data === undefined ? (
            <LogoLoader firmwareLoader />
          ) : (
            <div
              className={`toggleButtonsInner flex flex-col items-center justify-start gap-1 p-[4px] rounded-regular border-[1px] border-solid border-gray-100/60 bg-white/30 dark:border-transparent dark:bg-gray-900/25 w-full [&_.button-config]:w-full [&_.button-config]:basis-full [&_.button-config]:text-left [&_.button-config.disabled]:opacity-25 [&_.button-config.disabled]:pointer-events-none"}`}
            >
              <Accordion type="single" collapsible className="w-full" defaultValue="item0">
                {data.map((elem, i) => (
                  <AccordionItem
                    value={`item${i}`}
                    className="bg-[#fff]/50 dark:bg-gray-700 rounded border-none border-0"
                    key={elem.version}
                  >
                    <div>
                      <AccordionTrigger className="px-2 py-3 bg-transparent bg-dark:bg-black/5 mb-[-1px] hover:no-underline">
                        <Heading className="pl-[22px]">
                          <div className="flex items-center">
                            {elem.name}
                            <p className="ml-4 font-extralight text-sm text-gray-200">{new Date(elem.date).toDateString()}</p>
                          </div>
                        </Heading>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="h-40v overflow-auto pl-8 pr-8">{parse(elem.content, options)}</div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
