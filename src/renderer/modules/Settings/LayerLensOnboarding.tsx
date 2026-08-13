/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
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
import { ipcRenderer } from "electron";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@Renderer/components/atoms/Card";
import { IconInformation, IconChevronDown } from "@Renderer/components/atoms/icons";

// Assets
import assignLensKeys from "@Assets/Animation.gif";
import turnItOn from "@Assets/TurnItOn.gif";
import showItYourWay from "@Assets/ShotItYourWay.gif";
import moveAndResizeIt from "@Assets/Move&ResizeIt.gif";

interface Step {
  title: string;
  description: string;
  image: string;
}

const steps: Step[] = [
  {
    title: "Assign the Lens Keys",
    description: "Open the layout editor and assign LENS TAP / LENS HOLD to a key to show or hide the keyboard overlay.",
    image: assignLensKeys,
  },
  {
    title: "Turn it on",
    description: "Enable Layer Lens in the Settings below.",
    image: turnItOn,
  },
  {
    title: "Show it your way",
    description:
      'Turn on "Show only on layer change" to automatically reveal the overlay for a few seconds every time you switch layers.',
    image: showItYourWay,
  },
  {
    title: "Move and resize it",
    description: "Enable Resize Mode to click, drag, and resize the overlay exactly where you want it on your screen.",
    image: moveAndResizeIt,
  },
];

const LayerLensOnboarding = () => {
  const [collapsed, setCollapsed] = useState(false);
  // The stored choice is read over IPC, so the card can't render until it lands
  // — otherwise instructions the user folded away flash back open on every visit.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ipcRenderer
      .invoke("lens:get-onboarding-collapsed")
      .then((v: boolean) => setCollapsed(!!v))
      .catch(() => setCollapsed(false))
      .finally(() => setLoaded(true));
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    ipcRenderer.invoke("lens:set-onboarding-collapsed", next).catch(() => {});
  };

  if (!loaded) return null;

  return (
    <Card className="mt-3 max-w-2xl mx-auto" variant="default">
      <CardHeader>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          className="flex w-full items-center justify-between gap-2 bg-transparent p-0 text-left"
        >
          <CardTitle variant="default">
            <IconInformation /> First time using Layer Lens
          </CardTitle>
          <span
            className={`inline-flex shrink-0 text-gray-500 transition-transform dark:text-gray-100 ${
              collapsed ? "" : "rotate-180"
            }`}
          >
            <IconChevronDown />
          </span>
        </button>
        {!collapsed && (
          <CardDescription className="mt-1">
            Layer Lens is an on-screen overlay that shows your keyboard&apos;s active layer. Here&apos;s how to get started.
          </CardDescription>
        )}
      </CardHeader>
      {!collapsed && (
        <CardContent>
          <div className="grid grid-cols-1 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500 dark:bg-gray-600 dark:text-gray-100">
                    {index + 1}
                  </span>
                  <div>
                    <p className="m-0 text-sm font-semibold tracking-tight">{step.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
                {/* A fixed video ratio keeps the four cards aligned, and object-contain
                    fits each asset inside it whatever its own ratio is: three are ~16:9,
                    but TurnItOn.gif is a much wider 2.7:1 that object-cover would crop by
                    a third. The tinted box makes the leftover letterbox read as framing. */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="aspect-video w-full rounded-lg border border-gray-100 bg-gray-25/60 object-contain dark:border-gray-600 dark:bg-gray-700/40"
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LayerLensOnboarding;
