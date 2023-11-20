import PropTypes from "prop-types";
import React, { Component } from "react";
import Styled from "styled-components";

// React Bootstrap Components
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Own Components

// Icons Imports

// Flags imports
import frenchF from "@Assets/flags/france.png";
import germanF from "@Assets/flags/germany.png";
import japaneseF from "@Assets/flags/japan.png";
import koreanF from "@Assets/flags/korean.png";
import spanishF from "@Assets/flags/spain.png";
import englishUSF from "@Assets/flags/englishUS.png";
import englishUKF from "@Assets/flags/englishUK.png";
import danishF from "@Assets/flags/denmark.png";
import swedishF from "@Assets/flags/sweden.png";
import finnishF from "@Assets/flags/finland.png";
import icelandicF from "@Assets/flags/iceland.png";
import norwegianF from "@Assets/flags/norway.png";
import swissF from "@Assets/flags/switzerland.png";
import eurkeyF from "@Assets/flags/eurkey.png";
import { IconWrench, IconSun, IconMoon, IconScreen } from "../../component/Icon";
import { ToggleButtons } from "../../component/ToggleButtons";
import { Select } from "../../component/Select";
import Title from "../../component/Title";
import Keymap from "../../../api/keymap";
import Focus from "../../../api/focus";
import i18n from "../../i18n";

import Store from "../../utils/Store";

const GeneraslSettihngsWrapper = Styled.div`
.dropdown-menu {
  min-width: 13rem;
}
`;

const store = Store.getStore();

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLanguage: "",
    };
  }

  async componentDidMount() {
    this.setState({
      selectedLanguage: store.get("settings.language"),
    });
  }

  changeLanguage = language => {
    this.setState({ selectedLanguage: language });
    store.set("settings.language", `${language}`);

    const focus = new Focus();
    if (!focus.closed) {
      const deviceLang = { ...focus.device, language: true };
      focus.commands.keymap = new Keymap(deviceLang);
    }
  };

  render() {
    const { selectDarkMode, darkMode, neurons, selectedNeuron, connected, defaultLayer, selectDefaultLayer } = this.props;
    const { selectedLanguage } = this.state;
    let layersNames = neurons[selectedNeuron] ? neurons[selectedNeuron].layers : [];
    const flags = [
      englishUSF,
      englishUKF,
      spanishF,
      germanF,
      frenchF,
      frenchF,
      frenchF,
      swedishF,
      finnishF,
      danishF,
      norwegianF,
      icelandicF,
      japaneseF,
      koreanF,
      swissF,
      eurkeyF,
    ];
    let language = [
      "english",
      "british",
      "spanish",
      "german",
      "french",
      "frenchBepo",
      "frenchOptimot",
      "swedish",
      "finnish",
      "danish",
      "norwegian",
      "icelandic",
      "japanese",
      "korean",
      "swissGerman",
      "eurkey",
    ];
    const languageNames = [
      "English US",
      "English UK",
      "Spanish",
      "German",
      "French",
      "French Bépo",
      "French Optimot",
      "Swedish",
      "Finnish",
      "Danish",
      "Norwegian",
      "Icelandic",
      "Japanese",
      "Korean",
      "Swiss (German)",
      "EurKEY (1.3)",
    ];
    language = language.map((item, index) => ({
      text: languageNames[index],
      value: item,
      icon: flags[index],
      index,
    }));

    layersNames = layersNames.map((item, index) => ({
      text: item.name !== "" ? item.name : `Layer ${index + 1}`,
      value: index,
      index,
    }));
    layersNames.push({ text: i18n.keyboardSettings.keymap.noDefault, value: 126, index: 126 });

    const layoutsModes = [
      {
        name: "System",
        value: "system",
        icon: <IconScreen />,
        index: 0,
      },
      {
        name: "Dark",
        value: "dark",
        icon: <IconMoon />,
        index: 1,
      },
      {
        name: "Light",
        value: "light",
        icon: <IconSun />,
        index: 2,
      },
    ];

    return (
      <GeneraslSettihngsWrapper>
        <Card className="overflowFix card-preferences mt-4">
          <Card.Title>
            <Title text={i18n.keyboardSettings.keymap.title} headingLevel={3} svgICO={<IconWrench />} />
          </Card.Title>
          <Card.Body>
            <Form>
              <Row>
                <Col lg={6} md={12}>
                  <Form.Group controlId="selectLanguage" className="mb-3">
                    <Form.Label>{i18n.preferences.language}</Form.Label>
                    <Select onSelect={this.changeLanguage} value={selectedLanguage} listElements={language} />
                  </Form.Group>
                </Col>
                <Col lg={6} md={12}>
                  <Form.Group controlId="defaultLayer" className="mb-3">
                    <Form.Label>{i18n.keyboardSettings.keymap.defaultLayer}</Form.Label>
                    <Select onSelect={selectDefaultLayer} value={defaultLayer} listElements={layersNames} disabled={!connected} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group controlId="DarkMode" className="m-0">
                    <Form.Label>{i18n.preferences.darkMode.label}</Form.Label>
                    <ToggleButtons
                      selectDarkMode={selectDarkMode}
                      value={darkMode}
                      listElements={layoutsModes}
                      style="flex"
                      size="sm"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </GeneraslSettihngsWrapper>
    );
  }
}

GeneralSettings.propTypes = {
  selectDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.string.isRequired,
  neurons: PropTypes.array.isRequired,
  selectedNeuron: PropTypes.number.isRequired,
  connected: PropTypes.bool.isRequired,
};
