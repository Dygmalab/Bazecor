class GlobalRecording {
  private static instance: GlobalRecording;

  private static value: boolean;

  private constructor() {
    GlobalRecording.value = false;
  }

  public static getInstance() {
    if (!GlobalRecording.instance) {
      GlobalRecording.instance = new GlobalRecording();
    }
    return GlobalRecording.instance;
  }

  public setRecording(newValue: boolean) {
    GlobalRecording.value = newValue;
  }

  public getRecording() {
    return GlobalRecording.value;
  }
}

export default GlobalRecording;
