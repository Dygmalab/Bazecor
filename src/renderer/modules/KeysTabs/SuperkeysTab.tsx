import React, { useEffect, useMemo, useRef, useState } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import Heading from "@Renderer/components/atoms/Heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
import { SuperkeyPicker } from "@Renderer/component/Button";
import { MacrosType } from "@Renderer/types/macros";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { KeymapDB } from "../../../api/keymap";

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

.description {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.macro.descriptionColor};
    flex: 0 0 100%;
    width: 100%;
}
.superkeyHint {
    border-radius: 6px;
    margin-top: -8px;
    background-color: ${({ theme }) => theme.styles.standardView.superkeys.info.background};
    position: relative;
}
.superkeyHint:after {
  content: "";
  position: absolute;
  top: -8px;
  left: 10px;
  background-color: ${({ theme }) => theme.styles.standardView.superkeys.info.background};
  width: 24px;
  height: 24px;
  border-radius: 3px;
  transform: rotate(45deg);
}
.superkeyHint h3 {
  font-size: 16px;
  margin-top: 10px;
}
.superkeyItem {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border-radius: 3px;
  padding: 12px;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.styles.standardView.superkeys.item.background};
  box-shadow: ${({ theme }) => theme.styles.standardView.superkeys.item.boxShadow};
}

.superkeyTitle h5.actionTitle {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 0;
  color: ${({ theme }) => theme.styles.standardView.superkeys.item.titleColor};
}
.superkeyTitle p {
  font-size: 13px;
  font-weight: 401;
  margin: 0;
  line-height: 1.2em;
  color: ${({ theme }) => theme.styles.standardView.superkeys.item.descriptionColor};
}
.superKey {
  position: relative;
  align-self: center;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.styles.standardView.superkeys.key.border};
  border-radius: 3px;
  background-color: ${({ theme }) => theme.styles.standardView.superkeys.key.background};
}
`;

interface SuperkeysTabProps {
  macros: Array<MacrosType>;
  keyCode: SegmentedKeyType;
  onKeySelect: (key: number) => void;
  superkeys: Array<SuperkeysType>;
  disabled?: boolean;
}

// eslint-disable-next-line
const SuperkeysTab = ({ macros, keyCode, onKeySelect, superkeys, disabled }: SuperkeysTabProps) => {
  const keymapDB = useMemo(() => new KeymapDB(), []);
  const [oldKC, setOldKC] = useState(-1);
  const selected = useRef(-1);

  const superKeysActions = useMemo(
    () => [
      {
        title: i18n.editor.superkeys.actions.tapLabel,
        description: i18n.editor.superkeys.actions.tap,
      },
      {
        title: i18n.editor.superkeys.actions.holdLabel,
        description: i18n.editor.superkeys.actions.hold,
      },
      {
        title: i18n.editor.superkeys.actions.tapAndHoldLabel,
        description: i18n.editor.superkeys.actions.tapAndHold,
      },
      {
        title: i18n.editor.superkeys.actions.doubleTapLabel,
        description: i18n.editor.superkeys.actions.doubleTap,
      },
      {
        title: i18n.editor.superkeys.actions.doubleTapAndHoldLabel,
        description: i18n.editor.superkeys.actions.doubleTapAndHold,
      },
    ],
    [],
  );

  const handleSelect = (value: string) => {
    selected.current = parseInt(value, 10);
    onKeySelect(selected.current + 53980);
  };

  useEffect(() => {
    const KC = keyCode.base + keyCode.modified;
    if (KC !== oldKC) {
      setOldKC(keyCode.base + keyCode.modified);
      selected.current = KC >= 53980 ? keyCode.base : -1;
    }
  }, [keyCode, oldKC]);

  return (
    <Styles className={`w-full  tabsSuperkeys ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper w-full">
        <Callout
          size="sm"
          className="mt-0 w-full"
          hasVideo
          media="6Az05_Yl6AU"
          videoTitle="The Greatest Keyboard Feature Of All Time: SUPERKEYS! 🦹‍♀️"
          videoDuration="5:34"
        >
          <p>{i18n.editor.standardView.superkeys.callout1}</p>
          <p>{i18n.editor.standardView.superkeys.callout2}</p>
        </Callout>

        <div className="superKeyGroup flex flex-col flex-wrap gap-3 py-4">
          <div>
            <Heading headingLevel={4} renderAs="h4" className="!mt-0 mb-1 text-base">
              {i18n.editor.standardView.superkeys.label}
            </Heading>
            <div className="superKeySelect">
              <Select onValueChange={value => handleSelect(value)} value={String(selected.current)}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select Superkey" />
                </SelectTrigger>
                <SelectContent>
                  {superkeys.map((x, id) => (
                    // eslint-disable-next-line
                    <SelectItem value={String(id)} disabled={x.id === selected.current} key={`superkeyItem-${x}-${String(id)}`}>
                      {`${id + 1}. ${superkeys[id].name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className={`superKeyInfo ${superkeys[selected.current] !== undefined ? "flex animRight" : "animHide"}`}>
            {superkeys[selected.current] !== undefined ? (
              <div className="superkeyHint p-4 flex flex-wrap gap-0.5">
                {superKeysActions.map((item, index) => (
                  <>
                    <SuperkeyPicker
                      index={index}
                      key={`superHint-${item.title}${String(index)}`}
                      selected={selected.current}
                      superkeys={superkeys}
                      icon={<></>}
                      title={item.title}
                      description=""
                      elementActive={false}
                      onClick={() => console.log("onClick")}
                      macros={macros}
                      keymapDB={keymapDB}
                      updateAction={() => console.log("update action")}
                      variant="subtle"
                    />
                  </>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default SuperkeysTab;
