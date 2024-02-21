export type ConnnectedDeviceCommsHandler = (dataReceived: string) => void;
export type ErrorHandler = (err: Error) => void;

export interface ConnectedDeviceComms {
  sendData: (data: string, receiverHandler: ConnnectedDeviceCommsHandler, errorHandler: ErrorHandler) => Promise<void>;
  sendRawData: (data: string, receiverHandler: ConnnectedDeviceCommsHandler, errorHandler: ErrorHandler) => Promise<void>;
}
