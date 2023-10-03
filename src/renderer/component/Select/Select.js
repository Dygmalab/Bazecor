// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import Styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

const Style = Styled.div`
.custom-dropdown {
  .dropdwonIcon {
    max-width: 24px;
  }
  .dropdownItem {
    padding-left: 0;
    flex: 0 0 100%;
    text-align: left;
    text-transform: capitalize;
  }
  .dropdownItemSelected {
    color: ${({ theme }) => theme.styles.dropdown.textButtonColor};
    &:hover {
      color: ${({ theme }) => theme.styles.dropdown.textButtonHover};
    }
  }
  .dropdownIcon + .dropdownItem {
    padding-left: 12px;
    flex: 0 0 calc(100% - 24px);
  }
}
.disabled {
  pointer-events: none;
  opacity: 35%;
}
`;

function Select({ onSelect, value, listElements, disabled }) {
  return (
    <Style>
      <Dropdown onSelect={onSelect} value={value} className={`custom-dropdown ${disabled ? "disabled" : ""}`}>
        <Dropdown.Toggle id="dropdown-custom">
          <div className="dropdownItemSelected">
            {value != undefined && value != null && listElements.length > 0 ? ( // Ternary operator checking validity of variables
              <>
                {typeof value === "string" && value != "" ? ( // Ternary operator checking if string
                  <>
                    {listElements[0].icon != undefined ? ( // Ternary operator checking if icon exists
                      <>
                        <div className="dropdownIcon">
                          <img src={listElements.find(elem => elem.value === value)?.icon} className="dropdwonIcon" />
                        </div>
                        <div className="dropdownItem">{listElements.find(elem => elem.value === value)?.text}</div>
                      </>
                    ) : (
                      <div className="dropdownItem">{listElements.find(elem => elem.value === value)?.text}</div>
                    )}
                  </>
                ) : (
                  ""
                )}
                {typeof value === "number" && value > -1 && listElements.length > 0 ? ( // Ternary operator checking if number
                  <>
                    {listElements[0].icon != undefined ? ( // Ternary operator checking if icon exists
                      <>
                        <div className="dropdownIcon">
                          <img src={listElements.find(elem => elem.value === value)?.icon} className="dropdwonIcon" />
                        </div>
                        <div className="dropdownItem">{listElements.find(elem => elem.value === value)?.text}</div>
                      </>
                    ) : (
                      <div className="dropdownItem">{listElements.find(elem => elem.value === value)?.text}</div>
                    )}
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {listElements.length > 0
            ? listElements.map((item, index) => (
                <Dropdown.Item
                  eventKey={item.value}
                  key={index}
                  className={`${value == item.text ? "active" : ""}`}
                  disabled={item.disabled}
                >
                  <div className="dropdownInner">
                    {value != undefined && value != "" > 0 && listElements.length > 0 && listElements[0].icon != undefined ? (
                      <div className="dropdownIcon">
                        <img src={item.icon} className="dropdwonIcon" />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="dropdownItem">{item.text}</div>
                  </div>
                </Dropdown.Item>
              ))
            : ""}
        </Dropdown.Menu>
      </Dropdown>
    </Style>
  );
}

export default Select;
