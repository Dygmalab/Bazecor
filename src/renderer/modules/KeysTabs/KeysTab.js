import React, { Component } from "react";
import Styled from "styled-components";

import { i18n } from "@Renderer/i18n";

import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { KeyPickerReduced } from "@Renderer/modules/KeyPickerKeyboard";
import ModPicker from "@Renderer/modules/KeyPickerKeyboard/ModPicker";
import DualFunctionPicker from "@Renderer/modules/KeyPickerKeyboard/DualFunctionPicker";

const Styles = Styled.div`
display: flex;
flex-wrap: wrap;
height: inherit;
h4 {
    font-size: 16px;
    flex: 0 0 100%;
    width: 100%;
    margin-top: 24px;
}
.callOut {
    width: 100%;
    flex: 0 0 100%;
}
.w100 {
    width: 100%;
    flex: 0 0 100%;
}
.groupButtons {
  padding: 0;
}
.cardButtons .groupButtons .button-config {
  padding: 8px 2px;
}
.cardButtonsModifier .groupButtons{
  background-color: transparent;
  .modPickerInner {
    padding: 0 0 0 4px;
  }
}
.cardButtonsDual {
  .groupButtons {
    padding: 4px 2px;
  }
}
.isDisabled {
  opacity: 0.35;
  &:hover: not-allowed;
}
&.tabsKey {
  .cardButtons {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      padding: 8px 16px;
      h4 {
        font-size: 14px;
        margin-top: 2px;
        margin-bottom: 2px;
      }
  }
  .cardButtons + .cardButtons {
      margin-top: 2px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
  }
}
`;

class KeysTab extends Component {
  constructor(props) {
    super(props);
    this.appliedMod = Array(7936)
      .fill()
      .map((_, idx) => 256 + idx);
  }

  render() {
    const { action, actions, keyCode, code, isStandardView, actTab, superkeyAction, selectedlanguage, kbtype, onKeyPress } =
      this.props;
    return (
      <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsKey`}>
        <div className="tabContentWrapper">
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
            // disableMods={false}
            disableMods={!!((superkeyAction == 0 || superkeyAction == 3) && actTab === "disabled")}
            // disableMove={![0, 3].includes(actions) && actTab == "super"}
            actTab={actTab}
            superName="superName"
            selectedlanguage={selectedlanguage}
            kbtype={kbtype}
          />
          {isStandardView ? (
            <div
              className={`enhanceKeys ${(superkeyAction == 0 || superkeyAction == 3) && actTab === "super" ? "disabled" : ""}`}
            >
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
              {actTab !== "super" ? (
                <div className="cardButtons cardButtonsDual">
                  <Heading headingLevel={4} renderAs="h4">
                    {i18n.editor.standardView.keys.addDualFunction}
                  </Heading>
                  <p>{i18n.editor.standardView.keys.dualFunctionDescription}</p>
                  <DualFunctionPicker
                    keyCode={code}
                    onKeySelect={onKeyPress}
                    activeTab={actTab}
                    isStandardView={isStandardView}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : null}
        </div>
      </Styles>
    );
  }
}

export default KeysTab;
