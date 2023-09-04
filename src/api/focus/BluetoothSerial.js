// -*- mode: js-jsx -*-
/* Bazecor -- Dygma's devices configurator
 * Copyright (C) 2018-2023 Dygmalab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default class BluetoothTerminal {
  /**
   * Create preconfigured Bluetooth Terminal instance.
   *
   * @param {!(number|string)} [serviceUuid=0xFFE0] - Service UUID.
   * @param {!(number|string)} [characteristicUuid=0xFFE1] - Characteristic UUID.
   * @param {string} [receiveSeparator='\n'] - Receive separator.
   * @param {string} [sendSeparator='\n'] - Send separator.
   * @param {Function|undefined} [onConnected=undefined] - Listener for connected event.
   * @param {Function|undefined} [onDisconnected=undefined] - Listener for disconnected event.
   */
  constructor(
    serviceUuid = 1812,
    characteristicUuid = 1812,
    receiveSeparator = "\n",
    sendSeparator = "\n",
    onConnected = undefined,
    onDisconnected = undefined,
  ) {
    // Used private variables.
    this._receiveBuffer = ""; // Buffer containing not separated data.
    this._maxCharacteristicValueLength = 20; // Max characteristic value length.
    this._device = null; // Device object cache.
    this._characteristic = null; // Characteristic object cache.

    // Bound functions used to add and remove appropriate event handlers.
    this._boundHandleDisconnection = this._handleDisconnection.bind(this);
    this._boundHandleCharacteristicValueChanged = this._handleCharacteristicValueChanged.bind(this);

    // Configure with specified parameters.
    this.setServiceUuid(serviceUuid);
    this.setCharacteristicUuid(characteristicUuid);
    this.setReceiveSeparator(receiveSeparator);
    this.setSendSeparator(sendSeparator);
    this.setOnConnected(onConnected);
    this.setOnDisconnected(onDisconnected);
  }

  /**
   * Set number or string representing service UUID used.
   *
   * @param {!(number|string)} uuid - Service UUID.
   */
  setServiceUuid(uuid) {
    if (!Number.isInteger(uuid) && !(typeof uuid === "string" || uuid instanceof String)) {
      throw new Error("UUID type is neither a number nor a string");
    }

    if (!uuid) {
      throw new Error("UUID cannot be a null");
    }

    this._serviceUuid = uuid;
  }

  /**
   * Set number or string representing characteristic UUID used.
   *
   * @param {!(number|string)} uuid - Characteristic UUID.
   */
  setCharacteristicUuid(uuid) {
    if (!Number.isInteger(uuid) && !(typeof uuid === "string" || uuid instanceof String)) {
      throw new Error("UUID type is neither a number nor a string");
    }

    if (!uuid) {
      throw new Error("UUID cannot be a null");
    }

    this._characteristicUuid = uuid;
  }

  /**
   * Set character representing separator for data coming from the connected device, end of line for example.
   *
   * @param {string} separator - Receive separator with length equal to one character.
   */
  setReceiveSeparator(separator) {
    if (!(typeof separator === "string" || separator instanceof String)) {
      throw new Error("Separator type is not a string");
    }

    if (separator.length !== 1) {
      throw new Error("Separator length must be equal to one character");
    }

    this._receiveSeparator = separator;
  }

  /**
   * Set string representing separator for data coming to the connected device, end of line for example.
   *
   * @param {string} separator - Send separator.
   */
  setSendSeparator(separator) {
    if (!(typeof separator === "string" || separator instanceof String)) {
      throw new Error("Separator type is not a string");
    }

    if (separator.length !== 1) {
      throw new Error("Separator length must be equal to one character");
    }

    this._sendSeparator = separator;
  }

  /**
   * Set a listener to be called after a device is connected.
   *
   * @param {Function|undefined} listener - Listener for connected event.
   */
  setOnConnected(listener) {
    this._onConnected = listener;
  }

  /**
   * Set a listener to be called after a device is disconnected.
   *
   * @param {Function|undefined} listener - Listener for disconnected event.
   */
  setOnDisconnected(listener) {
    this._onDisconnected = listener;
  }

  /**
   * Launch Bluetooth device chooser and connect to the selected device.
   *
   * @returns {Promise} Promise which will be fulfilled when notifications will be started or rejected if something went
   * wrong.
   */
  connect() {
    return this._connectToDevice(this._device).then(() => {
      if (this._onConnected) {
        this._onConnected();
      }
    });
  }

  /**
   * Disconnect from the connected device.
   */
  disconnect() {
    this._disconnectFromDevice(this._device);

    if (this._characteristic) {
      this._characteristic.removeEventListener("characteristicvaluechanged", this._boundHandleCharacteristicValueChanged);
      this._characteristic = null;
    }

    this._device = null;

    if (this._onDisconnected) {
      this._onDisconnected();
    }
  }

  /**
   * Data receiving handler which called whenever the new data comes from the connected device, override it to handle
   * incoming data.
   *
   * @param {string} data - Data.
   */
  receive(data) {
    // Handle incoming data.
  }

  /**
   * Send data to the connected device.
   *
   * @param {string} data - Data.
   * @returns {Promise} Promise which will be fulfilled when data will be sent or rejected if something went wrong.
   */
  send(data) {
    // Convert data to the string using global object.
    data = String(data || "");

    // Return rejected promise immediately if data is empty.
    if (!data) {
      return Promise.reject(new Error("Data must be not empty"));
    }

    data += this._sendSeparator;

    // Split data to chunks by max characteristic value length.
    const chunks = this.constructor._splitByLength(data, this._maxCharacteristicValueLength);

    // Return rejected promise immediately if there is no connected device.
    if (!this._characteristic) {
      return Promise.reject(new Error("There is no connected device"));
    }

    // Write first chunk to the characteristic immediately.
    let promise = this._writeToCharacteristic(this._characteristic, chunks[0]);

    // Iterate over chunks if there are more than one of it.
    for (let i = 1; i < chunks.length; i += 1) {
      // Chain new promise.
      promise = promise.then(
        () =>
          new Promise((resolve, reject) => {
            // Reject promise if the device has been disconnected.
            if (!this._characteristic) {
              reject(new Error("Device has been disconnected"));
            }

            // Write chunk to the characteristic and resolve the promise.
            this._writeToCharacteristic(this._characteristic, chunks[i]).then(resolve).catch(reject);
          }),
      );
    }

    return promise;
  }

  /**
   * Get the connected device name.
   *
   * @returns {string} Device name or empty string if not connected.
   */
  getDeviceName() {
    if (!this._device) {
      return "";
    }

    return this._device.name;
  }

  /**
   * Connect to device.
   *
   * @param {object} device - Device.
   * @returns {Promise} Promise.
   * @private
   */
  _connectToDevice(device) {
    return (device ? Promise.resolve(device) : this._requestBluetoothDevice())
      .then(dev => this._connectDeviceAndCacheCharacteristic(dev))
      .then(characteristic => this._startNotifications(characteristic))
      .catch(error => {
        this._log(error);
        return Promise.reject(error);
      });
    // return this._connectDeviceAndCacheCharacteristic("D7:2C:E2:1B:7D:37"))
    //   .then(characteristic => this._startNotifications(characteristic))
    //   .catch(error => {
    //     this._log(error);
    //     return Promise.reject(error);
    //   });
  }

  /**
   * Disconnect from device.
   *
   * @param {object} device - Device.
   * @returns {undefined} Undefined.
   * @private
   */
  _disconnectFromDevice(device) {
    if (!device) {
      return;
    }

    this._log(`Disconnecting from "${device.name}" bluetooth device...`);

    device.removeEventListener("gattserverdisconnected", this._boundHandleDisconnection);

    if (!device.gatt.connected) {
      this._log(`"${device.name}" bluetooth device is already disconnected`);
      return;
    }

    device.gatt.disconnect();

    this._log(`"${device.name}" bluetooth device disconnected`);
  }

  /**
   * Request bluetooth device.
   *
   * @returns {Promise} Promise.
   * @private
   */
  async _requestBluetoothDevice() {
    this._log("Requesting bluetooth device...");
    // const options = {
    //   filters: [
    //     // { services: ["heart_rate"] },
    //     // { services: [0x1802, 0x1803] },
    //     // { services: ["c48e6067-5295-48d3-8d5c-0395f61792b1"] },
    //     { name: "Defy BLE" },
    //     // { namePrefix: "Prefix" },
    //   ],
    //   optionalServices: ["battery_service"],
    // };
    // return navigator.bluetooth.requestDevice(options).then(device => {
    //   this._log(`"${device.name}" bluetooth device selected`);

    //   this._device = device; // Remember device.
    //   this._device.addEventListener("gattserverdisconnected", this._boundHandleDisconnection);

    //   return this._device;
    // });
    let finalDevice;
    try {
      finalDevice = await navigator.bluetooth.requestDevice({
        // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true,
      });
      this._log(`> Requested ${finalDevice.name} (${finalDevice.id})`);
    } catch (error) {
      console.log("error when requesting devices", error);
    }
    const otherDevices = await this.populateBluetoothDevices();
    console.log(otherDevices);
    return finalDevice;
  }

  async populateBluetoothDevices() {
    const devicesSelect = [];
    try {
      this._log("Getting existing permitted Bluetooth devices...");
      const devices = await navigator.bluetooth.getDevices();

      this._log(`> Got ${devices.length} Bluetooth devices.`);
      for (const device of devices) {
        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.name;
        devicesSelect.push(option);
      }
      this._log("Resulting Devices: ", devicesSelect);
    } catch (error) {
      this._log(`Argh! ${error}`);
    }
    return devicesSelect;
  }

  /**
   * Connect device and cache characteristic.
   *
   * @param {object} device - Device.
   * @returns {Promise} Promise.
   * @private
   */
  _connectDeviceAndCacheCharacteristic(device) {
    // Check remembered characteristic.
    if (device.gatt.connected && this._characteristic) {
      return Promise.resolve(this._characteristic);
    }

    this._log("Connecting to GATT server...");

    return device.gatt
      .connect()
      .then(server => {
        this._log("GATT server connected", "Getting service...");

        return server.getPrimaryService(this._serviceUuid);
      })
      .then(service => {
        this._log("Service found", "Getting characteristic...");

        return service.getCharacteristic(this._characteristicUuid);
      })
      .then(characteristic => {
        this._log("Characteristic found");

        this._characteristic = characteristic; // Remember characteristic.

        return this._characteristic;
      });
  }

  /**
   * Start notifications.
   *
   * @param {object} characteristic - Characteristic.
   * @returns {Promise} Promise.
   * @private
   */
  _startNotifications(characteristic) {
    this._log("Starting notifications...");

    return characteristic.startNotifications().then(() => {
      this._log("Notifications started");

      characteristic.addEventListener("characteristicvaluechanged", this._boundHandleCharacteristicValueChanged);
    });
  }

  /**
   * Stop notifications.
   *
   * @param {object} characteristic - Characteristic.
   * @returns {Promise} Promise.
   * @private
   */
  _stopNotifications(characteristic) {
    this._log("Stopping notifications...");

    return characteristic.stopNotifications().then(() => {
      this._log("Notifications stopped");

      characteristic.removeEventListener("characteristicvaluechanged", this._boundHandleCharacteristicValueChanged);
    });
  }

  /**
   * Handle disconnection.
   *
   * @param {object} event - Event.
   * @returns {undefined} Undefined.
   * @private
   */
  _handleDisconnection(event) {
    const device = event.target;

    this._log(`"${device.name}" bluetooth device disconnected, trying to reconnect...`);

    if (this._onDisconnected) {
      this._onDisconnected();
    }

    this._connectDeviceAndCacheCharacteristic(device)
      .then(characteristic => this._startNotifications(characteristic))
      .then(() => {
        if (this._onConnected) {
          this._onConnected();
        }
      })
      .catch(error => this._log(error));
  }

  /**
   * Handle characteristic value changed.
   *
   * @param {object} event - Event.
   * @private
   */
  _handleCharacteristicValueChanged(event) {
    const value = new TextDecoder().decode(event.target.value);

    for (const c of value) {
      if (c === this._receiveSeparator) {
        const data = this._receiveBuffer.trim();
        this._receiveBuffer = "";

        if (data) {
          this.receive(data);
        }
      } else {
        this._receiveBuffer += c;
      }
    }
  }

  /**
   * Write to characteristic.
   *
   * @param {object} characteristic - Characteristic.
   * @param {string} data - Data.
   * @returns {Promise} Promise.
   * @private
   */
  _writeToCharacteristic(characteristic, data) {
    return characteristic.writeValue(new TextEncoder().encode(data));
  }

  /**
   * Log.
   *
   * @param {Array} messages - Messages.
   * @private
   */
  _log(...messages) {
    console.log(...messages); // eslint-disable-line no-console
  }

  /**
   * Split by length.
   *
   * @param {string} string - String.
   * @param {number} length - Length.
   * @returns {Array} Array.
   * @private
   */
  static _splitByLength(string, length) {
    return string.match(new RegExp(`(.|[\r\n]){1,${length}}`, "g"));
  }
}
