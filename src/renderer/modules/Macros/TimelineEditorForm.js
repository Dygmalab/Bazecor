import React, { Component } from "react";
import Styled from "styled-components";
import i18n from "../../i18n";

import TimelineEditorMacroTable from "./TimelineEditorMacroTable";

const Styles = Styled.div`
.root {
  display: flex;
  flex-wrap: wrap;
}
.margin {
  margin: 1rem;
}
.textField {
  inline-size: -webkit-fill-available;
  display: flex;
}
.code {
  width: -webkit-fill-available;
}
.button {
  float: right;
}
.buttons {
  display: flex;
  position: relative;
  place-content: space-between;
  margin-top: 1rem;
}
.centered {
  place-content: center;
}
.bg {
  margin-right: 0px;
}
.form-row {
  padding: 0;
}
.row-buttons {
  justify-content: center;
}
.applybutton {
  float: right;
  margin-right: 1rem;
}
.goStart {
  width: 50px;
  font-size: 24px;
  align-self: center;
  text-align-last: center;
  padding: 0;
}
.goEnd {
  width: 50px;
  font-size: 24px;
  align-self: center;
  text-align-last: center;
  padding: 0;
}

position: relative;
display: flex;
`;

class MacroForm extends Component {
  constructor(props) {
    super(props);
  }

  wheelPosStart = () => {
    const { updateScroll } = this.props;
    const scrollContainer = document.getElementById("hwTracker").firstChild;
    scrollContainer.scrollLeft = 0;
    updateScroll(0);
  };

  wheelPosEnd = () => {
    const { updateScroll } = this.props;
    const scrollContainer = document.getElementById("hwTracker").firstChild;
    // console.log("checking end pos of scroll", scrollContainer, scrollContainer.scrollWidth);
    updateScroll(scrollContainer.scrollWidth);
  };

  render() {
    const { macro, updateActions, keymapDB, componentWidth, updateScroll, scrollPos } = this.props;
    if (macro === undefined || macro.actions === undefined) {
      return <div>{i18n.editor.macros.macroTab.noMacro}</div>;
    }
    return (
      <Styles>
        <div className="goStart" onClick={this.wheelPosStart}>
          {"<"}
        </div>
        <TimelineEditorMacroTable
          key={JSON.stringify(macro.actions)}
          macro={macro}
          updateActions={updateActions}
          keymapDB={keymapDB}
          componentWidth={componentWidth}
          updateScroll={updateScroll}
          scrollPos={scrollPos}
        />
        <div className="goEnd" onClick={this.wheelPosEnd}>
          {">"}
        </div>
      </Styles>
    );
  }
}
export default MacroForm;
