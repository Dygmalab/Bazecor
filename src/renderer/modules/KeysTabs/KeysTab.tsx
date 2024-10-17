import React from "react";
import { KeyPickerReduced } from "@Renderer/modules/KeyPickerKeyboard";
import { SegmentedKeyType } from "@Renderer/types/layout";

interface KeysTabProps {
  action: any;
  actions: any;
  keyCode: SegmentedKeyType;
  actTab: string;
  superkeyAction: number;
  selectedlanguage: string;
  kbtype: string;
  onKeyPress: (key: any) => void;
}

const KeysTab: React.FC<KeysTabProps> = ({
  action,
  actions,
  keyCode,
  actTab,
  superkeyAction,
  selectedlanguage,
  kbtype,
  onKeyPress,
}) => (
  // const appliedMod = Array(7936)
  //   .fill(null)
  //   .map((_, idx) => 256 + idx);

  <div className="tabsKey flex flex-wrap h-full">
    <div className="tabContentWrapper w-full">
      <KeyPickerReduced
        actions={actions}
        action={action}
        onKeySelect={onKeyPress}
        code={{ base: 4, modified: 0 }}
        showSelected={false}
        keyCode={keyCode}
        disableMove={false}
        disableMods={!!((superkeyAction === 0 || superkeyAction === 3) && actTab === "disabled")}
        actTab={actTab}
        superName="superName"
        selectedlanguage={selectedlanguage}
        kbtype={kbtype}
      />
    </div>
  </div>
);
export default KeysTab;
