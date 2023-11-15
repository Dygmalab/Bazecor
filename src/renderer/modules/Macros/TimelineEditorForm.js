import React, { Component } from "react";
import Styled from "styled-components";
import { IconArrowChevronLeft, IconArrowChevronRight } from "@Renderer/component/Icon";
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
  left: 3px;
}
.goEnd {
  right: 3px;
}
.goStart,
.goEnd {
  width: 50px;
  height: calc(100% - 6px);
  padding: 0;
  top: 3px;
  position: absolute;
  backdrop-filter: blur(3px);
  border-radius: 4px;
  justify-content: center;
  align-self: center;
  text-align-last: center;
  z-index: 9;
  display: flex;
  transition: 300ms background-color ease-in-out;
  color: ${({ theme }) => theme.styles.button.navButton.color};
  background-color: ${({ theme }) => theme.styles.button.navButton.background};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.styles.button.navButton.backgroundHover};
  }
}
.goStart svg,
.goEnd svg {
  margin-top: auto;
  margin-bottom: auto;
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
          <IconArrowChevronLeft />
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
          <IconArrowChevronRight />
        </div>
      </Styles>
    );
  }
}
export default MacroForm;
