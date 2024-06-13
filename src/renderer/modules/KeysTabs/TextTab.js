import React, { Component } from "react";
import Styled from "styled-components";

import Form from "react-bootstrap/Form";
import { i18n } from "@Renderer/i18n";

import { IconArrowInBoxUp } from "@Renderer/components/atoms/Icons";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";
import { Textarea } from "@Renderer/components/atoms/Textarea";

const Styles = Styled.div`
display: flex;
flex-wrap: wrap;
height: inherit;
h4 {
    font-size: 16px;
    margin-top: 32px;
    flex: 0 0 100%;
}
.w100 {
  width: 100%;
  flex: 0 0 100%;
}
.callOut {
  width: 100%;
  flex: 0 0 100%;
}
.form-control {
    color: ${({ theme }) => theme.styles.form.inputColor};
    background: ${({ theme }) => theme.styles.form.inputBackgroundColor};
    border-color: ${({ theme }) => theme.styles.form.inputBorderSolid};
    font-weight: 600;
    &:focus {
        background: ${({ theme }) => theme.styles.form.inputBackgroundColorActive};
        border-color: ${({ theme }) => theme.styles.form.inputBorderActive};
        box-shadow: none;
    }
    margin-bottom: 24px;
}
`;

class TextTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Styles>
        <div className="tabContentWrapper">
          <Callout size="sm" className="mt-4 karaka">
            <p>{i18n.editor.macros.textTabs.callout}</p>
          </Callout>
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.macros.textTabs.title}
          </Heading>
          <Textarea
            placeholder={i18n.editor.macros.textTabs.placeholder}
            value={this.props.addText}
            onChange={this.props.onTextChange}
          />
          <Form.Control
            type="text"
            placeholder={i18n.editor.macros.textTabs.placeholder}
            value={this.props.addText}
            onChange={this.props.onTextChange}
            as="textarea"
            rows={3}
          />
        </div>
        <div className="tabSaveButton">
          <Button variant="secondary" onClick={this.props.onAddText} iconDirection="right">
            <IconArrowInBoxUp /> {i18n.editor.macros.textTabs.buttonText}
          </Button>
        </div>
      </Styles>
    );
  }
}

export default TextTab;
