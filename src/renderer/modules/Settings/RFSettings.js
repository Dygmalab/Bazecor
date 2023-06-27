import React from "react";
import i18n from "../../i18n";

//Bootstrap components
import Styled from "styled-components";
import Card from "react-bootstrap/Card";

//Custom components
import Title from "../../component/Title";
import { RegularButton } from "../../component/Button";

//Assets
import { IconNoSignal } from "../../component/Icon";

const Styles = Styled.div`
.RFdescription {
  margin-top: 24px;
  font-size: 0.75rem;
  font-weight: 401;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.gray300}
  strong {
    font-weight: 401;
    color: ${({ theme }) => theme.colors.gray100}
  }
}
`;

const RFSettings = props => {
  return (
    <Styles>
      <Card className="overflowFix card-preferences mt-4">
        <Card.Title>
          <Title text={i18n.wireless.RFPreferences.RFSettings} headingLevel={3} svgICO={<IconNoSignal />} />
        </Card.Title>
        <Card.Body className="py-0">
          <Title text={i18n.wireless.RFPreferences.repairChannel} headingLevel={4} />
          <RegularButton
            buttonText={i18n.wireless.RFPreferences.reconnectSides}
            onClick={() => console.log("CLick!")}
            style="outline gradient"
            size="sm"
          />
          <div
            className="RFdescription"
            dangerouslySetInnerHTML={{ __html: i18n.wireless.RFPreferences.repairChannelDescription }}
          />
        </Card.Body>
      </Card>
    </Styles>
  );
};

export default RFSettings;
