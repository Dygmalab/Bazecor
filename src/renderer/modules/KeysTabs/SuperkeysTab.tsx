import React, { useMemo } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import ListModifier from "@Renderer/components/molecules/ListModifiers/ListModifiers";
import Heading from "@Renderer/components/atoms/Heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
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
    margin-top: -12px;
    max-width: 762px;
    background-color: ${({ theme }) => theme.styles.standardView.superkeys.info.background};
    position: relative;
}
.superkeyHint:after {
  content: "";
  position: absolute;
  top: 28px;
  left: -12px;
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

.superkeyItem + .superkeyItem  {
  margin-top: 1px;
}
.superkeyTitle {
  padding-right: 24px;
}
.superkeyTitle h5.actionTitle {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 4px 0 1px 0;
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
  macros: Array<any>;
  keyCode: any;
  isStandardView: any;
  actions: any;
  onKeySelect: any;
  superkeys: any;
  disabled?: boolean;
}

const SuperkeysTab = ({ macros, keyCode, isStandardView, actions, onKeySelect, superkeys, disabled }: SuperkeysTabProps) => {
  const keymapDB = useMemo(() => new KeymapDB(), []);
  const KC = keyCode.base + keyCode.modified;

  const translateSuperKeyAction = superkeysSelected => {
    if (superkeysSelected === undefined) return null;

    const aux = superkeysSelected === 1 ? keymapDB.parse(0) : keymapDB.parse(superkeysSelected);
    let translatedAction = "";

    if (aux.extraLabel === "MACRO") {
      if (macros.length > parseInt(aux.label, 10) && macros[parseInt(aux.label, 10)]?.name?.substr(0, 5) !== "") {
        translatedAction = `${aux.label} ${macros[parseInt(aux.label, 10)]?.name?.substr(0, 5).toLowerCase()}`;
      }
    }
    if (aux.label) {
      translatedAction = (aux.extraLabel !== undefined && !aux.extraLabel.includes("+") ? `${aux.extraLabel} ` : "") + aux.label;
    }
    return translatedAction;
  };

  const superk = useMemo(
    () =>
      Array(superkeys.length)
        .fill(0)
        .map((_, i) => i + 53980),
    [superkeys],
  );

  // const adjustedActions = useMemo(() => {
  //   const adjactions = [...actions];
  //   while (adjactions.length < 5) {
  //     adjactions.push(0);
  //   }
  //   return adjactions;
  // }, [actions]);

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

  // console.log("Superkey - KC: ", KC);
  // console.log("superk: ", superk);
  // console.log("Eita: ", superk.indexOf(KC));

  return (
    <Styles
      className={`${isStandardView ? "standardViewTab" : ""} tabsSuperkeys ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="tabContentWrapper">
        <Callout
          size="sm"
          className="mt-0"
          hasVideo
          media="6Az05_Yl6AU"
          videoTitle="The Greatest Keyboard Feature Of All Time: SUPERKEYS! 🦹‍♀️"
          videoDuration="5:34"
        >
          <p>{i18n.editor.standardView.superkeys.callout1}</p>
          <p>{i18n.editor.standardView.superkeys.callout2}</p>
        </Callout>

        <div className="superKeyGroup flex gap-1 flex-wrap py-4">
          <div>
            <Heading headingLevel={4} renderAs="h4" className="!mt-0 mb-1 text-base">
              {i18n.editor.standardView.superkeys.label}
            </Heading>
            <div className="superKeySelect">
              <Select onValueChange={value => onKeySelect(parseInt(value, 10))}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select Superkey" />
                </SelectTrigger>
                <SelectContent>
                  {superk.map((x, id) => (
                    // eslint-disable-next-line
                    <SelectItem value={String(x)} disabled={x === -1} key={`superkeyItem-${id}`}>
                      {`${id + 1}. ${superkeys[id].name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className={`superKeyInfo ${superkeys[superk.indexOf(KC)] !== undefined ? "animRight" : "animHide"}`}>
            {superkeys[superk.indexOf(KC)] !== undefined ? (
              <div className="superkeyHint p-4">
                <Heading headingLevel={3} renderAs="h3">
                  {superkeys[superk.indexOf(KC)].name}
                </Heading>
                {superKeysActions.map((item, index) => (
                  // eslint-disable-next-line
                  <div className="superkeyItem flex justify-between items-center" key={`superHint-${index}`}>
                    <div className="superkeyTitle">
                      <h5 className="actionTitle">{item.title}</h5>
                      {/* <p>{item.description}</p> */}
                    </div>
                    <div className="superKey w-28 text-xs p-2">
                      {translateSuperKeyAction(superkeys[superk.indexOf(KC)].actions[index])}
                      <div className="scale-90 absolute -left-2 -bottom-3">
                        <ListModifier keyCode={superkeys[superk.indexOf(KC)].actions[index]} />
                      </div>
                    </div>
                  </div>
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
