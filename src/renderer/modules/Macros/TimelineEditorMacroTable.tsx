import React, { useCallback, useEffect, useRef, useState } from "react";
import log from "electron-log/renderer";
import Styled from "styled-components";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MacroActionsType, MacrosType, RowsRepresentation } from "@Renderer/types/macros";
import { actionTypes, createConversion, modifiers, revertConversion } from "./utils";
import { KeymapDB } from "../../../api/keymap";
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

interface Props {
  macro: MacrosType;
  macros: MacrosType[];
  scrollPos: number;
  componentWidth: number;
  updateActions: (actions: MacroActionsType[]) => void;
  updateScroll: (value: number) => void;
}

const TimelineEditorMacroTable = (props: Props) => {
  const { macro, macros, scrollPos, componentWidth, updateActions, updateScroll } = props;
  const prevProps = useRef<Props>(props);
  const [keymapDB] = useState(new KeymapDB());
  const horizontalWheel = React.createRef<HTMLElement>();
  const [rows, setRows] = useState<RowsRepresentation[]>([]);
  const prevRows = useRef(rows);

  const scrollUpdate = useCallback(
    (evt: WheelEvent) => {
      const scrollContainer = horizontalWheel.current?.firstChild as HTMLElement;
      if (typeof evt.preventDefault === "function") {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
      }
      // log.info("newScroll", scrollContainer.scrollLeft);
      updateScroll(scrollContainer.scrollLeft);
    },
    [horizontalWheel, updateScroll],
  );

  useEffect(() => {
    if (macro !== undefined && Array.isArray(macro.actions) && macro.actions.length > 0) {
      log.info("checking macros values:", macro, macros);
      const conv = createConversion(macro.actions, macros);
      const newRows = conv.map((item, index) => {
        const aux = item;
        aux.id = index;
        return aux;
      });
      setRows(newRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (horizontalWheel.current === null) return undefined;
    const scrollContainer = horizontalWheel.current?.firstChild as HTMLElement;
    if (rows.length !== 0 && prevRows.current.length === 0) {
      scrollContainer.addEventListener("wheel", scrollUpdate);
    }
    if (rows.length === 0 && prevRows.current.length !== 0) {
      scrollContainer.removeEventListener("wheel", scrollUpdate);
    }
    // log.info("comparing values of scrollpos in update", this.props.scrollPos, scrollContainer.scrollLeft);
    if (scrollContainer.scrollLeft !== scrollPos) {
      scrollContainer.scrollLeft = scrollPos;
    }
    if (macro !== prevProps.current.macro) {
      const localRows = createConversion(macro.actions, macros);
      log.info("TiEMTa UpdateUseEffect", localRows);
      const newRows = localRows.map((item, index) => {
        const aux = item;
        aux.id = index;
        return aux;
      });
      setRows(newRows);
    }
    if (prevProps.current !== props) prevProps.current = { ...props };
    return () => {
      if (rows.length !== 0) {
        scrollContainer.removeEventListener("wheel", scrollUpdate);
      }
    };
  }, [horizontalWheel, keymapDB, macro, macros, props, rows.length, scrollPos, scrollUpdate]);

  const updateRows = (localRows: RowsRepresentation[]) => {
    // log.info("TiEMTa updaterows", localRows);
    const newRows = localRows.map((item, index) => {
      const aux = item;
      aux.id = index;
      return aux;
    });
    // log.info("newRows generaterd", newRows);
    setRows(newRows);
    const revConv = revertConversion(localRows);
    // log.info("TiEMTa revConv", revConv);
    updateActions(revConv);
  };

  const onDeleteRow = (id: number) => {
    const { uid } = rows.filter(x => x.id === id)[0];
    const aux = rows.filter(x => x.uid !== uid);
    updateRows(aux);
  };

  const onCloneRow = (id: number) => {
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const elem = JSON.parse(JSON.stringify(rows.filter(x => x.id === id)[0]));
    elem.uid = randID;
    const preAux = rows.slice(0, id);
    const postAux = rows.slice(id);
    // log.info("cloning data:", elem, preAux, postAux);
    preAux.push(elem);
    updateRows(preAux.concat(postAux));
  };

  const reorder = (list: Array<unknown>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    scrollUpdate(result);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newRows = reorder(rows, result.source.index, result.destination.index) as RowsRepresentation[];

    updateRows(newRows);
  };

  const updateAction = (id: number, action: number) => {
    const aux = rows;
    aux[id].type = action;
    updateRows(aux);
  };

  const editDelay = (id: number, delay: number | number[]) => {
    log.info("Delay launched", id, delay);
    const aux = rows;
    aux[id].keyCode = delay;
    updateRows(aux);
  };

  const addModifier = (rowID: number, modifierID: number) => {
    log.info("Called addModifier", rowID, modifierID);
    const { name, keyCode, color } = modifiers[modifierID];
    const randID = new Date().getTime() + Math.floor(Math.random() * 1000);
    const randColor = `#${Math.floor(Math.abs(Math.sin(randID) * 16777215) % 16777215).toString(16)}`;
    const newRows = rows;
    newRows.splice(rowID + 1, 0, {
      symbol: name,
      keyCode,
      type: 7,
      id: rowID + 1,
      color,
      uid: randID,
      ucolor: randColor,
    });
    newRows.splice(rowID, 0, {
      symbol: name,
      keyCode,
      type: 6,
      id: rowID,
      color,
      uid: randID,
      ucolor: randColor,
    });
    updateRows(newRows);
  };

  const cssObjectWidth = {
    width: componentWidth,
  };
  // log.info("Timeline.ed.M.Table Rows", rows);
  if (rows.length === 0) {
    return <></>;
  }
  return (
    <Styles className="trackingWrapper" style={cssObjectWidth} ref={horizontalWheel as any} id="hwTracker">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {provided => (
            <div
              ref={provided.innerRef}
              id="scrollableElementWithRef"
              onScroll={(event: any) => updateScroll(event.target.scrollLeft)}
            >
              <div className="timelinetracking">
                {rows.map((item, index) => (
                  <Draggable
                    key={`${item.uid}-${item.keyCode}-${item.type}-${item.id}`}
                    draggableId={String(index)}
                    index={index}
                  >
                    {(providd, snapshot) => (
                      <KeyMacro
                        provided={providd}
                        snapshot={snapshot}
                        item={item}
                        modifiers={modifiers}
                        actionTypes={actionTypes}
                        updateAction={updateAction}
                        onDeleteRow={onDeleteRow}
                        onCloneRow={onCloneRow}
                        addModifier={addModifier}
                        editDelay={editDelay}
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
};

export default TimelineEditorMacroTable;
