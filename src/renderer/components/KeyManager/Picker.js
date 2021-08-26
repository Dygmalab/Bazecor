import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Styled from "styled-components";
import { KeyPicker } from "../KeyPicker";

const Style = Styled.div`
.picker-select-card {
    min-height: 100%;
    height: 320px;
    padding: 0;
}
.nospacing{
    padding: 0;
    margin: 0;
}
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
      onReplaceKey,
      activeTab,
      selectedlanguage,
      kbtype,
      baseCode,
      modCode
    } = this.props;

    return (
      <Style>
        <Card className="picker-select-card">
          <KeyPicker
            onKeySelect={e => onReplaceKey(e, -1)}
            code={{
              base: actions[action] > 255 ? baseCode : actions[action],
              modified: modCode
            }}
            disableMods={[0, 3].includes(action) && activeTab == "super"}
            disableMove={![0, 3].includes(action) && activeTab == "super"}
            selectedlanguage={selectedlanguage}
            kbtype={kbtype}
          />
        </Card>
      </Style>
    );
  }
}

export default Picker;