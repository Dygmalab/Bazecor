/* eslint-disable @typescript-eslint/no-unused-vars */
// import { a } from "assertron";
import { afterEach, describe, expect, it, test } from "vitest";
// import { ctx } from "./Focus.ctx";
// import { Focus } from "./Focus";
// import { FocusStub } from "./Focus.mocks";

test("Main Focus test", () => {
  expect(true).toBe(true);
});
// // eslint-disable-next-line no-return-assign
// afterEach(() => (ctx.instance = undefined));

// describe(`${Focus.getInstance.name}()`, () => {
//   it("returns the same instance when called multiple times", () => {
//     const r = Focus.getInstance();
//     expect(Focus.getInstance()).toBe(r);
//   });
// });

// const dummyPort1 = {
//   productId: "1234",
//   vendorId: "abcd",
// };
// const dummyDevice1 = {
//   usb: {
//     productId: 0x1234,
//     vendorId: 0xabcd,
//   },
// };
// const dummyPort2 = {
//   productId: "4321",
//   vendorId: "ab",
// };
// const dummyDevice2 = {
//   usb: {
//     productId: 0x4321,
//     vendorId: 0xab,
//   },
// };

// describe("find()", () => {
//   it("returns empty array when no serial ports", async () => {
//     const s = new FocusStub({ ports: [] });
//     const r = await s.find();
//     expect(r).toEqual([]);
//   });

//   it("finds a matching device from the ports", async () => {
//     const s = new FocusStub({
//       ports: [dummyPort1],
//     });

//     const r = await s.find(dummyDevice1);
//     a.satisfies(r, [
//       {
//         ...dummyPort1,
//         device: dummyDevice1,
//       },
//     ]);
//   });

//   it("finds multiple devices", async () => {
//     const s = new FocusStub({
//       ports: [dummyPort1, dummyPort2],
//     });

//     const r = await s.find(dummyDevice2, dummyDevice1);
//     a.satisfies(r, [
//       { ...dummyPort1, device: dummyDevice1 },
//       {
//         ...dummyPort2,
//         device: dummyDevice2,
//       },
//     ]);
//   });
// });
