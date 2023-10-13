import React from "react";
import Styled from "styled-components";

import { IconDragDots, IconBugWarning } from "@Renderer/component/Icon";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { CardDevice } from "@Renderer/component/Card";
import Title from "@Renderer/component/Title";
import { Container } from "react-bootstrap";

const DeviceManagerWrapper = Styled.div`

`;

const FilterHeaderWrapper = Styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding-top: 32px;
 padding-bottom: 16px;
 margin-bottom: 32px;
 border-bottom: 1px solid ${({ theme }) => theme.colors.gray600};  
 .filter-header {
  display: flex;
  align-items: center;
  grid-gap: 16px;
 }
 .filter-title {
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0;
  padding-left: 2px;
  sup {
    color: ${({ theme }) => theme.colors.purple300};
  } 
 }
 .modal-button--trigger {
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray25};
  grid-gap: 8px;
  font-size: 0.8em;
  transition: 300ms ease-in-out color;
  &:hover {
    color: ${({ theme }) => theme.colors.purple300};
  }
}
 .filter-header--tabs ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  grid-gap: 4px;
  .tab {
    border-radius: 16px;
    color: ${({ theme }) => theme.colors.gray25};
    background-color: ${({ theme }) => theme.colors.gray600};
    padding: 4px 16px;
    margin: 0;
    font-family: "Libre Franklin";
    font-weight: 600;
    font-size: 0.8em;
    transition: 300ms background-color ease-in-out;
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray500};
    }
    &.tab-active {
      background-color: ${({ theme }) => theme.colors.purple300};
    }
  }
 }
`;

const DevicesWrapper = Styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const HelpWrapper = Styled.div`
  display: flex;
  flex-wrap: nowrap;
  grid-gap: 8px;
  max-width: 224px;
  margin-top: auto;
  justify-content: flex-end;
  svg {
    flex: 0 0 24px;
  }
  h4 {
    font-size: 1em;
  }
  p {
    color: ${({ theme }) => theme.colors.gray200};
    font-size: 0.825em;
  }
`;

const DeviceManager = ({ titleElement, device }) => {
  console.log("Inside Device Manager", device);
  return (
    <DeviceManagerWrapper>
      <Container fluid>
        <PageHeader text="Device Manager" />
        <FilterHeaderWrapper>
          <div className="filter-header">
            <h3 className="filter-title">
              My devices <sup>4</sup>
            </h3>
            <div className="filter-header--tabs">
              <ul>
                <li>
                  <button type="button" className="tab tab-active">
                    All
                  </button>
                </li>
                <li>
                  <button type="button" className="tab">
                    Online
                  </button>
                </li>
                <li>
                  <button type="button" className="tab">
                    Offline
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="filter-header--actions">
            <a href="#" className="modal-button--trigger">
              <IconDragDots />
              Re-order list
            </a>
          </div>
        </FilterHeaderWrapper>
        <DevicesWrapper>
          <CardDevice device={device} />
        </DevicesWrapper>
        <HelpWrapper>
          <IconBugWarning />
          <div className="help-warning--content">
            <Title text="Need help?" headingLevel={4} />
            <p>Whether it&#39;s a bug or any other issue, we are here to help you!</p>
          </div>
        </HelpWrapper>
      </Container>
    </DeviceManagerWrapper>
  );
};

export default DeviceManager;
