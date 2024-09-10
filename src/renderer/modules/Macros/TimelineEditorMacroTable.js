import React, { Component } from "react";
import PropTypes, { object } from "prop-types";
import log from "electron-log/renderer";
import Styled from "styled-components";

import { MdUnfoldLess, MdKeyboardArrowUp, MdKeyboardArrowDown, MdTimer } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import KeyMacro from "./KeyMacro";

const Styles = Styled.div`
.root {
  display: flex;
  flexWrap: wrap;
}
.margin {
  margin: 1rem;
}
.padding {
  padding-top: 0.2rem;
  padding-bottom: 1rem;
}
.textField {
  flex-basis: 444px;
  margin: 0px;
  margin-right: 2rem;
},
.code {
  width: -webkit-fill-available;
}
.button {
  float: right;
}
.buttonAdd {
  marginLeft: 25%;
}
.list {
  max-height: 429px;
  min-height: 429px;
  overflow: auto;
}
.list::-webkit-scrollbar {
  display: none;
}
.border {
  border: solid 1px #bbbbbb;
  border-radius: 4px;
}
.flex {
  display: flex;
  position: relative;
  place-content: space-between;
  margin: 1rem;
}

&.trackingWrapper {
    position: relative;
    z-index: 1;

    background-color: ${({ theme }) => theme.styles.macro.trackingBackground};
    overflow-x: hidden;
    position: relative;
    > div {
      width: inherit;
      overflow-x: auto;
      padding-left: 62px;
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: transparent;
        background-color: white;
      }
      ::-webkit-scrollbar-thumb {
        background-color: grey;
      }
    }
}
.timelinetracking {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    width: fit-content;
    padding-right: 62px;
}
`;

class TimelineEditorMacroTable extends Component {
  constructor(props) {
    super(props);

    this.horizontalWheel = React.createRef();

    this.state = {
      rows: [],
      macro: props.macro,
    };
    this.keymapDB = props.keymapDB;
    this.modifiers = [
      { name: "LEFT SHIFT", keyCode: 225, color: "#e1f3f7" },
      { name: "RIGHT SHIFT", keyCode: 229, color: "#e1f3f7" },
      { name: "LEFT CTRL", keyCode: 224, color: "#f5e4e4" },
      { name: "RIGHT CTRL", keyCode: 228, color: "#f5e4e4" },
      { name: "LEFT ALT", keyCode: 226, color: "#faf8e1" },
      { name: "RIGHT ALT", keyCode: 230, color: "#f2e7f5" },
      { name: "LEFT OS", keyCode: 227, color: "#e6f0e4" },
      { name: "RIGHT OS", keyCode: 231, color: "#e6f0e4" },
    ];
    this.actionTypes = [
      {
        enum: "MACRO_ACTION_END",
        name: "End macro",
        icon: "",
        smallIcon: "",
      },
      {
        enum: "MACRO_ACTION_STEP_INTERVAL",
        name: "Delay",
        icon: <MdTimer fontSize="large" />,
        smallIcon: <MdTimer />,
      },
      {
        enum: "MACRO_ACTION_STEP_WAIT",
        name: "Delay",
        icon: <MdTimer fontSize="large" />,
        smallIcon: <MdTimer />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYDOWN",
        name: "Function Key Press",
        icon: <MdKeyboardArrowDown fontSize="large" />,
        smallIcon: <MdKeyboardArrowDown />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYUP",
        name: "Function Key Release",
        icon: <MdKeyboardArrowUp fontSize="large" />,
        smallIcon: <MdKeyboardArrowUp />,
      },
      {
        enum: "MACRO_ACTION_STEP_TAP",
        name: "Fn. Press & Release",
        icon: <MdUnfoldLess fontSize="large" />,
        smallIcon: <MdUnfoldLess />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYCODEDOWN",
        name: "Key Press",
        icon: <MdKeyboardArrowDown fontSize="large" />,
        smallIcon: <MdKeyboardArrowDown />,
      },
      {
        enum: "MACRO_ACTION_STEP_KEYCODEUP",
        name: "Key Release",
        icon: <MdKeyboardArrowUp fontSize="large" />,
        smallIcon: <MdKeyboardArrowUp />,
      },
      {
        enum: "MACRO_ACTION_STEP_TAPCODE",
        name: "Key Press & Rel.",
        icon: <MdUnfoldLess fontSize="large" />,
        smallIcon: <MdUnfoldLess />,
      },
      {
        enum: "MACRO_ACTION_STEP_EXPLICIT_REPORT",
        name: "Explicit Report",
        icon: <></>,
        smallIcon: <></>,
      },
      {
        enum: "MACRO_ACTION_STEP_IMPLICIT_REPORT",
        name: "Implicit Report",
        icon: <></>,
        smallIcon: <></>,
      },
      { enum: "MACRO_ACTION_STEP_SEND_REPORT", id: 11, name: "Send Report" },
      {
        enum: "MACRO_ACTION_STEP_TAP_SEQUENCE",
        name: "Intervaled Special Keys",
        icon: <></>,
        smallIcon: <></>,
      },
      {
        enum: "MACRO_ACTION_STEP_TAP_CODE_SEQUENCE",
        name: "Intervaled Key Press & Release",
        icon: <></>,
        smallIcon: <></>,
      },
    ];

    this.onDragEnd = this.onDragEnd.bind(this);
    this.addModifier = this.addModifier.bind(this);
    this.updateRows = this.updateRows.bind(this);
    this.createConversion = this.createConversion.bind(this);
    this.assignColor = this.assignColor.bind(this);
  }

  componentDidMount() {
    const { macro } = this.props;
    const { rows } = this.state;
    if (macro !== null && macro.actions !== null && macro.actions.length > 0) {
      const conv = this.createConversion(macro.actions);
      const texted = conv.map(k => this.keymapDB.parse(k.keyCode).label).join(" ");
      const newRows = conv.map((item, index) => {
        const aux = item;
        aux.id = index;
        return aux;
      });
      this.setState({
        rows: newRows,
        macro: texted,
      });
    }
    if (rows.length !== 0) {
      const scrollContainer = this.horizontalWheel.current?.firstChild;
      // log.info("comparing values of scrollpos in mount", this.props.scrollPos, scrollContainer.scrollLeft);
      scrollContainer.addEventListener("wheel", this.scrollUpdate);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { macro, scrollPos } = this.props;
    const { rows } = this.state;
    if (this.horizontalWheel.current === null) return;
    const scrollContainer = this.horizontalWheel.current?.firstChild;
    if (rows.length !== 0 && prevState.rows.length === 0) {
      scrollContainer.addEventListener("wheel", this.scrollUpdate);
    }
    if (rows.length === 0 && prevState.rows.length !== 0) {
      scrollContainer.removeEventListener("wheel", this.scrollUpdate);
    }
    // log.info("comparing values of scrollpos in update", this.props.scrollPos, scrollContainer.scrollLeft);
    if (scrollContainer.scrollLeft !== scrollPos) {
      scrollContainer.scrollLeft = scrollPos;
    }
    if (macro !== prevProps.macro) {
      const localRows = this.createConversion(macro.actions);
      log.info("TiEMTa CompDidUpdate", localRows);
      const texted = localRows.map(k => this.keymapDB.parse(k.keyCode).label).join(" ");
      const newRows = localRows.map((item, index) => {
        const aux = item;
        aux.id = index;
        return aux;
      });
      this.setState({
        rows: newRows,
        macro: texted,
      });
    }
  }

  componentWillUnmount() {
    const { rows } = this.state;
    if (rows.length !== 0) {
      const scrollContainer = this.horizontalWheel.current?.firstChild;
      scrollContainer.removeEventListener("wheel", this.scrollUpdate);
    }
  }

  onDeleteRow = id => {
    const { rows } = this.state;
    const { uid } = rows.filter(x => x.id === id)[0];
    const aux = rows.filter(x => x.uid !== uid);
    this.updateRows(aux);
  };

  onCloneRow = id => {
    const { rows } = this.state;
    const uid = rows.filter(x => x.id === id)[0];
    const preAux = rows.slice(0, id);
    const postAux = rows.slice(id);
    preAux.push(uid);
    this.updateRows(preAux.concat(postAux));
  };

  onDragEnd(result) {
    const { rows } = this.state;
    this.scrollUpdate(result);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newRows = this.reorder(rows, result.source.index, result.destination.index);

    this.updateRows(newRows);
  }

  updateAction = (id, action) => {
    const { rows } = this.state;
    const aux = rows;
    aux[id].action = action;
    this.updateRows(aux);
  };

  scrollUpdate = evt => {
    const { updateScroll } = this.props;
    const scrollContainer = this.horizontalWheel.current?.firstChild;
    if (typeof evt.preventDefault === "function") {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    }
    // log.info("newScroll", scrollContainer.scrollLeft);
    updateScroll(scrollContainer.scrollLeft);
  };

  createConversion(actions) {
    const { macros } = this.props;
    log.info("TESTING NAME ASSIGNATION OF MACROS", macros);
    const converted = actions.map((action, i) => {
      const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
      let km;
      let txt;
      switch (action.type) {
        case 1:
          return {
            symbol: `${action.keyCode[0]} - ${action.keyCode[1]}`,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: "#faf0e3",
            uid: randID,
            ucolor: "transparent",
          };
        case 2:
          return {
            symbol: action.keyCode,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: "#faf0e3",
            uid: randID,
            ucolor: "transparent",
          };
        case 3:
        case 4:
        case 5:
          km = this.keymapDB.parse(action.keyCode);
          if (km.extraLabel === "MACRO") {
            const mName = macros[km.keyCode - 53852].name;
            txt = `M. ${mName}`;
          } else if (React.isValidElement(km.label) || React.isValidElement(km.extraLabel)) {
            txt = km.extraLabel ? (
              <>
                {km.extraLabel} {km.label}
              </>
            ) : (
              km.label
            );
          } else {
            txt = `${km.extraLabel} ${km.label}`;
          }
          return {
            symbol: txt,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: this.assignColor(action.keyCode),
            uid: randID,
            ucolor: "transparent",
          };
        case 6:
        case 7:
        case 8:
          km = this.keymapDB.parse(action.keyCode);
          if (React.isValidElement(km.label) || React.isValidElement(km.extraLabel)) {
            txt = km.extraLabel ? (
              <>
                {km.extraLabel} {km.label}
              </>
            ) : (
              km.label
            );
          } else {
            txt = km.extraLabel ? `${km.extraLabel} ${km.label}` : km.label;
          }
          return {
            symbol: txt,
            keyCode: action.keyCode,
            action: action.type,
            id: i,
            color: this.assignColor(action.keyCode),
            uid: randID,
            ucolor: "transparent",
          };
        default:
          break;
      }
    });
    return converted;
  }

  revertConversion(actions) {
    const converted = actions.map(({ keyCode, action, id }) => ({
      keyCode,
      type: action,
      id,
    }));
    return converted;
  }

  assignColor(keyCode) {
    let color = this.modifiers.filter(x => x.keyCode === keyCode);
    if (color === undefined || color.length === 0) {
      color = "#ededed";
    } else {
      color = color[0].color;
    }
    return color;
  }

  updateRows(rows) {
    const { updateActions } = this.props;
    log.info("TiEMTa updaterows", rows);
    const texted = rows.map(k => this.keymapDB.parse(k.keyCode).label);
    const newRows = rows.map((item, index) => {
      const aux = item;
      aux.id = index;
      return aux;
    });
    this.setState({
      rows: newRows,
      macro: texted,
    });
    const revConv = this.revertConversion(rows);
    // log.info("TiEMTa revConv", revConv);
    updateActions(revConv);
  }

  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  addModifier(rowID, modifierID) {
    const { rows } = this.state;
    log.info("Called addModifier", rowID, modifierID);
    const { name, keyCode, color } = this.modifiers[modifierID];
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const randColor = `#${Math.floor(Math.abs(Math.sin(randID) * 16777215) % 16777215).toString(16)}`;
    const newRows = rows;
    newRows.splice(rowID + 1, 0, {
      symbol: name,
      keyCode,
      action: 7,
      id: rowID + 1,
      color,
      uid: randID,
      ucolor: randColor,
    });
    newRows.splice(rowID, 0, {
      symbol: name,
      keyCode,
      action: 6,
      id: rowID,
      color,
      uid: randID,
      ucolor: randColor,
    });
    this.updateRows(newRows);
  }

  render() {
    const { componentWidth, updateScroll } = this.props;
    const { rows } = this.state;
    const cssObjectWidth = {
      width: componentWidth,
    };
    // log.info("Timeline.ed.M.Table Rows", rows);
    if (rows.length === 0) {
      return <></>;
    }
    return (
      <Styles className="trackingWrapper" style={cssObjectWidth} ref={this.horizontalWheel} id="hwTracker">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {provided => (
              <div
                ref={provided.innerRef}
                id="scrollableElementWithRef"
                onScroll={event => updateScroll(event.target.scrollLeft)}
              >
                <div className="timelinetracking">
                  {rows.map((item, index) => (
                    <Draggable
                      key={`${item.uid}-${item.keyCode}-${item.action}-${item.id}`}
                      draggableId={String(index)}
                      index={index}
                    >
                      {(providd, snapshot) => (
                        <KeyMacro
                          provided={providd}
                          snapshot={snapshot}
                          item={item}
                          modifiers={this.modifiers}
                          actionTypes={this.actionTypes}
                          updateAction={this.updateAction}
                          onDeleteRow={this.onDeleteRow}
                          onCloneRow={this.onCloneRow}
                          addModifier={this.addModifier}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Styles>
    );
  }
}

TimelineEditorMacroTable.propTypes = {
  keymapDB: PropTypes.object,
  macro: PropTypes.object,
  macros: PropTypes.arrayOf(object),
  updateActions: PropTypes.func,
  updateScroll: PropTypes.func,
  componentWidth: PropTypes.number,
  scrollPos: PropTypes.number,
};

export default TimelineEditorMacroTable;
