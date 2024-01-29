/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

// Components
import { SuperkeyPicker } from "../../component/Button";

// Icons
import { IconKeysPress, IconKeysTapHold, IconKeysHold, IconKeys2Tap, IconKeys2TapHold } from "../../component/Icon";

// API's
import { i18n } from "@Renderer/i18n";

const Style = Styled.div`
.keyWrapper {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 4px;
    margin-top: 24px;
}
`;

function SuperkeyActions({
  isStandardViewSuperkeys,
  superkeys,
  selected,
  selectedAction,
  macros,
  updateAction,
  changeAction,
  keymapDB,
}: any) {
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
                isStandardViewSuperkeys={isStandardViewSuperkeys}
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

SuperkeyActions.propTypes = {
  isStandardViewSuperkeys: PropTypes.bool.isRequired,
  superkeys: PropTypes.any.isRequired,
  selected: PropTypes.number.isRequired,
  selectedAction: PropTypes.number.isRequired,
  macros: PropTypes.any.isRequired,
  updateAction: PropTypes.func.isRequired,
  changeAction: PropTypes.func.isRequired,
  keymapDB: PropTypes.any.isRequired,
};

export default SuperkeyActions;
