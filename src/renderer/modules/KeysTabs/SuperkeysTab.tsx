/* eslint-disable react/no-array-index-key */
import React, { Component } from "react";
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
.w100 {
    width: 100%;
    flex: 0 0 100%;
}
.description {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.macro.descriptionColor};
    flex: 0 0 100%;
    width: 100%;
}
.superKeyGroup {
    display: grid;
    grid-template-columns: minmax(220px, 290px) 1fr;
    grid-gap: 24px;
}
.superkeyHint {
    border-radius: 6px;
    margin-top: -12px;
    padding: 16px;
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
  flex: 0 0 calc(100% - 180px);
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
  padding: 8px 0;
  flex: 0 0 180px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  border: 1px solid ${({ theme }) => theme.styles.standardView.superkeys.key.border};
  border-radius: 3px;
  background-color: ${({ theme }) => theme.styles.standardView.superkeys.key.background};
}
.superKey > div{
  position: absolute;
  bottom: -12px;
  left: 12px;
}

`;

interface SuperkeysTabProps {
  macros: Array<any>;
  keyCode: any;
  isStandardView: any;
  actions: any;
  onKeySelect: any;
  superkeys: any;
}

class SuperkeysTab extends Component<SuperkeysTabProps> {
  keymapDB: any;
  constructor(props: SuperkeysTabProps) {
    super(props);
    this.state = {};
    this.keymapDB = new KeymapDB();
  }

  translateSuperKeyAction = (superkeysSelected: number) => {
    let aux;
    if (superkeysSelected === undefined) {
      return null;
    }
    if (superkeysSelected === 1) {
      aux = this.keymapDB.parse(0);
    } else {
      aux = this.keymapDB.parse(superkeysSelected);
    }
    let translatedAction = "";
    // console.log("Try to translate superkey actions inside SuperKeiItem: ", aux);

    if (aux.extraLabel === "MACRO") {
      const { macros } = this.props;
      if (macros.length > parseInt(aux.label, 10) && macros[parseInt(aux.label, 10)]?.name?.substr(0, 5) !== "") {
        translatedAction = `${aux.label} ${macros[parseInt(aux.label, 10)]?.name?.substr(0, 5).toLowerCase()}`;
      }
    }
    if (aux.label) {
      if (React.isValidElement(aux.label)) return aux.label;
      translatedAction = (aux.extraLabel !== undefined && !aux.extraLabel.includes("+") ? `${aux.extraLabel} ` : "") + aux.label;
    }
    return translatedAction;
  };

  render() {
    const { keyCode, isStandardView, actions, onKeySelect, superkeys } = this.props;
    const KC = keyCode;

    const superk = Array(superkeys.length)
      .fill(0)
      .map((_, i) => i + 53980);

    const adjactions = actions;
    if (adjactions.length < 5) {
      while (adjactions.length < 5) {
        adjactions.push(0);
      }
    }

    const superKeysActions = [
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
    ];

    return (
      <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsSuperkeys`}>
        <div className="tabContentWrapper">
          <Heading headingLevel={3} renderAs="h3">
            {i18n.editor.standardView.superkeys.title}
          </Heading>
          <Callout
            size="sm"
            className="mt-4"
            hasVideo
            media="6Az05_Yl6AU"
            videoTitle="The Greatest Keyboard Feature Of All Time: SUPERKEYS! 🦹‍♀️"
            videoDuration="5:34"
          >
            <p>{i18n.editor.standardView.superkeys.callout1}</p>
            <p>{i18n.editor.standardView.superkeys.callout2}</p>
          </Callout>
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.standardView.superkeys.label}
          </Heading>
          <div className="superKeyGroup mt-1">
            <div className="superKeySelect">
              <Select
                onValueChange={value => {
                  onKeySelect(parseInt(value, 10));
                }}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select Superkey" />
                </SelectTrigger>
                <SelectContent>
                  {superk.map((x, id) => (
                    <SelectItem value={String(x)} disabled={x === -1} key={`superkeyItem-${id}`}>
                      {`${id + 1}. ${superkeys[id].name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={`superKeyInfo ${superkeys[superk.indexOf(KC)] !== undefined ? "animRight" : "animHide"}`}>
              {superkeys[superk.indexOf(KC)] !== undefined ? (
                <div className="superkeyHint">
                  <Heading headingLevel={3} renderAs="h3">
                    {superkeys[superk.indexOf(KC)].name}
                  </Heading>
                  {superKeysActions.map((item, index) => (
                    <div className="superkeyItem" key={`superHint-${index}`}>
                      <div className="superkeyTitle">
                        <h5 className="actionTitle">{item.title}</h5>
                        <p>{item.description}</p>
                      </div>
                      <div className="superKey">
                        {this.translateSuperKeyAction(superkeys[superk.indexOf(KC)].actions[index])}
                        <ListModifier keyCode={superkeys[superk.indexOf(KC)].actions[index]} />
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
  }
}

export default SuperkeysTab;
