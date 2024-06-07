/**
 * Formats date for create name of backup file.
 * @returns {string} formate date for example "2019-07-12-19_40_56"
 */
export default function formatedDate() {
  const date = new Date();
  const firstFind = /, /gi;
  const secondFind = /:/gi;
  const formatterDate = date.toLocaleString("en-CA", { hour12: false }).replace(firstFind, "-").replace(secondFind, "_");
  return formatterDate;
}
