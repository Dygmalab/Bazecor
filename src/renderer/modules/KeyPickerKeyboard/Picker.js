import React, { Component } from "react";
import Styled from "styled-components";
import { KeyPicker } from ".";

const Style = Styled.div`


`;

class Picker extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      action,
      actions,
      onKeySelect,
      activeTab,
      selectedlanguage,
      kbtype,
      baseCode,
      modCode,
      disable,
      macros,
      superkeys,
      keyCode,
      isWireless,
    } = this.props;

    return (
      <Style>
        <KeyPicker
          onKeySelect={e => onKeySelect(e)}
          code={{
            base: actions[action] > 255 ? baseCode : actions[action],
            modified: modCode,
          }}
          disableMods={[0, 3].includes(action) && activeTab == "disabled"}
          disableMove={![0, 3].includes(action) && activeTab == "super"}
          disableAll={disable}
          selectedlanguage={selectedlanguage}
          kbtype={kbtype}
          keyCode={keyCode}
          macros={macros}
          superkeys={superkeys}
          activeTab={activeTab}
          action={action}
          actions={actions}
          isWireless={isWireless}
        />
      </Style>
    );
  }
}

export default Picker;
