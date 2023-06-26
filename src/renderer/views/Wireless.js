// General imports
import React, { useState, useEffect } from "react";
import i18n from "../i18n";
import Focus from "../../api/focus";

// Bootstrap components imports
import Styled from "styled-components";
import Container from "react-bootstrap/Container";

// Custom component imports
import PageHeader from "../modules/PageHeader";
import { BatterySettings, RFSettings } from "../modules/Settings";
import { LogoLoader } from "../component/Loader";

const Styles = Styled.div`
  .toggle-button{
    text-align: center;
    padding-bottom: 8px;
  }
`;

const Wireless = ({ inContext, connected, allowBeta, updateAllowBeta }) => {
  const [modified, setModified] = useState(false);
  const [bLeft, setbLeft] = useState(100);
  const [bRight, setbRight] = useState(100);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [loading, setLoading] = useState(true);

  const getBatteryStatus = async () => {
    const focus = new Focus();
    const left = await focus.command("wireless.battery.left.level");
    const right = await focus.command("wireless.battery.right.level");
    setbLeft(left);
    setbRight(right);
    setLoading(false);
  };

  if (loading) <LogoLoader />;
  return (
    <Styles>
      <Container fluid className="wireless center-content">
        <PageHeader text={i18n.wireless.title} showSaving={false} showContentSelector={false} />
        <div className="wirelessWrapper">
          <div className="wirelessInner">
            <BatterySettings bLeft={bLeft} bRight={bRight} isSavingMode={isSavingMode} isCharging={isCharging} />
            <RFSettings />
          </div>
        </div>
      </Container>
    </Styles>
  );
};

export default Wireless;
