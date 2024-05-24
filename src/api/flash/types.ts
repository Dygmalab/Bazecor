export interface InfoType {
  bldr_info_header_t: {
    device_id: string;
    bldr_version: string /* The version of the bootloader representing the structure of the InfoAction and communication protocol */;
  };
  /* Versions */
  seal_version: number /* The version of the Seal */;
  hw_version: number /* The version of the hardware */;
  fw_version: string /* The current firmware version */;
  /* Flash info */
  flash_start: number /* The flash address of the available memory space */;
  program_space_start: number /* The flash address of the main application */;
  seal_address: number /* The flash address of the Validation / Seal Header */;
  flash_size: number /* The flash size reserved for the main application */;
  erase_alignment: number /* The minimum aligned size for the erase operation */;
  write_alignment: number /* The minimum aligned size for the write operation */;
  max_data_length: number /* Maximum write buffer */;
}

export interface SealType {
  /* The header of the Seal */
  bldr_seal_header_t: {
    version: number /* Version of the Seal */;
    size: number /* Size of the Seal */;
    crc: number /* CRC of the Seal (computed with the crc initialized to 0) */;
  };
  /* The Seal */
  program_start: number;
  program_size: number;
  program_crc: number;
  program_version: number;
}

export interface HexType {
  str: string;
  len: number;
  address: number;
  type: number;
  data: Uint8Array;
}
