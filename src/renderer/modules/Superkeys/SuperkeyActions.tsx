/* eslint-disable react/forbid-prop-types */
import React from "react";
import Styled from "styled-components";

// Components
import { SuperkeyPicker } from "@Renderer/component/Button";

// Icons
import { IconKeysPress, IconKeysTapHold, IconKeysHold, IconKeys2Tap, IconKeys2TapHold } from "@Renderer/components/atoms/icons";

// API's
import { i18n } from "@Renderer/i18n";
import { SuperKeyActionsProps } from "@Renderer/types/superkeys";

const Style = Styled.div`
.keyWrapper {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 4px;
    margin-top: 24px;
}
`;

function SuperkeyActions(props: SuperKeyActionsProps) {
  const { superkeys, selected, selectedAction, macros, updateAction, changeAction, keymapDB } = props;
  const rows = [
    {
      id: 0,
      icon: <IconKeysPress />,
      title: i18n.editor.superkeys.actions.tapLabel,
      description: i18n.editor.superkeys.actions.tap,
    },
    {
      id: 1,
      icon: <IconKeysHold />,
      title: i18n.editor.superkeys.actions.holdLabel,
      description: i18n.editor.superkeys.actions.hold,
    },
    {
      id: 2,
      icon: <IconKeysTapHold />,
      title: i18n.editor.superkeys.actions.tapAndHoldLabel,
      description: i18n.editor.superkeys.actions.tapAndHold,
    },
    {
      id: 3,
      icon: <IconKeys2Tap />,
      title: i18n.editor.superkeys.actions.doubleTapLabel,
      description: i18n.editor.superkeys.actions.doubleTap,
    },
    {
      id: 4,
      icon: <IconKeys2TapHold />,
      title: i18n.editor.superkeys.actions.doubleTapAndHoldLabel,
      description: i18n.editor.superkeys.actions.doubleTapAndHold,
    },
  ];

  return (
    <Style>
      <div className="keyWrapper">
        {superkeys !== undefined && superkeys.length > 0
          ? rows.map(item => (
              <SuperkeyPicker
                index={item.id}
                selected={selected}
                superkeys={superkeys}
                icon={item.icon}
                key={`skA-${item.id}`}
                title={item.title}
                description={item.description}
                elementActive={selectedAction === item.id}
                onClick={changeAction}
                macros={macros}
                keymapDB={keymapDB}
                updateAction={updateAction}
              />
            ))
          : ""}
      </div>
    </Style>
  );
}

export default SuperkeyActions;
