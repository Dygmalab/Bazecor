import React from "react";
import { i18n } from "@Renderer/i18n";
import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { KeyPickerReduced } from "@Renderer/modules/KeyPickerKeyboard";
import ModPicker from "@Renderer/modules/KeyPickerKeyboard/ModPicker";
import DualFunctionPicker from "@Renderer/modules/KeyPickerKeyboard/DualFunctionPicker";

interface KeysTabProps {
  action: any;
  actions: any;
  keyCode: any;
  code: any;
  isStandardView: boolean;
  actTab: string;
  superkeyAction: number;
  selectedlanguage: string;
  kbtype: string;
  onKeyPress: (key: any) => void;
}

const KeysTab: React.FC<KeysTabProps> = ({
  action,
  actions,
  keyCode,
  code,
  isStandardView,
  actTab,
  superkeyAction,
  selectedlanguage,
  kbtype,
  onKeyPress,
}) => (
  // const appliedMod = Array(7936)
  //   .fill(null)
  //   .map((_, idx) => 256 + idx);

  <div className={`${isStandardView ? "standardViewTab" : ""} tabsKey flex flex-wrap h-full`}>
    <div className="tabContentWrapper w-full">
      {isStandardView ? (
        <>
          <Heading headingLevel={3} renderAs="h3" className="counterIndicator counter1">
            {i18n.editor.standardView.keys.standardViewTitle}
          </Heading>
          <Callout size="sm" className="mt-4">
            <p>{i18n.editor.standardView.keys.callOut}</p>
          </Callout>
        </>
      ) : (
        <Heading headingLevel={4} renderAs="h4">
          {i18n.editor.standardView.keys.keys}
        </Heading>
      )}
      <KeyPickerReduced
        actions={actions}
        action={action}
        onKeySelect={onKeyPress}
        code={isStandardView ? code : { base: 4, modified: 0 }}
        showSelected={isStandardView}
        keyCode={keyCode}
        disableMove={false}
        disableMods={!!((superkeyAction === 0 || superkeyAction === 3) && actTab === "disabled")}
        actTab={actTab}
        superName="superName"
        selectedlanguage={selectedlanguage}
        kbtype={kbtype}
      />
      {isStandardView && (
        <div className={`enhanceKeys ${(superkeyAction === 0 || superkeyAction === 3) && actTab === "super" ? "disabled" : ""}`}>
          <Heading renderAs="h3" headingLevel={3} className="counterIndicator counter2 mt-2">
            {i18n.editor.standardView.keys.enhanceTitle}
          </Heading>
          <Callout
            size="sm"
            className="mt-4 mb-4"
            hasVideo
            media="Yk8S0TJuZ8A"
            videoTitle="These keys have a SECRET function"
            videoDuration="3:57"
          >
            <p>{i18n.editor.standardView.keys.callOutEnhance}</p>
          </Callout>
          <div className="cardButtons cardButtonsModifier">
            <Heading renderAs="h4" headingLevel={4}>
              {i18n.editor.standardView.keys.addModifiers}
            </Heading>
            <p>{i18n.editor.standardView.keys.descriptionModifiers}</p>
            <ModPicker keyCode={code} onKeySelect={onKeyPress} isStandardView={isStandardView} />
          </div>
          {actTab !== "super" && (
            <div className="cardButtons cardButtonsDual">
              <Heading headingLevel={4} renderAs="h4">
                {i18n.editor.standardView.keys.addDualFunction}
              </Heading>
              <p>{i18n.editor.standardView.keys.dualFunctionDescription}</p>
              <DualFunctionPicker keyCode={code} onKeySelect={onKeyPress} activeTab={actTab} isStandardView={isStandardView} />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
export default KeysTab;
