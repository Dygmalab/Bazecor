import React, { useMemo } from "react";

import { TabLayoutEditorProps } from "@Renderer/types/pages";

import { i18n } from "@Renderer/i18n";

import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import { OverlayCodes } from "@Renderer/../hw/overlay";

interface LayerLensTabProps extends TabLayoutEditorProps {
  activeTab?: string;
  action?: number;
}

// Superkey action slots, by index: 0 = Tap, 1 = Hold, 2 = Tap & hold, 3 = 2Tap, 4 = 2Tap & hold.
const SUPERKEY_TAP_SLOTS = [0, 3];
// LENS TAP (OVERLAY_TAP) is also allowed on the Hold slot, so a superkey can send the
// "toggle Layer Lens" keycode when the key is held.
const TOGGLE_LENS_ALLOWED_SLOTS = [0, 1, 3];

function LayerLensTab(props: LayerLensTabProps) {
  const { keyCode, onKeySelect, disabled, activeTab, action } = props;

  const isSuperkeyContext = activeTab === "super";
  // SK-LENS (OVERLAY_KEY) re-implements the tap/hold/double-tap gestures
  // that a superkey action slot already represents, so it can't be nested inside one.
  // Hide it entirely from the Superkeys menu instead of just disabling it.
  const hideSuperKey = isSuperkeyContext;
  // Toggle Layer Lens (OVERLAY_TAP) makes sense on the tap-triggered slots and on Hold.
  const toggleDisabled = disabled || (isSuperkeyContext && !TOGGLE_LENS_ALLOWED_SLOTS.includes(action));
  // Hold Layer Lens (OVERLAY_HOLD) is the inverse: a Tap/2Tap slot already only
  // fires on a tap gesture, so a "hold" assignment there could never trigger.
  const holdDisabled = disabled || (isSuperkeyContext && SUPERKEY_TAP_SLOTS.includes(action));

  const KC = useMemo(() => {
    if (typeof keyCode === "number") {
      return keyCode;
    }
    if (typeof keyCode !== "number" && keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }

    return undefined;
  }, [keyCode]);

  return (
    <div className={`tabsLayerLens w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper">
        <div className="buttonsRow">
          <Callout size="sm" className="mt-0">
            <p>{i18n.editor.standardView.layerLens.callOut}</p>
          </Callout>
          <div className="flex flex-wrap gap-1 py-2">
            <div className="flex-1 py-2">
              <Heading renderAs="h4" headingLevel={4} className="text-base">
                {i18n.editor.standardView.layerLens.toggleLayerLens}
              </Heading>
              <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                {i18n.editor.standardView.layerLens.toggleLayerLensDescription}
              </p>
              <Button
                variant="config"
                onClick={() => {
                  onKeySelect(OverlayCodes.OVERLAY_TAP);
                }}
                selected={KC === OverlayCodes.OVERLAY_TAP}
                disabled={toggleDisabled}
                className="w-max-[124px] w-[124px] text-center mt-2"
                size="sm"
              >
                {i18n.editor.standardView.layerLens.toggleLayerLens}
              </Button>
            </div>
            <div className="flex-1 py-2">
              <Heading renderAs="h4" headingLevel={4} className="text-base">
                {i18n.editor.standardView.layerLens.holdLayerLens}
              </Heading>
              <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                {i18n.editor.standardView.layerLens.holdLayerLensDescription}
              </p>
              <Button
                variant="config"
                onClick={() => {
                  onKeySelect(OverlayCodes.OVERLAY_HOLD);
                }}
                selected={KC === OverlayCodes.OVERLAY_HOLD}
                disabled={holdDisabled}
                className="w-max-[124px] w-[124px] text-center mt-2"
                size="sm"
              >
                {i18n.editor.standardView.layerLens.holdLayerLens}
              </Button>
            </div>
            {!hideSuperKey && (
              <div className="flex-1 py-2">
                <Heading renderAs="h4" headingLevel={4} className="text-base">
                  {i18n.editor.standardView.layerLens.superKey}
                </Heading>
                <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                  {i18n.editor.standardView.layerLens.superKeyDescription}
                </p>
                <Button
                  variant="config"
                  onClick={() => {
                    onKeySelect(OverlayCodes.OVERLAY_KEY);
                  }}
                  selected={KC === OverlayCodes.OVERLAY_KEY}
                  disabled={disabled}
                  className="w-max-[124px] w-[124px] text-center mt-2"
                  size="sm"
                >
                  {i18n.editor.standardView.layerLens.superKey}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayerLensTab;
