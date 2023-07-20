import React from "react";
import i18n from "@Renderer/i18n";

// Bootstrap components
import Styled from "styled-components";
import Card from "react-bootstrap/Card";

// Custom components
import Title from "@Renderer/component/Title";
import { RegularButton } from "@Renderer/component/Button";

// Assets
import { IconSignal } from "@Renderer/component/Icon";
import { RFSettingsProps } from "@Renderer/types/wireless";

const Styles = Styled.div`
height: 100%;
padding-top: 24px;
.card {
  height: inherit;
}
.RFdescription {
  margin-top: 24px;
  p {
    font-size: 0.75rem;
    font-weight: 401;
    color: ${({ theme }) => theme.styles.batterySettings.descriptionColor};
    strong {
      font-weight: 401;
      color: ${({ theme }) => theme.styles.batterySettings.descriptionHighlightColor};
    }
  } 
}
.button.outline {
  margin-top: 4px;
}
`;

function RFSettings(props: RFSettingsProps) {
  const { sendRePair } = props;
  return (
    <Styles>
      <Card className="overflowFix card-preferences">
        <Card.Title>
          <Title text={i18n.wireless.RFPreferences.RFSettings} headingLevel={3} svgICO={<IconSignal />} />
        </Card.Title>
        <Card.Body className="py-0">
          <Title text={i18n.wireless.RFPreferences.repairChannel} headingLevel={4} />
          <RegularButton
            buttonText={i18n.wireless.RFPreferences.reconnectSides}
            onClick={sendRePair}
            styles="outline gradient"
            size="sm"
          />
          <div className="RFdescription">
            <p>{i18n.wireless.RFPreferences.repairChannelDescription}</p>
          </div>
        </Card.Body>
      </Card>
    </Styles>
  );
}

export default RFSettings;
