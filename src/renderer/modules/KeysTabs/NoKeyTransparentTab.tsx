import React from "react";
import Styled from "styled-components";

import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";

const Styles = Styled.div`
width: 100%;
h3 {
    margin-bottom: 16px;
}
h4 {
    font-size: 16px;
    flex: 0 0 100%;
    width: 100%;
    margin-top: 24px;
}
.description {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.macro.descriptionColor};
    font-weight: 500;
}
.keysButtonsList {
    margin-top: 8px;
}
.button-config {
    max-width: 116px;
    text-align: center;
}
`;

interface NoKeyTransparentTabProps {
  keyCode: any;
  isStandardView: boolean;
  onKeySelect: (keycode: number) => void;
}
const NoKeyTransparentTab = ({ keyCode, onKeySelect, isStandardView }: NoKeyTransparentTabProps) => (
  <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsNoKeysTransparent`}>
    <div className="tabContentWrapper">
      <div className="buttonsRow">
        <Heading renderAs="h3" headingLevel={3}>
          {i18n.editor.standardView.noKeyTransparent}{" "}
        </Heading>
        <Callout size="sm" className="mt-4">
          <p>{i18n.editor.standardView.callOut}</p>
        </Callout>

        <div className="keysButtonsList">
          <Heading renderAs="h4" headingLevel={4}>
            {i18n.editor.standardView.noKey}
          </Heading>
          <p className="description">{i18n.editor.standardView.noKeyDescription}</p>
          <Button
            variant="config"
            onClick={() => {
              onKeySelect(0);
            }}
            size="sm"
            className="max-w-[124px] w-[124px] text-center mt-1"
            selected={keyCode !== undefined && keyCode.base ? keyCode.base + keyCode.modified === 0 : keyCode === 0}
          >
            {i18n.editor.standardView.noKey}
          </Button>
        </div>
        <div className="keysButtonsList">
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.standardView.transparent}
          </Heading>
          <p className="description">{i18n.editor.standardView.transparentDescription}</p>
          <Button
            variant="config"
            onClick={() => {
              onKeySelect(65535);
            }}
            selected={keyCode !== undefined && keyCode.base ? keyCode.base + keyCode.modified === 65535 : keyCode === 65535}
            size="sm"
            className="max-w-[124px] w-[124px] text-center mt-1"
          >
            {i18n.editor.standardView.transparent}
          </Button>
        </div>
      </div>
    </div>
  </Styles>
);

export default NoKeyTransparentTab;
