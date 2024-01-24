/* bazecor-flash-raise -- Dygma Raise flash helper for Bazecor
 * Copyright (C) 2019, 2020  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

import async from "async";
import Focus from "../../focus";
import { decodeHexLine } from "../decodeHexLine";

const MAX_MS = 2000;

const PACKET_SIZE = 4096;

const TYPE_DAT = 0x00;
const TYPE_ESA = 0x02;
const TYPE_ELA = 0x04;

const focus = new Focus();

/**
 * Writes data to the given bootloader serial port.
 * example of buffer
 * [[Int8Array]]: Int8Array(4096) [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -128, -127, -126, -125, -124, -123, -122, -121, -120, -119, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, …]
 * [[Int16Array]]: Int16Array(2048) [12335, 12849, 13363, 13877, 14391, 14905, 15419, 15933, 27199, 27755, 28269, 28783, 29297, 29811, 30325, 30839, 31353, 31867, 32381, -32641, -32127, -31613, -31099, -30585, -119, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 257, 257, 257, 257, 257, 257, 513, 514, 514, 514, 770, 771, 771, 771, 1028, 1028, 1284, 1285, 1541, 1542, 1798, 1799, 2055, 2056, 2313, 2569, 2570, 2827, 3083, 3340, 3341, …]
 * [[Int32Array]]: Int32Array(1024) [842084399, 909456435, 976828471, 1044200507, 1818978879, 1886350957, 1953722993, 2021095029, 2088467065, -2139128195, -2071756159, -2004384123, 65417, 0, 0, 0, 0, 0, 0, 16842752, 16843009, 16843009, 33620225, 33686018, 50463234, 50529027, 67371779, 84149252, 100992261, 117835270, 134678279, 151586824, 168430089, 202050315, 218959116, 252644878, 286330896, 320016914, 353702932, 404166166, …]
 * [[Uint8Array]]: Uint8Array(4096) [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, …]
 * @param {array} buffer - Arrays of data, that will write to bootloader
 * @param {function} cb - An optional callback to run once all the functions have completed.
 */
function write_cb(buffer, cb) {
  const buf = new Uint8Array(buffer);

  // the MAX transmission of a serial write is 200 bytes, we therefore
  // marshall the given buffer into 200 byte chunks, and serialise their execution.
  const send = [];

  let total = buf.length;

  let bufferTotal = 0;

  while (bufferTotal < buf.length) {
    const bufferSize = total < 200 ? total : 200;

    // closure to ensure our buffer is local.
    (buf2send => {
      send.push(callback => {
        if (focus._port.write(Buffer.from(buf2send))) {
          callback(null);
        } else {
          callback(true, "write");
        }
      });
    })(buffer.slice(bufferTotal, bufferTotal + bufferSize));

    bufferTotal += bufferSize;
    total -= bufferSize;
  }

  // execute!
  async.series(send, (err, result) => {
    cb(err);
    console.log(result);
  });
}

/**
 * Waits until all output data is transmitted to the serial port.
 * @param {function} callback - An optional callback to run once all the functions have completed.
 */
async function read_cb(callback) {
  let time = 0;

  const timeout = function () {
    setTimeout(() => {
      time += 50;
      focus._port.drain(err => {
        if (err) {
          if (time > MAX_MS) {
            callback(true, "TIMED OUT");
          }
          timeout();
        } else {
          callback(null, "drain");
        }
      });
    }, 50);
  };
  timeout();
}

/**
 * Closes the connection to the bootloader.
 * @param {function} cb - An optional callback to run once all the functions have completed.
 */
async function disconnect_cb(cb) {
  await focus.close();
  cb(null, "");
}

function padToN(number, numberToPad) {
  let str = "";

  for (let i = 0; i < numberToPad; i++) str += "0";

  return (str + number).slice(-numberToPad);
}

function num2hexstr(number, paddedTo) {
  return padToN(number.toString(16), paddedTo);
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length); // 2 bytes for each char
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i) & 0xff;
  }
  return buf;
}

/**
 * Object NRf52833 with flash method.
 *
 *
 * The new command structure developed y Ota fejfar for the NRf52833 Bootloader
 *
 * Erase 1:          E[addr]#   - Will erase the memory from the address to the end of the available memory
 * Erase 2:          E[addr],[size]#  - (optional) Will erase the size of the memory
 * Upload data:  U[size]#             - The size of incoming data to be stored in the internal temp buffer
 * Data:              [data]                 - The data of size specified in the previous 'S' command
 * Write data:    W[addr],[size]#  - Move the data in the flash memory
 * CRC check:   C[addr],[size],[crc]#  -  Check the uploaded firmware
 * Start app:       S#                       - Start the application
 *
 */
const NRf52833 = {
  flash: (lines, stateUpdate, finished) => {
    const func_array = [];

    // let fileData = fs.readFileSync(firmware, { encoding: "utf8" });
    // fileData = fileData.replace(/(?:\r\n|\r|\n)/g, "");

    // var lines = fileData.split(":");
    // lines.splice(0, 1);

    const dataObjects = [];
    let total = 0;
    let segment = 0;
    let linear = 0;
    const auxData = [];

    for (var i = 0; i < lines.length; i++) {
      const hex = decodeHexLine(lines[i]);

      if (hex.type == TYPE_ESA) {
        segment = parseInt(hex.str.substr(8, hex.len * 2), 16) * 16;
        linear = 0;
        continue;
      }

      if (hex.type == TYPE_ELA) {
        linear = parseInt(hex.str.substr(8, hex.len * 2), 16) * 65536;
        segment = 0;
        continue;
      }

      // let aux = hex.address;

      if (hex.type == TYPE_DAT) {
        total += hex.len;
        if (segment > 0) hex.address += segment;
        if (linear > 0) hex.address += linear;
        auxData.push(hex.data);
        dataObjects.push(hex);
      }
      //   console.log(num2hexstr(segment, 8), linear, num2hexstr(aux), num2hexstr(hex.address));
    }
    const totalSaved = total;
    let hexCount = 0;
    let { address } = dataObjects[0];

    //ERASE device
    func_array.push(function (callback) {
      //Max addres of firmware program  is 0x00072000
      write_cb(str2ab(`E${num2hexstr(dataObjects[0].address, 8)},${num2hexstr(0x00072000-dataObjects[0].address, 8)}#`), callback);
    });
    func_array.push(callback => {
      read_cb(callback);
    });

    var state = 1,
      stateT = 50;
    while (total > 0) {
      let bufferSize = total < PACKET_SIZE ? total : PACKET_SIZE;

      let buffer = new ArrayBuffer(bufferSize);

      let bufferTotal = 0;

      while (bufferTotal < bufferSize) {
        const currentHex = dataObjects[hexCount];

        if (bufferSize - currentHex.len < bufferTotal) {
          // break early, we cannot completely fill the buffer.
          bufferSize = bufferTotal;
          const t = buffer.slice(0, bufferTotal);
          buffer = t;
          break;
        }

        new Uint8Array(buffer, bufferTotal, currentHex.len).set(currentHex.data);

        hexCount++;
        bufferTotal += currentHex.len;
      }

      // Closure to make sure we localise variables
      (function (localAddress, localBufferSize, localBuffer) {
        //tell the NRf52833 the size of data being sent.
        func_array.push(function (callback) {
          write_cb(str2ab("U" + num2hexstr(localBufferSize, 8) + "#"), callback);
        });

        //write our data.
        func_array.push(function (callback) {
          write_cb(localBuffer, callback);
        });

        //copy N bytes to memory location Y -> W function.
        func_array.push(function (callback) {
          write_cb(str2ab("W" + num2hexstr(localAddress, 8) + "," + num2hexstr(localBufferSize, 8) + "#"), callback);
        });

        //wait for ACK
        func_array.push(function (callback) {
          stateUpdate("neuron", (state / stateT) * 100);
          state++;
          read_cb(callback);
        });
      })(address, bufferSize, buffer, state);
      total -= bufferSize;
      address += bufferSize;
    }
    // TODO: CRC CHECK
    // var crc = crc32("CRC-32", auxData);
    // func_array.push(function (callback) {
    //   write_cb(str2ab(`C${dataObjects[0].address},${totalSaved},${crc}#`), callback);
    // });

    // //wait for ACK
    // func_array.push(function (callback) {
    //   read_cb(callback);
    // });

    // START APPLICATION
    func_array.push(callback => {
      write_cb(str2ab("S#"), callback);
    });

    // wait for ACK
    func_array.push(callback => {
      read_cb(callback);
    });

    // DISCONNECT
    func_array.push(callback => {
      disconnect_cb(callback);
    });

    // execute our functions in series!
    async.series(func_array, (err, results) => {
      if (err) finished(true, results);
      else finished(false, "");
    });
  },
};

export default NRf52833;
