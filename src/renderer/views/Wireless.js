// General imports
import React, { useState } from "react";
import i18n from "../i18n";

// Bootstrap components imports
import Styled from "styled-components";
import Container from "react-bootstrap/Container";

// Custom component imports
import PageHeader from "../modules/PageHeader";

const Styles = Styled.div`
  .toggle-button{
    text-align: center;
    padding-bottom: 8px;
  }
`;

export default function Wireless({ inContext, connected, allowBeta, updateAllowBeta }) {
  const [modified, setModified] = useState(false);
  return (
    <Styles>
      <Container fluid>
        <PageHeader
          text={i18n.wireless.title}
          style={"pageHeaderFlatBottom"}
          showSaving={true}
          showContentSelector={false}
          saveContext={() => {
            console.log("pressed save");
          }}
          destroyContext={() => {
            console.log("pressed discard");
          }}
          inContext={modified}
        />
      </Container>
    </Styles>
  );
}
