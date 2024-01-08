// import original module declaration
import "styled-components";

// and extend it
declare module "styled-components" {
  export interface DefaultTheme {
    name: string;
    drawerWidth: number;
    sidebarWidthLarge: number;
    sidebarWidthMedium: number;
    sidebarWidthSmall: number;
    body: {
      backgroundImage: string;
      backgroundImage2x: string;
    };
    keyboardPicker: {
      keyColor: string;
      keyActiveColor: string;
      keyDisabledColor: string;
      keyTextColor: string;
      keyIconColor: string;
      keySubTextColor: string;
      keyActiveSubTextColor: string;
      keyTextDisabledColor: string;
      titleColor: string;
      subTitleColor: string;
    };
    colors: {
      gardient: string;
      gradient: string;
      gradientDisabled: string;
      gradientDisabledLight: string;
      gradientWarning: string;
      gradientDanger: string;
      gradientSuccess: string;
      gray25: string;
      gray50: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      purple300: string;
      purple200: string;
      purple100: string;
      brandPrimary: string;
      brandSecondary: string;
      brandSuccess: string;
      brandSuccessLighter: string;
      brandWarning: string;
      brandWarningLighter: string;
      brandDanger: string;
      brandDangerLighter: string;
      pastelShadesGreen200: string;
      pastelShadesGreen300: string;
      pastelShadesGreen100: string;
      pastelShadesMint300: string;
      pastelShadesMint200: string;
      pastelShadesMint100: string;
      body: string;
      text: string;
      textWarning: string;
      textSuccess: string;
      textDanger: string;
      subtext: string;
      tipIcon: string;
      button: {
        text: string;
        background: string;
        deselected: string;
        hover: string;
        disabled: string;
        cancel: string;
        save: string;
        active: string;
        secondary: string;
        activeText: string;
        deselectedText: string;
        boxShadow: string;
        borderColor: string;
      };
      link: {
        text: string;
        opacity: number;
      };
    };
    card: {
      color: string;
      altColor: string;
      colorDisabled: string;
      background: string;
      backgroundActive: string;
      disabled: string;
      altBackground: string;
      altBackgroundActive: string;
      ballIcon: string;
      icon: string;
      altIcon: string;
      radius: string;
      boxShadow: string;
    };
    slider: {
      color: string;
    };
    font: string;
    accessibility: {
      focusWithinColor: string;
    };
    styles: {
      accordion: {
        background: string;
      };
      accordionFirmware: {
        background: string;
        headerBackground: string;
        colorTitle: string;
      };
      backupConfiguratorFolder: {
        headingColor: string;
        inputColor: string;
        inputBackground: string;
        border: string;
      };
      badge: {
        textColor: string;
        dangerLowBG: string;
        dangerLowText: string;
        warningBG: string;
        warningText: string;
        subtleColor: string;
        subtleBGColor: string;
      };
      banner: {
        backgroundWarning: string;
        textWarning: string;
        svgBackgroundWarning: string;
      };
      batteryIndicator: {
        pileBackgroundColor: string;
        pileBackgroundSavingMode: string;
        pileBackgroundFatalError: string;
        titleColor: string;
        panelBackgroundColor: string;
        largeIndicatorPercentageColor: string;
        largeIndicatorStrokeColor: string;
        largeIndicatorFillColor: string;
        largeIndicatorDisconnectedColor: string;
        lineDisconnectedColor: string;
        fillShapeColor: string;
        fillShapeOpacity: number;
        fillShapeDefaultOpacity: number;
        strokeShapeColor: string;
        alertWarningBackground: string;
        alertWarningText: string;
        alertErrorBackground: string;
        alertErrorText: string;
        alertDisconnectedBackground: string;
        alertDisconnectedText: string;
        shapeIndicatorOpacity: number;
      };
      batterySettings: {
        descriptionColor: string;
        descriptionHighlightColor: string;
      };
      button: {
        primary: {
          backgroundColor: string;
          disabledTextColor: string;
          disabledBackgroundColor: string;
        };
        outline: {
          color: string;
          colorHover: string;
          borderColor: string;
          borderColorHover: string;
          boxShadowColor: string;
          boxShadowColorHover: string;
          disabledTextColor: string;
          disabledBorderColor: string;
          disabledBoxShadowColor: string;
          disabledOpacity: number;
        };
        outlineGradient: {
          color: string;
          background: string;
        };
        previewButton: {
          color: string;
          borderColor: string;
          colorHover: string;
          borderHover: string;
          backgroundHover: string;
        };
        danger: {
          color: string;
          backgroundColor: string;
          backgroundColorHover: string;
        };
        config: {
          background: string;
          boxShadow: string;
          border: string;
          color: string;
          backgroundHover: string;
          backgroundActive: string;
          colorHover: string;
          colorActive: string;
          boxShadowHover: string;
          boxShadowActive: string;
        };
        configMinimal: {
          border: string;
          borderActive: string;
          color: string;
          colorActive: string;
          iconColorActive: string;
          background: string;
          backgroundActive: string;
        };
        settings: {
          color: string;
          colorHover: string;
          background: string;
          backgroundHover: string;
        };
        short: {
          color: string;
          border: string;
          background: string;
          backgroundHover: string;
        };
        buttonColor: {
          color: string;
          subtitleColor: string;
          borderColor: string;
        };
        buttonMouse: {
          backgroundColor: string;
          backgroundColorHover: string;
          backgroundColorActive: string;
          color: string;
          colorHover: string;
          colorActive: string;
        };
        buttonLarge: {
          borderColor: string;
          borderHoverColor: string;
          backgroundColor: string;
          backgroundHoverColor: string;
          titleColor: string;
          contentColor: string;
        };
        recordButton: {
          background: string;
          backgroundHover: string;
          borderColor: string;
          borderColorResume: string;
          color: string;
        };
        navButton: {
          color: string;
          background: string;
          backgroundHover: string;
        };
      };
      colorPanel: {
        colorTitle: string;
        colorPickerBase: string;
        colorPickerBaseActive: string;
        colorPickerBorder: string;
        colorPickerBorderActive: string;
        colorPickerBorderHover: string;
        addButtonBackground: string;
        addButtonColor: string;
      };
      collpase: {
        iconBackgroud: string;
        gridItemBackground: string;
        gridItemTitle: string;
        gridItemBody: string;
        gridItemCaret: string;
      };
      callout: {
        iconInfo: string;
        iconInfoBackground: string;
        iconInfoBorder: string;
        iconInfoShadowColor: string;
        calloutColor: string;
        calloutBackground: string;
        calloutBorderColor: string;
      };
      card: {
        color: string;
        altColor: string;
        colorDisabled: string;
        background: string;
        cardTitleColor: string;
        backgroundActive: string;
        disabled: string;
        altBackground: string;
        altBackgroundActive: string;
        ballIcon: string;
        icon: string;
        altIcon: string;
        radius: string;
        boxShadow: string;
        cardBattery: {
          backgroundColor: string;
        };
        cardDevice: {
          cardBackground: string;
          cardBorder: string;
          cardBorderConnected: string;
          cardOverlayOffline: string;
          canvasOpacity: number;
          cardFooterBg: string;
          dropdownBgColor: string;
          dropdownDisabledColor: string;
          cardTitleColor: string;
          cardSubTitleColor: string;
          cardPathColor: string;
        };
      };
      cardButtons: {
        background: string;
        color: string;
        titleColor: string;
        subTitleColor: string;
        groupButtonsBackground: string;
      };
      circleLoader: {
        strokeColor: string;
      };
      customCheckbox: {
        background: string;
        borderColor: string;
        backgroundActive: string;
        borderColorActive: string;
      };
      deviceManager: {
        noDevicesBackground: string;
      };
      devicePreview: {
        raiseOn: string;
        raiseOff: string;
        defyOn: string;
        defyOff: string;
      };
      dropdown: {
        backgroundButtonColor: string;
        backgroundButtonHover: string;
        backgroundButtonActive: string;
        textButtonColor: string;
        textButtonHover: string;
        borderButtonColor: string;
        borderButtonHover: string;
        borderButtonFocus: string;
        borderButtonActive: string;
        titleColor: string;
        subTitleColor: string;
        dropdownMenu: {
          backgroundColor: string;
          boxShadow: string;
          itemTextColor: string;
          itemTextColorHover: string;
          itemBackgroundColorHover: string;
          itemBackgroundColorActive: string;
          linkColor: string;
          textColor: string;
          dropdownDivider: string;
        };
        largeDropdown: {
          background: string;
          backgroundInner: string;
          border: string;
          title: string;
          titleStrong: string;
        };
        selector: {
          numberColor: string;
          separatorColor: string;
          labelColor: string;
          color: string;
          arrowsColor: string;
        };
      };
      energyManagement: {
        connectionBGColor: string;
        connectionColor: string;
        borderColor: string;
        titleColor: string;
        descriptionColor: string;
        lowPowerModeTitleColor: string;
        shortButtonColor: string;
      };
      raiseKeyboard: {
        keyBase: string;
        keyShadow: string;
        keyColorOpacity: number;
        keyOnFocusBorder: string;
        contentColor: string;
        modifier: {
          color: string;
          background: string;
          boxShadow: string;
        };
      };
      keyPicker: {
        iconColor: string;
        titleColor: string;
        titleSpan: string;
        keyMatrixShadow: string;
        keyFill: string;
        keyFillHover: string;
        keyFillActive: string;
        keyColor: string;
        keyColorSecondary: string;
        keyColorActive: string;
        keyStrokeColor: string;
        keyStrokeColorActive: string;
      };
      keyboardPicker: {
        keyBoardPickerBackground: string;
        keyEnhanceWrapperBackground: string;
        keyEnhanceWrapperBoxShadow: string;
        keyEnhanceWrapperBorder: string;
        modPickerBackground: string;
        modPickerBoxShadow: string;
        modPickerAlignAdjust: string;
        keysRowBackground: string;
        keysRowBoxShadow: string;
      };
      keyVisualizer: {
        background: string;
        border: string;
        borderOldValue: string;
        color: string;
        colorSuperkeyAction: string;
        boxShadow: string;
        labelModifierBackground: string;
        labelModifierColor: string;
        labelBorder: string;
        labelModifierBackgroundSm: string;
        labelModifierColorSm: string;
        labelBorderSm: string;
        bgOldToNew: string;
      };
      filterHeader: {
        titleColor: string;
        borderColor: string;
        tabBackgroundColor: string;
        tabBackgroundActive: string;
        tabBackgroundHover: string;
        triggerModalColor: string;
        triggerModalHover: string;
      };
      firmwareErrorPanel: {
        textColor: string;
      };
      firmwareUpdatePanel: {
        backgroundContent: string;
        backgroundSidebar: string;
        neuronDefyWirelessImage: string;
        neuronStatusLineColor: string;
        neuronStatusLineWarning: string;
        neuronStatusLineSuccess: string;
        neuronLightMatrixWarning: string;
        neuronLightMatrixSuccess: string;
        versionInstalledTitle: string;
        nextVersionAvaliableTitle: string;
        nextVersionAvaliableBadge: string;
        versionSuccessTitle: string;
        versionSuccessBadge: string;
        badgeBorderColor: string;
        badgeBorderColorActive: string;
        iconDropodownColor: string;
        backgroundStripeColor: string;
        backgroundStripeGradientColor: string;
        caretColor: string;
        disclaimerTitle: string;
        fileSelected: string;
      };
      firmwareUpdateProcess: {
        raiseSVG: string;
        defySVG: string;
        processFooterBackground: string;
        processImageBackground: string;
        processNeuronBackground: string;
        neuronLineColor: string;
        neuronSleepingMode: string;
      };
      form: {
        formLabelTextcolor: string;
        inputColor: string;
        inputBorder: string;
        inputBorderSolid: string;
        inputBorderActive: string;
        inputBackgroundColor: string;
        inputBackgroundColorActive: string;
        inputGroupColor: string;
        inputGroupBackground: string;
        inputGroup: {
          background: string;
        };
      };
      helpMessage: {
        titleColor: string;
        titleHoverColor: string;
        textColor: string;
        textHoverColor: string;
      };
      listGroup: {
        listItem: {
          background: string;
          backgroundHover: string;
          backgroundSelected: string;
          backgroundDisabled: string;
          color: string;
          colorSelected: string;
          colorSelectedSpan: string;
          colorDisabled: string;
          colorDisabledSpan: string;
        };
      };
      macro: {
        tabCategoriesBackground: string;
        tabContentBackground: string;
        tabSpecialContentBackground: string;
        tabTile: string;
        tabSubTitle: string;
        descriptionColor: string;
        trackingBackground: string;
        timelineBackground: string;
        timelineHiddenTracking: string;
        timelineHiddenTrackingBefore: string;
        colorTitle: string;
        keyMacroMiniDashboardBackground: string;
        keyMacroMiniDashboardBorder: string;
        keyInfoBackground: string;
        keyInfoTitle: string;
        keyFunctionsBorder: string;
        keyValueColor: string;
        keyFunctionTile: string;
        previewColor: string;
        recordingMessageColor: string;
        timelineRecordTrackingBackground: string;
        timelineBarBackground: string;
        tabSaveButtonColor: string;
        tabSaveButtonBorder: string;
        specialKeyColor: string;
        timelinePointeText: string;
        recordMacroOptionsBackground: string;
        recordMacroOptionsBoxShadow: string;
        recordMacroOptionsTitle: string;
      };
      macroKey: {
        background: string;
        backgroundColorDrag: string;
        backgroundDrag: string;
        boxShadowOnDrag: string;
        color: string;
        colorModifier: string;
        backgroundHeader: string;
        backgroundHeaderModifier: string;
        borderColor: string;
        borderColorModifier: string;
        iconDragColor: string;
        iconDragColorModifier: string;
        actionIconColor: string;
        actionColorModifier: string;
        dropdownIconColor: string;
        dropdownIconColorModifier: string;
        alt: {
          background: string;
        };
        altGr: {
          background: string;
        };
        control: {
          background: string;
        };
        delay: {
          background: string;
          color: string;
          borderColor: string;
          actionIconColor: string;
        };
        os: {
          background: string;
        };
        shift: {
          background: string;
          color: string;
          actionColor: string;
        };
      };
      memoryUsage: {
        color: Tokens.colors.gray300;
        borderColor: string;
        percentageColor: string;
        progressBaseColor: string;
        progressFill: string;
        colorWarning: string;
        colorError: string;
      };
      modal: {
        closeButton;
        backdropColor: string;
        background: string;
        backgroundInner: string;
        titleColor: string;
        footerBackground: string;
        modalDevices: {
          bodyBackground: string;
          cardBackground: string;
          cardBorderColor: string;
          titleColor: string;
          subTitleColor: string;
          contentColor: string;
          dragBackground: string;
          dragIconColor: string;
        };
      };
      mouseButtons: {
        background: string;
        backgroundWheelCircle: string;
        mouseWheel: string;
      };
      navbar: {
        color: string;
        background: string;
        menuLink: {
          color: string;
          colorHover: string;
          colorActive: string;
          svgColor: string;
          svgColorActive: string;
          svgColorHover: string;
          lightingOpacity: number;
          gradient: string;
        };
      };
      neuronConnection: {
        backgroundColor: string;
        titleColor: string;
        subTitleColor: string;
      };
      neuronData: {
        neuronInfoBackground: string;
        neuronInfoBoxShadow: string;
        accordionBorder: string;
        accordionCardBackground: string;
        accordionCardBodyBackground: string;
        accordionCardHeaderColor: string;
        accordionCardHeaderBorderColor: string;
        plusOpacity: number;
      };
      neuronStatus: {
        neuronStatusBackgroundColor: string;
        lineStrokeColor: string;
        lineStrokeColorConnected: string;
        connectionSuccessFill: string;
        connectionColorMatrix: string;
        connectionColorMatrixOnLoading: string;
        neuronNotFoundedColor: string;
        connectionStrokeOpacity: number;
        neuronLoader: string;
        checkedIcon: string;
      };
      neuronStatusDefy: {
        statusWaiting: string;
      };
      neuronTitle: {
        heading3Color: string;
        heading4Color: string;
      };
      pageHeader: {
        backgroundColor: string;
        titleColor: string;
      };
      progress: {
        progressBackground: string;
        progressBarBackground: string;
        boxShadow: string;
      };
      slider: {
        trackColor: string;
        progressColor: string;
        handleBorderColor: string;
        handleBackgroundColor: string;
        handleBoxShadow: string;
        labelColor: string;
      };
      standardView: {
        modalBackground: string;
        contentBackground: string;
        footerBackground: string;
        titleColor: string;
        superkeys: {
          info: {
            background: string;
            titleColor: string;
          };
          item: {
            titleColor: string;
            descriptionColor: string;
            background: string;
            boxShadow: string;
          };
          key: {
            background: string;
            border: string;
          };
        };
        keyVisualizer: {
          background: string;
          border: string;
          boxShadow: string;
        };
      };
      stepsBar: {
        stepBarBackground: string;
        stepBarBackgroundActive: string;
        bulletIconColor: string;
        bulletBackground: string;
        bulletBackgroundActive: string;
        bulletBorder: string;
        bulletBorderActive: string;
        bulletBoxShadow: string;
        bulletBoxShadowActive: string;
      };
      stepsProgressBar: {
        stepBarBackground: string;
        backgroundActive: string;
        bulletBackground: string;
        bulletBackgroundActive: string;
        bulletBorderActive: string;
        stepBarBackgroundActive: string;
      };
      superkeyAction: {
        color: string;
        background: string;
        backgroundActive: string;
        titleColor: string;
        descriptionColor: string;
      };
      superkeyButton: {
        backgroundColor: string;
        backgroundColorHover: string;
        backgroundColorActive: string;
        border: string;
        boxShadow: string;
        boxShadowHover: string;
        backgroundColorInner: string;
        backgroundColorInnerActive: string;
        boxShadowInner: string;
        colorInner: string;
      };
      switch: {
        background: string;
        backgroundActive: string;
        thumbBackground: string;
        thumbBackgroundActive: string;
        thumbBorderColor: string;
        thumbBorderColorActive: string;
        thumbBoxShadow: string;
        thumbBoxShadowActive: string;
      };
      tab: {
        color: string;
        colorHover: string;
        colorActive: string;
        backgroundHover: string;
        backgroundActive: string;
        lightOpacity: number;
      };
      tabButton: {
        background: string;
        backgroundHover: string;
        color: string;
        colorHover: string;
        svgColor: string;
        svgHover: string;
      };
      title: {
        counterColor: string;
      };
      toast: {
        boxShadow: string;
        background: string;
        backgroundNoStatus: string;
        backgroundSuccess: string;
        backgroundDanger: string;
        backgroundWarning: string;
        defaultColorTitle: string;
        defaultColorBody: string;
        warningColorTitle: string;
        dangerColorTitle: string;
        successColorTitle: string;
      };
      toggleButton: {
        background: string;
      };
      toggleEditMode: {
        titleColor: string;
        containerBackground: string;
        containerBorder: string;
        buttonColor: Tokens.colors.gray200;
        buttonColorHover: string;
        buttonColorActive: string;
        buttonBackground: string;
        buttonBackgroundHover: string;
        buttonBackgroundActive: string;
        buttonBoxShadow: string;
      };
      virtualKeyboard: {
        cardButtonDivider: string;
        cardButtonBackground: string;
        cardBorder: string;
        cardBackground: string;
        iconConnectedColor: string;
        iconVirtualKBColor: string;
        iconVirtualKBBGColor: string;
        labelTextColor: string;
        cardTitleColor: string;
        cardTextColor: string;
        orBgColor: string;
        orTextColor: string;
        orLineColor: string;
      };
      wrapper: {
        background: string;
      };
    };
  }
}
