import { DefaultTheme, createGlobalStyle } from "styled-components";

import iconChevronDown from "@Assets/base/icon-arrow--chevron-down.svg";
import iconChevronDownWhite from "@Assets/base/icon-arrow--chevron-down_white.svg";
import LibreFranklin from "./fonts/LibreFranklin/LibreFranklin-VariableFont_wght.ttf";
import LibreFranklinItalic from "./fonts/LibreFranklin/LibreFranklin-Italic-VariableFont_wght.ttf";

const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  @font-face {
    font-family: "Libre Franklin";
    font-weight: 100 900;
    font-style: normal;
    src: url(${LibreFranklin}) format("truetype");
    font-display: block;
  }

  @font-face {
    font-family: "Libre Franklin";
    font-weight: 100 900;
    font-style: italic;
    src: url(${LibreFranklinItalic}) format("truetype");
    font-display: block;
  }
  
  body {
    background: ${({ theme }) => theme.colors.body};
    font-weight: 600;
    background-image: url(${({ theme }) => theme.body.backgroundImage});
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font};
    // font-family: ${({ theme }) => theme.font},  -apple-system, sans-serif;

    text-rendering: optimizeLegibility;
    font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-feature-settings: "liga" on;

    overflow: overlay;
  }

  @media screen and (-webkit-min-device-pixel-ratio: 2), 
  (min-resolution: 192dpi) { 
      body {
        background-image: url(${({ theme }) => theme.body.backgroundImage2x});
      }
  }
  #root {
    display: grid;
    --sidebarWidth: ${({ theme }) => theme.sidebarWidthMedium}px;
    grid-template-columns: var(--sidebarWidth) auto;
  }

  div.main-container {
    padding-left: calc(90px + 8px);
    padding-left: 8px;
    padding-right: 8px;
    
    // overflow: auto;
    min-height: 100vh;
  }
  .wrapper {
    margin-top: 2px;
    padding-left: 17px;
    padding-right: 17px;
  }
  .wrapperBackground {
    background: ${({ theme }) => theme.styles.wrapper.background};
    padding-bottom: 8px;
    margin-bottom: 32px;
    border-radius: 0 0 16px 16px;
  }

  div.title-row{
    .section-title{
      margin 0;
      padding: 0.5em 1em;
      color: rgb(165,103,181);

    }
  }

  nav {
    transition: all 0.50s linear;
  }

  a {
    color: ${({ theme }) => theme.colors.link.text};
    cursor: pointer;
  }

  .marginCenter {
    .spinner-border {
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
    
  }

.transp-bg {
  background-color: transparent;
}

.loading {
  color: ${({ theme }) => theme.colors.purple300};
  &.text-center {
    display: flex;
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}
  .longtooltip > .tooltip-inner {
    max-width: 100%;
  }

  .tooltip.show {
    opacity: 1;
  }

  button {
    border: 0;
    display: inline-block;
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: 5px;
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.button.background};
    color: #FFFFFF;
  }


  button.btn-primary, button.btn{
    background-color: ${({ theme }) => theme.colors.button.background};
    color: ${({ theme }) => theme.colors.button.text};
    border: none;
  }
  .btn-primary:hover {
    color: ${({ theme }) => theme.colors.button.text};
    background-color: ${({ theme }) => theme.colors.button.hover};
    border: none;
  }
  .btn-primary:disabled, &.btn-primary.disabled {
    color: ${({ theme }) => theme.colors.button.text};
    background-color: ${({ theme }) => theme.colors.button.disabled};
    border: none;
  }
  .btn-primary:not(:disabled):not(.disabled).active {
    color: ${({ theme }) => theme.colors.button.text};
    background-color: ${({ theme }) => theme.colors.button.active};
    border: none;
  }
  .btn-primary.focus, .btn-primary:focus{
    color: ${({ theme }) => theme.colors.button.text};
    background-color: ${({ theme }) => theme.colors.button.hover};
    border-color: ${({ theme }) => theme.colors.button.background};
    box-shadow: none;
  }
  .btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show>.btn-primary.dropdown-toggle  {
    color: ${({ theme }) => theme.colors.button.text};
    background-color: ${({ theme }) => theme.colors.button.active};
    border-color: ${({ theme }) => theme.colors.button.background};
    box-shadow: ${({ theme }) => theme.colors.button.boxShadow};
  }
  .btn-primary:not(:disabled):not(.disabled).active:focus, .btn-primary:not(:disabled):not(.disabled):active:focus, .show>.btn-primary.dropdown-toggle:focus {
    box-shadow: ${({ theme }) => theme.colors.button.boxShadow};
}

svg text{
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
// 
// Typography
// 
.displayLg {
	font-size:81px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.displayMd {
	font-size:54px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.headingH1 {
	font-size:36px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.headingH2 {
	font-size:24px;
	font-family:"Libre Franklin";
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.headingH3 {
	font-size:21px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.headingH4 {
	font-size:18px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.headingH5 {
	font-size:12px;
	font-weight:600;
	line-height:125%;
	letter-spacing:0.04em;
	text-decoration:none;
}
.paragraphRegular {
	font-size:16px;
	font-family:"Libre Franklin";
	font-weight:400;
	font-style:normal;
	line-height:150%;
	text-decoration:none;
}
.paragraphSmall {
	font-size:14px;
	font-weight:400;
	font-style:normal;
	line-height:150%;
	text-decoration:none;
}
.paragraphMicro {
	font-size:12px;
	font-weight:400;
	line-height:150%;
	text-decoration:none;
}

// 
// Components
// 

.simpleAccordion {
  background-color: ${({ theme }) => theme.styles.accordion.background};
  border-radius: 3px;
  margin-top: 24px;
  .card {
    background:transparent;
  } 
  .card .card-header {
    background: transparent;
    color: ${({ theme }) => theme.colors.purple300};
    font-size: 13px;
    font-weight: 600;
  }
  .accordionTitle {
    &:after {
      content: '';
      width: 8px;
      height: 8px;
      display: inline-block;
      margin-left: 8px;
      background: url(${({ theme }) => theme.styles.collpase.iconBackgroud});
    }
  }
  .cardContent {
    padding-left: 24px;
    padding-right: 24px;
  }
}
.accordion .card {
  border-radius: 6px;
  padding: 0;
}
.badge.badge-primary {
    font-weight: 800;
    padding: 4px 7px;
    background: rgba(254,0,124,1);
    border-radius: 16px;
}
.badge-circle {
  opacity: 0;
}
.keycap.active .badge-circle{
  opacity: 1;
}
.button {
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5em;
  padding: 14px 24px;
  border-radius: 6px;
  display: inline-block;
  transition: all 250ms ease-in-out;
  &.iconOnright {
    svg {
      margin-left: 12px;
    }
  }
  &.iconOnleft {
    svg {
      margin-right: 12px;
    }
  }
}
.button:hover {
  cursor: pointer;
}
button:focus, button:focus-within,
.button:focus,.button:focus-within {
  outline: none;
}
button:focus-visible,
.button:focus-visible {
  outline: 2px solid ${({ theme }) => theme.accessibility.focusWithinColor};
}
.button[disabled]:hover {
  cursor: not-allowed;
}
.button.sm {
  padding: 9px 24px;
}

.button .buttonLabel {
  position: relative;
  z-index: 1;
  display: flex;
  line-height: 1.5em;
}
.button.primary {
  color: #fff;
  background: ${({ theme }) => theme.styles.button.primary.backgroundColor};
  position: relative;
  background-size: 300%;
  transition: background-position .3s ease-in-out;
  transform-style: preserve-3d;
  &:hover {
    background-position: right;
  }
}
.button.secondary {
  color: #fff;
  background: ${({ theme }) => theme.colors.purple300};
  transition: 300ms background ease-in-out;
  &:hover {
    background: ${({ theme }) => theme.colors.purple200};
  }
}
.button.primary[disabled],
.button.secondary[disabled] {
  background: ${({ theme }) => theme.styles.button.primary.disabledBackgroundColor};
  color: ${({ theme }) => theme.styles.button.primary.disabledTextColor};
}
.button.danger {
  background: ${({ theme }) => theme.styles.button.danger.backgroundColor};
  color: ${({ theme }) => theme.styles.button.danger.color};
}
.button.danger:hover {
  background: ${({ theme }) => theme.styles.button.danger.backgroundColorHover};
  color: ${({ theme }) => theme.styles.button.danger.color};
}
.button.outline {
  color: ${({ theme }) => theme.styles.button.outline.color};
  border: 1px solid ${({ theme }) => theme.styles.button.outline.borderColor};
  box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.styles.button.outline.borderColor} inset;
  transition-property: border, box-shadow, background;
  transition: 300ms ease-in-out;
}
.button.outline:hover {
  border: 1px solid ${({ theme }) => theme.styles.button.outline.borderColorHover};
  box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.styles.button.outline.boxShadowColorHover} inset;
  background-color: rgba(255,255,255,0.05);
}
.button.outline[disabled] {
  opacity: ${({ theme }) => theme.styles.button.outline.disabledOpacity}; 
  color: ${({ theme }) => theme.styles.button.outline.disabledTextColor};
  border: 1px solid ${({ theme }) => theme.styles.button.outline.disabledBorderColor};
  box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.styles.button.outline.disabledBoxShadowColor} inset;
}

.button.outline.gradient {
  color: ${({ theme }) => theme.styles.button.outlineGradient.color};
  border: none;
  box-shadow: none;
  transition-property: border, box-shadow, background;
  transition: 300ms ease-in-out;
  position: relative;
}
.button.outline.gradient .buttonLabel{
  z-index: 1;
  position: relative;
}

.button.outline.gradient:before {
  content: '';
  position: absolute;
  z-index: 1;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: -1px; 
  border-radius: 6px;
  background: ${({ theme }) => theme.styles.button.outlineGradient.background};
  border: 2px solid transparent;
  background-position: 308% 0;
  background-size: 149%;
  transition: 200ms all ease-in-out;
}
.button.outline.gradient:hover:before {
  background-position: 300% 0;
  background-size: 190%;
}

.buttonFX {
  position: absolute;
  z-index: 0;
  width: 60px;
  height: 32px;
  bottom: 2px;
  left: 50%;
  transform: translate3d(-50%,0, -1px);
  transition: all 200ms ease-in-out;
  opacity: 0.5;
}
.button.primary:not([disabled]) .buttonFX,
.button.outline.gradient .buttonFX {
  filter: blur(2px);
  background: ${({ theme }) => theme.colors.gradient};
}
.button.primary:not([disabled]):hover .buttonFX,
.button.outline.gradient:hover .buttonFX {
  bottom: -5px;
  filter: blur(15px);
  width: 100px;
}

.btn-primary.button-config,
.button-config {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
  padding: 8px 16px;
  border: ${({ theme }) => theme.styles.button.config.border};
  color: ${({ theme }) => theme.styles.button.config.color}; 
  background: ${({ theme }) => theme.styles.button.config.background};
  border: none;
  border-radius: 6px;
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadow};
  transition-property: background, box-shadow, color
  transition: 300ms ease-in-out;
}
.button-config.buttonConfigMinimal {
  padding: 9px 16px 9px 12px;
  border: 1px solid ${({ theme }) => theme.styles.button.configMinimal.border};
  color: ${({ theme }) => theme.styles.button.configMinimal.color};
  background: ${({ theme }) => theme.styles.button.configMinimal.background};
  box-shadow: none;
  &:hover {
    background: inherit!important;
  }
  &.config-active {
    border: 1px solid ${({ theme }) => theme.styles.button.configMinimal.borderActive};
    color: ${({ theme }) => theme.styles.button.configMinimal.colorActive};
    background: ${({ theme }) => theme.styles.button.configMinimal.backgroundActive};
    svg {
      color: ${({ theme }) => theme.styles.button.configMinimal.iconColorActive};
    }
    &:hover {
      background: ${({ theme }) => theme.styles.button.configMinimal.backgroundActive}!important;
    }
  }
}
.button-config.sm {
  padding: 6px 16px;
  font-size: 14px;
}
.button-config.sm svg {
  max-width: 16px;
}
.btn-primary.button-config:not([disabled]):hover,
.button-config:not([disabled]):hover {
  cursor: pointer;
  color: ${({ theme }) => theme.styles.button.config.colorHover}; 
  background: ${({ theme }) => theme.styles.button.config.backgroundHover};
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowHover};
}
.btn-primary.button-config.active:not([disabled]),
.btn-primary.button-config.active:not([disabled]):hover,
.button-config.active:not([disabled]),
.button-config.active:not([disabled]):hover {
  color: ${({ theme }) => theme.styles.button.config.colorActive}; 
  background: ${({ theme }) => theme.styles.button.config.backgroundActive};
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowActive};
}

.button-config[disabled] {
  opacity: 0.5;
}
.button-config[disabled]:hover {
  cursor: not-allowed;
}

.button-config.link {
  box-shadow: none;
  border: none;
  background: transparent;
}
.button-config.link:hover {
  box-shadow: none;
  border: none;
  background: transparent;
}
.button-config.icon-right svg {
  margin-left: 10px;
}
.button-config.icon-left svg {
  margin-right: 10px;
}
.button-config.button-settings {
  height: 36px;
  width: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.styles.button.settings.color};
  background: ${({ theme }) => theme.styles.button.settings.background};
  &:hover {
    color: ${({ theme }) => theme.styles.button.settings.colorHover};
    background: ${({ theme }) => theme.styles.button.settings.backgroundHover};
  }
}


.button.short {
  padding: 6px 16px;
  border-radius: 4px;
  line-height: 2em;
  border: ${({ theme }) => theme.styles.button.short.background};
  background: ${({ theme }) => theme.styles.button.short.background};
}
.button.short:hover {
  background: ${({ theme }) => theme.styles.button.short.backgroundHover};
}
.button.short.danger {
  background: ${({ theme }) => theme.styles.button.danger.backgroundColor};
  color: ${({ theme }) => theme.styles.button.danger.color};
}
.button.short.danger:hover {
  background: ${({ theme }) => theme.styles.button.danger.backgroundColorHover};
  color: ${({ theme }) => theme.styles.button.danger.color};
}
.activeVirtualKeyboard,
.dropdown-toggle.btn.btn-primary {
  background: ${({ theme }) => theme.styles.dropdown.backgroundButtonColor};
  border: 1px solid ${({ theme }) => theme.styles.dropdown.borderButtonColor};
  border-radius: 6px;
  width: 100%;
  padding: 12px 16px;
  position: relative;
  box-shadow: none;
  text-align: left;
  font-weight: 600;
}
.dropdown.active .dropdown-toggle.btn.btn-primary,
.dropdown.show .dropdown-toggle.btn.btn-primary,
.dropdown-toggle.btn.btn-primary:hover {
  border: 1px solid ${({ theme }) => theme.styles.dropdown.borderButtonActive};
  background: ${({ theme }) => theme.styles.dropdown.backgroundButtonColor};
  box-shadow: none;
}
.dropdown-toggle.btn.btn-primary:focus-visible {
  //border: 1px solid ${({ theme }) => theme.styles.dropdown.borderButtonFocus};
  background: ${({ theme }) => theme.styles.dropdown.backgroundButtonColor};
  box-shadow: none;
  outline: auto;
}
.btn-primary:not(:disabled):not(.disabled).active:focus, 
.btn-primary:not(:disabled):not(.disabled):active:focus, 
.show>.btn-primary.dropdown-toggle:focus {
  box-shadow: none;
}
.dropdown-toggle.btn.btn-primary:focus-visible {
  //border: 1px solid ${({ theme }) => theme.styles.dropdown.borderButtonFocus};
  background: ${({ theme }) => theme.styles.dropdown.backgroundButtonColor};
  box-shadow: none;
  outline: auto;
}

.dropdown-toggle.btn.btn-primary:hover {
  background: ${({ theme }) => theme.styles.dropdown.backgroundButtonHover};
  border: 1px solid ${({ theme }) => theme.styles.dropdown.borderButtonHover};
  box-shadow: none;
}

/*
// Config Style
*/
.dropdown-toggle.btn.btn-primary.button-config-style {
  font-size: 12px;
  font-weight: 600;
  border: ${({ theme }) => theme.styles.button.config.border};
  color: ${({ theme }) => theme.styles.button.config.color}; 
  background: ${({ theme }) => theme.styles.button.config.background};
  border: none;
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadow};
  transition: background 300ms ease-in-out;
}
.dropdown-toggle.btn.btn-primary.button-config-style:not([disabled]):hover {
  cursor: pointer;
  color: ${({ theme }) => theme.styles.button.config.colorHover}; 
  background: ${({ theme }) => theme.styles.button.config.backgroundHover};
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowHover};
  border: none;
}
.dropdown-toggle.btn.btn-primary.button-config-style:not([disabled]):focus-visible {
  background: ${({ theme }) => theme.styles.button.config.backgroundHover};
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowHover};
  outline: auto;
}
.show .dropdown-toggle.btn.btn-primary.button-config-style {border: none;}
.active .dropdown-toggle.btn.btn-primary.button-config-style:not([disabled]),
.active .dropdown-toggle.btn.btn-primary.button-config-style:not([disabled]):hover {
  color: ${({ theme }) => theme.styles.button.config.colorActive}; 
  background: ${({ theme }) => theme.styles.button.config.backgroundActive};
  box-shadow: ${({ theme }) => theme.styles.button.config.boxShadowActive};
  border: none;
}

.dropdown-toggle::after {
  border: none;
  position: absolute;
  right: 16px;
  top: 50%;
  width: 12px;
  height: 12px;
  background-image: url(${iconChevronDown});
  background-size: cover;
  transform: translate3d(0, -50%, 0);
}
.active .dropdown-toggle.button-config-style::after {
  background-image: url(${iconChevronDownWhite});
}
.dropdownInner,
.dropdownItemSelected {
  display: flex;
  align-items: center;
  text-align: left;
} 
.dropdownIcon {
  flex: 0 0 24px;
}

.dropdown-menu {
  padding: 14px 8px;
  background: ${({ theme }) => theme.styles.dropdown.dropdownMenu.backgroundColor};
  box-shadow: ${({ theme }) => theme.styles.dropdown.dropdownMenu.boxShadow};
  border-radius: 6px;
  border: none;
}
.dropdown-item {
  padding: 8px;
  border-radius: 6px; 
  margin: 2px 0;
  color: ${({ theme }) => theme.styles.dropdown.dropdownMenu.itemTextColor};
  font-weight: 600;
  font-size: 14px; 
}
.dropdown-item:hover {
  color: ${({ theme }) => theme.styles.dropdown.dropdownMenu.itemTextColorHover};
  background: ${({ theme }) => theme.styles.dropdown.dropdownMenu.itemBackgroundColorHover};
}
.dropdown-item.active,
.dropdown-item.active:hover {
  color: #fff;
  background: ${({ theme }) => theme.styles.dropdown.dropdownMenu.itemBackgroundColorActive};
}

.dropdown-menu .dropdown-item.active h3,
.dropdown-menu .dropdown-item.active h4 {
  color: #fff;
}

.dropdownMultipleActions {
  position: relative;
}
.dropdownList {
  border: none;
}
.dropdownListInner {
  display: flex;
  flex-wrap: nowrap;
}
.dropdownListNumber {
  align-self: center;
  width: 34px;
  text-align: center;
  padding-right: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
  position: relative;
  color: ${({ theme }) => theme.styles.dropdown.selector.numberColor};
}
.dropdownListNumber:after {
  content: '';
  width: 1px;
  height: 30px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  background-color: ${({ theme }) => theme.styles.dropdown.selector.separatorColor};
}
.dropdownListItem {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 42px);
  padding-left: 12px;
  line-height: 1.25em;
}
.dropdownListItemInner {
  position: relative;
  padding-right: 60px;
  width: 100%;
  line-height: 1em;
}
.dropdownListItemInner .caret {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translate3d(0,-50%, 0) scale(0.8);
  color: ${({ theme }) => theme.styles.dropdown.selector.arrowsColor};
}
.dropdownListItemLabel {
  letter-spacing: -0.03em;
  font-size: 11px; 
  color: ${({ theme }) => theme.styles.dropdown.selector.labelColor};
}
.dropdownListItemSelected {
  font-size: 13px; 
  color: ${({ theme }) => theme.styles.dropdown.selector.color}
}

.dropdownMultipleActions .dropdownActions {
  position: absolute;
  right: 4px;
  top: 4px;
}
.dropdownMultipleActions .dropdown-toggle.btn.btn-primary {
  padding: 4px 16px 4px 8px;
  margin: 0;
  height: 44px;
}
.dropdownMultipleActions .dropdown-toggle.btn.btn-primary:after {
  content: none;
}

.dropdown-toggle.btn.btn-primary.button-settings {
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  text-align: center;
  border-radius: 4px;
  color: ${({ theme }) => theme.styles.button.settings.color};
  background: ${({ theme }) => theme.styles.button.settings.background};
}
.dropdown.show .dropdown-toggle.btn.btn-primary.button-settings,
.dropdown-toggle.btn.btn-primary.button-settings:hover {
  border: none;
  color: ${({ theme }) => theme.styles.button.settings.colorHover};
  background: ${({ theme }) => theme.styles.button.settings.backgroundHover};
}
.dropdownInner {
  display: flex;
  flex-wrap: nowrap;
}
.dropdownInner .dropdownIcon {
  flex: 0 0 32px; 
}
.dropdownInner .dropdownItem {
  flex: calc(100% -32px);
}
.buttonToggler.dropdown-toggle.btn.btn-primary{
  background-color: transparent;
  border: none; 
  width: 36px;
  padding: 12px 0;
  margin-top: 0;
  text-align: center;
  &:after{
    content: none;
  } 
}
.dropdownWithContent {
  .dropdownMenuPadding {
    padding: 8px 4px;
    color: ${({ theme }) => theme.styles.dropdown.dropdownMenu.textColor};
    font-size: 12px;
    a {
      color: ${({ theme }) => theme.styles.dropdown.dropdownMenu.linkColor};
    }
    .button {
      white-space: nowrap;
    }
  }
}

.selectButton .dropdown-menu {
  display: block;
  max-height: 28vh;
  overflow-y: auto;
}

.cardButtons {
  border-radius: 6px;
  background-color: ${({ theme }) => theme.styles.cardButtons.background};  
  flex: 0 0 100%;
  padding: 24px 16px 20px 16px;
  h4 {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.cardButtons.titleColor};
  }
  h5 {
    color: ${({ theme }) => theme.styles.cardButtons.subTitleColor};
  }
  p {
    color: ${({ theme }) => theme.styles.cardButtons.color};
    font-weight: 395; 
    font-size: 13px;
    margin-bottom: 8px;
  }
  .groupButtons {
    display: inline-flex;
    padding: 4px 2px;
    flex-wrap: nowrap;
    background-color: ${({ theme }) => theme.styles.cardButtons.groupButtonsBackground};
    border-radius: 6px;
    max-width: 500px;
    .button-config {  
      width: 42px;
      margin: 0 2px;
      padding: 10px 2px;  
      text-align: center;
      flex: 1;
    }
  }
  .groupButtons.groupButtonsGrid {
    background-color: transparent;
    padding: 0;
    .buttonsGrid {
      display: grid;
      grid-template-columns: repeat(4, 112px);
      grid-template-rows: repeat(2, 1fr);
      grid-gap: 4px;
      padding: 4px;
      background-color: ${({ theme }) => theme.styles.cardButtons.groupButtonsBackground};
      border-radius: 6px;
      .button-config {
        width: 100%;
        margin: 0;
        padding: 8px 2px;
      }
    }
  }
}

.tooltip {
  z-index: 1200;
}
.tooltip .tooltip-inner{
  padding: 12px;
  font-family: ${({ theme }) => theme.font};
  /* background-color: ${({ theme }) => theme.styles.card.background}; */
  font-weight: 601;
  font-size: 13px;
  letter-spacing: -0.02em;
}
.tooltip .tooltip-inner h5{
  font-weight: 600;
  font-size: 18px;
}
.tooltip .tooltip-inner ul {
  padding-left: 16px;
}
.tooltip .tooltip-inner ul li+li{
  margin-top: 8px;
}
.tooltip.tooltipWide .tooltip-inner{
  max-width: 364px!important;
  font-weight: 500;
  font-size: 14px;
}
.tooltip.tooltipWide .tooltip-inner{
  max-width: 364px!important;
  font-weight: 500;
  font-size: 14px;
}
#tooltip-top-savingMode .tooltip-inner {
  padding: 8px;
}

}
//
// Card
//
div.card {
  padding: 32px;
  border: none;
  box-shadow: none;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.styles.card.background};
  &.card-preferences--battery {
    padding: 1rem 1.5rem;
    background-color: ${({ theme }) => theme.styles.card.cardBattery.backgroundColor};
    border-radius: 0.375rem;
    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        margin-bottom: 0;
      }
    }
    .card-body h6 {
      line-height: 1.5em;
      margin-bottom: 0;
      font-weight: 401;
      color: ${({ theme }) => theme.styles.form.formLabelTextcolor};
    }
    .custom-switch {
      width: 60px;
      padding-left: 1.4rem;
    }
    .card-preferences--option + .card-preferences--option {
      margin-top: 1rem;
    }
    .justify-between {
      justify-content: space-between;
      align-items: center;
    }
    .toggleButtonsContainer {
      margin: 4px 14px;
    }
  }
}
div.card-body {
  padding-left: 0;
  padding-right: 0; 
}

div.card.card-preferences .card-title {
  color: ${({ theme }) => theme.styles.card.cardTitleColor};
}
div.card.card-preferences .card-title svg {
  color: ${({ theme }) => theme.colors.gray500};
}
div.card.card-preferences .card-body {
  padding-top: 0;
}

.modal-backdrop.show {
  background-color: ${({ theme }) => theme.styles.modal.backdropColor};
  opacity: 1;
}
.modal .modal-content {
  transform: translateX(64px);
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.styles.modal.background};
}
.modal .modal-header {
  border: none;
  padding: 32px 32px 0 32px;
}
.modal .modal-header .close{
  opacity: 1;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url('${({ theme }) => theme.styles.modal.closeButton}');
}
.modal .modal-header .close span{
  opacity: 0;
}
.modal .modal-body {
  padding: 24px 32px;
  .modalInner {
    padding: 16px 24px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.styles.modal.backgroundInner};
  }
}
.modal .modal-body .form-control {
  font-weight: 600;
  font-size: 16px; 
  height: calc(1.5em + 1.5rem + 2px);
   color: ${({ theme }) => theme.styles.form.inputColor};
  background: ${({ theme }) => theme.styles.form.inputBackgroundColor};
  border: 1px solid ${({ theme }) => theme.styles.form.inputBorder};
} 
.modal .modal-body .form-control:focus {
  background: ${({ theme }) => theme.styles.form.inputBackgroundColorActive};
  border: 1px solid ${({ theme }) => theme.styles.form.inputBorderActive};
  box-shadow: none;
}
.modal .modal-footer {
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.styles.modal.footerBackground};
  padding: 24px 32px;
}
.modal .modal-title {
  letter-spacing: -0.03em;
  font-weight:600;
  color: ${({ theme }) => theme.styles.modal.titleColor};
}
@media (min-width: 1200px) {
  .modal-xl {
    max-width: 1080px;
  }
}
@media (min-width: 1360px) {
  .modal-xl {
    max-width: 1240px;
  }
}

//
// Recording Macro
//
.modal.modal-recordMacro {
  .modal-header {
    align-items: center;
    position: relative;
    justify-content: center;
    .close {
      margin-right: 0;
      position: absolute;
      top: 42px;
      right: 32px;
    }
  }
  .modal-body {
    padding: 24px 0;
  }
  .modal-title {
    flex: 0 0 100%;
    font-size: 32px;
  }
  .recordMacrosButton {
    width: 100%;
    text-align: center;
    margin-top: -27px;
    margin-bottom: 32px;
    position: relative;
  }
  .tabSaveButton {
    text-align: center;
    .button.outline.gradient[disabled] {
      opacity: 1;
      color: ${({ theme }) => theme.styles.macro.tabSaveButtonColor}; 
      &:before {
        background: ${({ theme }) => theme.styles.macro.tabSaveButtonBorder};  
      }
      .buttonFX {
        display: none;
      }
    }
  }
  .button-config.undoRecording {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-164px, 3px, 0);
    width: 52px;
    height: 52px;
    border-radius: 50%;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }
  .recordButton {
    border: 3px solid ${({ theme }) => theme.styles.button.recordButton.borderColor};
    background:  ${({ theme }) => theme.styles.button.recordButton.background};
    color: ${({ theme }) => theme.styles.button.recordButton.color};
    backdrop-filter: blur(5px);
    border-radius: 32px;
    width: 204px;
    font-weight: 700;
    z-index: 3;
    position: relative;
    svg {
      display: none;
    }
    &.isResume {
      border: 3px solid ${({ theme }) => theme.styles.button.recordButton.borderColorResume};
    }
    &.isRecording {
      svg {
        display: inline-block;
      }
      .buttonText {
        display: none;
      }
    }
    &:hover {
      background:  ${({ theme }) => theme.styles.button.recordButton.backgroundHover};
    }
    .buttonLabel {
      justify-content: center;
    }
  }
  .recordMacroOptions {
    padding: 12px;
    background-color: ${({ theme }) => theme.styles.macro.recordMacroOptionsBackground};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    box-shadow: ${({ theme }) => theme.styles.macro.recordMacroOptionsBoxShadow};
    h5 {
      letter-spacing: 0.2em;
      color: ${({ theme }) => theme.styles.macro.recordMacroOptionsTitle};
      margin-right: 8px;
      margin-bottom: 0;
    }
    .recordMacroButtons {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      .button-config {
        margin-left: 2px;
        margin-right: 2px;
      }
    }
  }
}
.timelineRecordTracking {
  padding: 12px 0;
  background-color: ${({ theme }) => theme.styles.macro.timelineRecordTrackingBackground};
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 124px;
  .timelineRecordSequence {
    position: absolute;
    width: 50%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: right;
    margin-top: -8px;
    .timelineRecordSequenceInner {
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      align-content: flex-end;
      justify-content: flex-end;
      flex: 0 0 100%;
      align-items: center;
    }
  }
  .timelinePointeText {
    position: absolute;
    height: 62px;
    width: 1px;
    background-color: ${({ theme }) => theme.styles.macro.timelinePointeText};
    top: 50%;
    right: -2px;
    transform: translate(0, -50%);
    display: none;
  }
  .isRecording .timelinePointeText {
    display: inline-block;
    animation: cursor-blink 1.5s steps(2) infinite;
  }
  .AnimatedTimelineRecording {
    bottom: 6px;
    position: absolute;
  }
  .keySpecial {
    padding: 6px;
    border-radius: 3px;
    color: ${({ theme }) => theme.styles.macro.specialKeyColor};
    margin: 0 3px;
    border: 1px solid ${({ theme }) => theme.styles.macro.specialKeyColor};
    font-size: 13px;
  }
}
.recordingMessage {
  text-align: center;
  margin: 32px auto;
  max-width: 550px;
  color: ${({ theme }) => theme.styles.macro.recordingMessageColor};
  font-size: 14px;
  font-weight: 395;
}

//
// Preview macro
//
.previewMacro {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  margin-left: -2px;
  margin-right: -2px;
  .previewKey {
    line-height: 2em;
    font-size: 14px;
    border-radius: 3px;
    color: ${({ theme }) => theme.styles.macro.previewColor};
    border: 1px solid ${({ theme }) => theme.styles.macro.previewColor};
    padding: 0 6px;
    margin: 2px;
  }
  .action-2 {
    color: ${({ theme }) => theme.colors.brandDangerLighter};
    border: 1px solid ${({ theme }) => theme.colors.brandDangerLighter};
    padding: 0 6px 0 24px;
    position: relative;
    margin-left: 2px;
    margin-right: 2px;
    margin-bottom: 2px;
    svg {
      position: absolute;
      top: 50%;
      left: 3px;
      transform: translate3d(0, -55%, 0);
    }
  }
  .action-8 { 
    margin: 0;
    border-color: transparent;
    padding: 0;
    &.keyCode-40,
    &.keyCode-41,
    &.keyCode-42,
    &.keyCode-43,
    &.keyCode-57,
    &.keyCode-58,
    &.keyCode-59,
    &.keyCode-60,
    &.keyCode-61,
    &.keyCode-62,
    &.keyCode-63,
    &.keyCode-64,
    &.keyCode-65,
    &.keyCode-66,
    &.keyCode-67,
    &.keyCode-68,
    &.keyCode-69,
    &.keyCode-70,
    &.keyCode-71,
    &.keyCode-72,
    &.keyCode-73,
    &.keyCode-74,
    &.keyCode-75,
    &.keyCode-76,
    &.keyCode-77,
    &.keyCode-78,
    &.keyCode-79,
    &.keyCode-80,
    &.keyCode-81,
    &.keyCode-82,
    &.keyCode-83,
    &.keyCode-88,
    &.keyCode-101, 
    &.keyCode-104,
    &.keyCode-105,
    &.keyCode-106,
    &.keyCode-107,
    &.keyCode-108,
    &.keyCode-109,
    &.keyCode-110,
    &.keyCode-111,
    &.keyCode-112,
    &.keyCode-113,
    &.keyCode-114,
    &.keyCode-115 {
      border: 1px solid ${({ theme }) => theme.styles.macro.previewColor};
      padding: 0 6px;
      margin: 2px;
    }
  }
  .isModifier {
    color: ${({ theme }) => theme.styles.macro.previewColor};
    border: 1px solid ${({ theme }) => theme.styles.macro.previewColor};
    padding: 0 6px;
    position: relative;
    margin-right: 3px;
    margin-bottom: 2px;
    &.keyCode-229,
    &.keyCode-225 {
      border-color: ${({ theme }) => theme.styles.macroKey.shift.background}; 
      color:  ${({ theme }) => theme.styles.macroKey.shift.background};
    }
    &.keyCode-224,
    &.keyCode-228 {
      border-color: ${({ theme }) => theme.styles.macroKey.control.background}; 
      color:  ${({ theme }) => theme.styles.macroKey.control.background};
    }
    &.keyCode-226,
    &.keyCode-230 {
      border-color: ${({ theme }) => theme.styles.macroKey.alt.background}; 
      color:  ${({ theme }) => theme.styles.macroKey.alt.background};
    }
    &.keyCode-227,
    &.keyCode-231 {
      border-color: ${({ theme }) => theme.styles.macroKey.os.background}; 
      color:  ${({ theme }) => theme.styles.macroKey.os.background};
    }
  }
}

.progress {
  border-radius: 0;
  height: 6px;
  background-color: ${({ theme }) => theme.styles.progress.progressBackground};
  overflow: visible;
} 
.progress-bar {
  height: 6px;
  border-radius: 3px;
  box-shadow: ${({ theme }) => theme.styles.progress.boxShadow};    
  background-color: ${({ theme }) => theme.styles.progress.progressBarBackground};
}

//
// Toast
// 
.Toastify__toast-container {
  padding: 0;
  width: 368px;
  .Toastify__toast-icon {
    display: none;
    visibility: hidden;
  }
}
.Toastify__toast--default,
.Toastify__toast {
  padding: 0;
  border-radius: 6px;
  background: ${({ theme }) => theme.styles.toast.background};
  box-shadow: ${({ theme }) => theme.styles.toast.boxShadow}; 
  position: relative;
  overflow: visible;
  color: ${({ theme }) => theme.styles.toast.defaultColorBody};
  &:after {
    content: '';
    background-color: ${({ theme }) => theme.styles.toast.backgroundNoStatus};
    width: 3px;
    height: 24px;
    border-radius: 3px 0px 0px 3px;
    position: absolute;
    left: -3px;
    top: 22px;
  }
}

.Toastify__toast--default {
  .toastIcon,
  .toastBodyInner h4{
    color: ${({ theme }) => theme.styles.toast.defaultColorTitle};
  }
}
.Toastify__toast--warning {
  background: ${({ theme }) => theme.styles.toast.backgroundWarning};
  &:after {
    background: ${({ theme }) => theme.colors.gradientWarning};
  }
  .toastIcon,
  .toastBodyInner h4{
    color: ${({ theme }) => theme.styles.toast.warningColorTitle};
  }
}
.Toastify__toast--error {
  background: ${({ theme }) => theme.styles.toast.backgroundDanger};
  &:after {
    background: ${({ theme }) => theme.colors.gradientDanger};
  }
  .toastIcon,
  .toastBodyInner h4{
    color: ${({ theme }) => theme.styles.toast.dangerColorTitle};
  }
}
.Toastify__toast--success {
  background: ${({ theme }) => theme.styles.toast.backgroundSuccess};
  &:after {
    background: ${({ theme }) => theme.colors.gradientSuccess};
  }
  .toastIcon,
  .toastBodyInner h4{
    color: ${({ theme }) => theme.styles.toast.successColorTitle};
  }
}
.Toastify__close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url('${({ theme }) => theme.styles.modal.closeButton}');
  width: 24px;
  height: 24px;
  opacity: 0.7;
  svg {
    display:none;
  }
}

.Toastify__progress-bar {
  margin: 8px 24px;
  width: calc(100% - 42px);
  height: 3px;
  border-radius: 3px;
  background: ${({ theme }) => theme.styles.toast.backgroundNoStatus};
  &.Toastify__progress-bar--success {
    background: ${({ theme }) => theme.styles.toast.successColorTitle};
  }
  &.Toastify__progress-bar--warning {
    background: ${({ theme }) => theme.styles.toast.warningColorTitle};
  }
  &.Toastify__progress-bar--error {
    background: ${({ theme }) => theme.styles.toast.dangerColorTitle};
  }
}
.Toastify__toast-container--top-right {
  top: 92px;
  right: 26px;
}


//
// MACROKEY
//
.keyMacro {
  border-radius: 4px;
  background: ${({ theme }) => theme.styles.macroKey.background};
  padding: 3px;
  width: 100px;
  height: 64px;
  margin: 4px 2px;
  display: flex;
  flex-wrap: wrap;
  .headerDrag {
      border-radius: 4px 4px 0px 0px;
      background-color:  ${({ theme }) => theme.styles.macroKey.backgroundHeader};
      border-bottom: 1px solid ${({ theme }) => theme.styles.macroKey.borderColor}; 
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0; 
      padding-right: 4px;
      flex: 0 0 100%;
  }
  .dragable {
    color:  ${({ theme }) => theme.styles.macroKey.iconDragColor};  
    padding: 0 6px;
  }
  .actionicon {
    color:  ${({ theme }) => theme.styles.macroKey.actionIconColor};
  }
  .bodyDrag {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;  
      flex: 0 0 100%;
  }
  .dropdown-toggle.btn.btn-primary {
      padding: 0 2px;
      background-color: transparent;
      margin: 0;
      border: none;
      &:after {
          content: none;
      }
  } 
}
#portalMacro {
  .keyMacroMiniDashboard {
    border-radius: 6px;
    overflow: hidden;
    border: ${({ theme }) => theme.styles.macro.keyMacroMiniDashboardBorder}; 
  }
    .keyInfo {
      padding: 16px 12px 12px 12px;
      background: ${({ theme }) => theme.styles.macro.keyInfoBackground}; 
      h4 {
          font-weight: 600;
          text-transform: uppercase;
          margin: 0;
          font-size: 13px;
          font-weight: 500;
          color: ${({ theme }) => theme.styles.macro.keyInfoTitle}; 
      }
    }
    .keyFunctions {
        border-top: 1px solid ${({ theme }) => theme.styles.macro.keyFunctionsBorder};
        padding: 12px 8px;
        background: ${({ theme }) => theme.styles.macro.keyInfoBackground}; 
        h5 {
            color: ${({ theme }) => theme.styles.macro.keyFunctionTile};
            font-size: 13px;
            font-weight: 500;
            text-transform: none; 
            letter-spacingL: -0.025em; 
            margin: 0;
            margin-bottom: 8px;
        }
    }
    .keyFunctionsButtons {
      display: flex;
      flex-wrap: nowrap;
      margin-left: -2px;
      margin-right: -2px;
    }
    .button-config {
      color: ${({ theme }) => theme.styles.button.config.color};
      white-space: nowrap;
      margin: 0 2px;
      flex-grow: 1;
      text-align: center;
      &:hover {
        color: ${({ theme }) => theme.styles.button.config.colorHover};
      }
      &.active {
        color: #fff;
      }
    }
    .keyModifiers {
      padding: 12px 8px;
      background: ${({ theme }) => theme.styles.macro.keyMacroMiniDashboardBackground}; 
      h4 {
          color: ${({ theme }) => theme.styles.macro.keyFunctionTile};
          font-size: 13px;
          font-weight: 500;
          text-transform: none; 
          letter-spacingL: -0.025em; 
          margin-bottom: 8px;
      }
    }
    .keyValue {
      color: ${({ theme }) => theme.styles.macro.keyValueColor};
      font-size: 24px;
      font-weight: 600;
      text-transform: capitalize;
      margin: 0;
      small {
        text-transform: none;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .keyMacroItemOptions {
      padding-top: 8px;
    }
    .keyModifiersButtons {
      display: flex;
      flex-wrap: nowrap;
      margin-left: -2px;
      margin-right: -2px;
      display: grid;
      grid-gap: 6px 4px;
      grid-template-columns: repeat(4, 1fr);
    }
    .dropdown-menu {
      min-width: 362px;
      padding: 8px;
    }
    .dropdown-item.unstyled {
      padding: 0;
      margin: 0 2px;
    }
    .dropdown-toggle.btn.btn-primary {
      border: none;
    }
  }
  .keyMacroFreeSlot {
    background: transparent;
  }
  .keyMacroOptions {
    .dropdown-toggle.btn.btn-primary{
      color: ${({ theme }) => theme.styles.macroKey.dropdownIconColor};
      border: none;
    }
    &.show {
    .dropdown-toggle.btn.btn-primary {
      color: #fff;
      background-color: ${({ theme }) => theme.styles.macroKey.dropdownIconColor};
      border: none;
    }
  }
}
.isModifier {
.keyMacroOptions {
  .dropdown-toggle.btn.btn-primary{
    color: ${({ theme }) => theme.styles.macroKey.dropdownIconColorModifier};
  }
}
.keyMacro {
  order: 2;
  // width: 86px;
  color: ${({ theme }) => theme.styles.macroKey.colorModifier}; 
  .headerDrag {
    order: 2;
    border-radius: 0px 0px 4px 4px;
    background-color: ${({ theme }) => theme.styles.macroKey.backgroundHeaderModifier};
    border-bottom: none;
    border-top: 1px solid ${({ theme }) => theme.styles.macroKey.borderColorModifier}; 
  }
  .bodyDrag {
    order: 1;
  }
  .dragable {
    color:  ${({ theme }) => theme.styles.macroKey.iconDragColorModifier};
  }
}
.keyMacroFreeSlot {
  order: 1;
}
.actionicon {
  color:  ${({ theme }) => theme.styles.macroKey.actionColorModifier};
}

// Shift modifiers
&.keyCode-229,
&.keyCode-225 {
  .keyMacro {
    background: ${({ theme }) => theme.styles.macroKey.shift.background}; 
    color:  ${({ theme }) => theme.styles.macroKey.shift.color};
  }
  .keyMacroFreeSlot {
    background: transparent;
  }
  .actionicon {
    color:  ${({ theme }) => theme.styles.macroKey.shift.actionColor};
  }
}
// Control modifiers
&.keyCode-224,
&.keyCode-228 {
  .keyMacro {
    background: ${({ theme }) => theme.styles.macroKey.control.background}; 
  }
  .keyMacroFreeSlot {
    background: transparent;
  }
}
// Alt modifiers
&.keyCode-226,
&.keyCode-230 {
  .keyMacro {
    background: ${({ theme }) => theme.styles.macroKey.alt.background}; 
  }
  .keyMacroFreeSlot {
    background: transparent;
  }
}
// OS modifiers
&.keyCode-227,
&.keyCode-231 {
  .keyMacro {
    background: ${({ theme }) => theme.styles.macroKey.os.background}; 
  }
  .keyMacroFreeSlot {
    background: transparent;
  }
}
}
.isDelay {
.keyMacroOptions {
  .dropdown-toggle.btn.btn-primary{
    color: ${({ theme }) => theme.styles.macroKey.dropdownIconColorModifier};
  }
}
.keyMacro {
  background:  ${({ theme }) => theme.styles.macroKey.delay.background};
  color: ${({ theme }) => theme.styles.macroKey.delay.color}; 
  .headerDrag {
    border-bottom: 1px solid ${({ theme }) => theme.styles.macroKey.delay.borderColor};
  }
}
.keyMacroFreeSlot {
  background: transparent;
}
.dragable {
  color:  ${({ theme }) => theme.styles.macroKey.iconDragColorModifier};
}
.actionicon {
  color:  ${({ theme }) => theme.styles.macroKey.delay.actionIconColor};
}
}


//
// Form
//
.form-label {
  font-size: 14px;
  color: ${({ theme }) => theme.styles.form.formLabelTextcolor};
  margin-bottom: .25rem;
}
.custom-control.custom-switch .custom-control-label::before {
  width: 60px;
  height: 32px;
  border-radius: 30px;
  background: ${({ theme }) => theme.styles.switch.background};
  border: none;
  box-shadow: none;
}
.custom-control.custom-switch .custom-control-label::before {
  box-shadow: none !important;
}
.custom-control.custom-switch .custom-control-label::after {
  width:24px;
  height:24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.styles.switch.thumbBackground};
  border: 1px solid ${({ theme }) => theme.styles.switch.thumbBorderColor};
  box-shadow: ${({ theme }) => theme.styles.switch.thumbBoxShadow};
  top: 8px;
  left: -32px;
}
.custom-control.custom-switch .custom-control-input:checked~.custom-control-label::before {
  background-color: ${({ theme }) => theme.styles.switch.backgroundActive};
  border: none;
}
.custom-control.custom-switch .custom-control-input:checked~.custom-control-label::after {
  transform: translateX(28px);
  background-color: ${({ theme }) => theme.styles.switch.thumbBackgroundActive};
  border: 1px solid ${({ theme }) => theme.styles.switch.thumbBorderColorActive};
  box-shadow: ${({ theme }) => theme.styles.switch.thumbBoxShadowActive};
}

.rangeslider {
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.styles.slider.trackColor};
}
.rangeslider, .rangeslider .rangeslider__fill {
  box-shadow: none;
}
.rangeslider-horizontal .rangeslider__fill {
  height: 100%;
  background-color: ${({ theme }) => theme.styles.slider.progressColor};
  border-radius: 3px;
  top: 0;
  box-shadow: none;
}

.rangeslider-horizontal .rangeslider__handle {
  background: ${({ theme }) => theme.styles.slider.handleBackgroundColor};
  border: 3px solid ${({ theme }) => theme.styles.slider.handleBorderColor};
  box-sizing: border-box;
  box-shadow: 0px 4px 12px ${({ theme }) => theme.styles.slider.handleBoxShadow};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-weight: 600;
}
.rangeslider-horizontal .rangeslider__handle:after {
  content: none;
}
.rangeslider .rangeslider__handle-tooltip {
  font-weight: 600;
  font-size: 13px;
  letter-spacing; -0.03em;
}
.slider-wrapper {
  display: grid;
  align-items: center;
  grid-template-columns: 52px 1fr 52px;
  .slider-label {
    text-align: center;
  }
}
.tagsfix {
  color: ${({ theme }) => theme.styles.slider.labelColor};
  font-weight: 200;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
.bs-tooltip-right.tooltipMenu {
  z-index: 2000;  
  white-space: nowrap!important;
  font-weight: 600;
  letter-spacing: -0.03em;
  text-align: left;
  br  {
    content: ' ';
  }
}
.bs-tooltip-right.tooltipMenu * {
  white-space: nowrap!important;
  text-align: left;
}

@media screen and (min-width: 1260px) {
  .tooltipKeyboardViewSelector {
    display: none!important;
  }
}
@media screen and (min-width: 1000px) {
  #root {
    --sidebarWidth: ${({ theme }) => theme.sidebarWidthLarge}px;
  }
  .bs-tooltip-right.tooltipMenu {
    display: none!important;
  }
}
@media screen and (min-width: 1299px) {
  div.main-container {
    padding-left: calc(120px + 30px);
    padding-left: 30px;
    padding-right: 30px;
  }
  .Toastify__toast-container--top-right {
    top: 92px;
    right: 46px;
  }
}

@media screen and (max-height: 870px) {
  #root {
    --sidebarWidth: ${({ theme }) => theme.sidebarWidthMedium}px;
  }
  div.main-container {
    padding-left: 8px;
    padding-right: 8px;
  }
  .bs-tooltip-right.tooltipMenu {
    display: inline-block!important;
  }
}

@media screen and (max-height: 670px) {
  #root {
    --sidebarWidth: ${({ theme }) => theme.sidebarWidthSmall}px;
  }
}

.animOpacity {
  opacity: 0;
  animation: animOpacity 0.3s forwards;
} 
@keyframes animOpacity {
  to {
    opacity: initial;
  }
}

.animRight {
    transform: translateX(82px);
    opacity: 0;
    animation: animRight 0.3s forwards;
}
  
@keyframes animRight {
    to {
      transform: initial;
      opacity: initial;
    }
}

.animHide {
  transform: initial;
  opacity: initial;
  animation: animHide 0.3s forwards;
}

@keyframes animHide {
  to {
    transform: translateX(82px);
    opacity: 0;  
  }
}

.animWaiting {
  transform: scale(0);
  opacity: 0;
}

.animIn {
  animation: animIn 0.3s forwards;
  animation-timing-function: cubic-bezier(0.75, -1.27, 0.3, 2.33);
}
@keyframes animIn {
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animOut {
  animation: animOut  0.3s forwards;
  animation-timing-function: cubic-bezier(0.75, -1.27, 0.3, 2.33);
}
@keyframes animOut {
  to {
    transform: scale(0);
    opacity: 0;
  }
}
.animInCheck {
  animation: animInCheck 0.3s forwards;
  animation-timing-function: cubic-bezier(0.75, -1.27, 0.3, 2.33);
}
@keyframes animInCheck {
  to {
    transform: scale(1) translate3d(-50%, -50%, 0);
    opacity: 1;
  }
}
@keyframes cursor-blink {
  0% {
    opacity: 0;
  }
}

//
// CustomCheckbox
//
.customCheckbox {
  .form-check::before {
    border: 2px solid ${({ theme }) => theme.styles.customCheckbox.borderColor};
  }
  .form-check::after {
    background-color: ${({ theme }) => theme.styles.customCheckbox.background};
  }
  &.active {
    .form-check::before {
      border: 2px solid ${({ theme }) => theme.styles.customCheckbox.borderColorActive};
    }
    .form-check::after {
      background-color: ${({ theme }) => theme.styles.customCheckbox.backgroundActive};
    } 
  }
}

::-webkit-scrollbar {
  background-color: rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: transparent;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  background-transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.85);
  outline: 2px solid transparent;
  border-radius: 3px;
}
::-webkit-scrollbar:vertical {
  width: 8px; 
}
::-webkit-scrollbar-thumb:vertical {
  width: 6px; 
}
::-webkit-scrollbar:horizontal {
  height: 8px; 
}
::-webkit-scrollbar-thumb:horizontal {
  height: 6px; 
}


.pageHeader .savingButtons {
  display: flex;
  flex-wrap: nowrap;
  
}
.pageHeader .itemListelector .dropdown-menu {
  max-height: 80vh;
  overflow-y: auto;
}
@media screen and (max-width: 1229px){
  .main-container .layoutEditor,
  .main-container .superkeys,
  .main-container .macroEditor {
    .pageHeader .pageTitle {
      display: none;
    }
    .pageHeader .pageTools {
      width: 100%;
    }
  }
}

@media screen and (max-width: 1240px) {
  .main-container .layoutEditor .singleViewMode,
  .main-container .superkeys .singleViewMode {
    .singleViewWrapper {
      grid-template-columns: 1fr;
      grid-gap: 24px;
    }
    .keyEnhanceWrapper {
      order: 2;
    }
    .KeyVisualizer {
      display: none;
    }
    .ModPicker {
      width: 100%;
    }
  }
}
@media screen and (max-width: 1360px) {
  .pageHeader .button.outline.gradient.addNew {
    padding: 5px 6px;
    svg {
      margin-right: 0;
    }
    .buttonText {
      display: none;
    }
  }
}
@media (max-width: 1460px) {
  .pageHeader .savingButtons .buttonText span {
    display: none;
  }
  .standarViewMode .standardView{
    padding: 24px 24px 24px 142px;
  }
}
@media screen and (max-width: 1520px){
  .main-container .macroEditor {
    .progressIndicatorBar svg {
      width: 45px;
    }
  }
}


/* Layout Editor view responsive - Raise */
@media screen and (max-height: 900px) {
  .keyboard.singleViewMode .LayerHolder {
    max-height: 342px;
  }
}
@media (min-height: 962px) {
  body .layoutEditor .singleViewMode.keyboard .keyboardsWrapper {
    height: calc(100vh - 104px);
  }
  body .singleViewMode .dygma-keyboard-editor {
    margin-top: auto;
  }
  body .ordinary-keyboard-editor {
    margin-top: auto!important;
  }
}
@media (min-width: 1800px) {
  body .layoutEditor .singleViewWrapper {
    grid-template-columns: minmax(160px,340px) minmax(840px,auto);
  }
}
@media (min-width: 1800px) and (min-height: 980px) {
  body .layoutEditor .KeysWrapper {
    max-width: 1160px;
  }
}
@media (min-width: 1980px) and (min-height: 980px) {
  body .layoutEditor .LayerHolder {
    max-width: 1580px;
  }
}
@media (min-width: 2220px) and (min-height: 980px) {
  body .layoutEditor .LayerHolder {
    max-width: 2220px;
  }
  .singleViewMode.keyboard .raiseKeyboard {
    max-height: initial;
  }
  body .layoutEditor .KeysWrapper {
    max-width: 100%;
  }
  .svgStyle {
      max-width: 100%!important;
      width: 100%;
  }
  #standardViewCointainer-tabpane-tabKeys .svgStyle {
    max-width: 1640px!important;
  }
}

.virtualKeyboards-wrapper {
  display: flex;
  grid-gap: 32px;
}
.virtualKeyboards-col {
  background: ${({ theme }) => theme.styles.virtualKeyboard.cardBackground};
  border: 1px solid ${({ theme }) => theme.styles.virtualKeyboard.cardBorder};
  border-radius: 14px;
  padding: 32px;
  flex: 1;
  h4 {
    color: ${({ theme }) => theme.styles.virtualKeyboard.cardTitleColor};
  }
  p {
    font-family: ${({ theme }) => theme.font};
    font-weight: 401;
    font-size: 15px;
    color: ${({ theme }) => theme.styles.virtualKeyboard.cardTextColor};
    margin-top: 16px;
    margin-bottom: 24px;
  }
  label {
    font-weight: 700;
    font-size: 14px;
    color: ${({ theme }) => theme.styles.virtualKeyboard.labelTextColor};
    margin: 0;
  }
}
.virtualKeyboards-col--text {
  flex: 0 0 1px;
  width: 1px;
  position: relative;
  border: none;
  padding: 0;
  background-color: ${({ theme }) => theme.styles.virtualKeyboard.orLineColor};
  span {
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 6px;
    color: ${({ theme }) => theme.styles.virtualKeyboard.orTextColor};
    font-weight: 700;
    font-size: 12px;
    background-color: ${({ theme }) => theme.styles.virtualKeyboard.orBgColor};
  }
}
.virtualKeyboards-wrapper {
  .custom-dropdown {
    margin-bottom: 24px;
    .virtualKeyboardsMenu {
      min-width: 100%;
    }
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
}
@media screen and (max-width: 991px) {
  .virtualKeyboards-wrapper {
    flex-direction: column;
    .virtualKeyboards-col--text {
      height: 100%;
      width: 100%;
      span {
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
    }
  }
  
}

`;

export default GlobalStyles;
