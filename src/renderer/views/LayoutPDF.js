import React from "react";
import ReactPDF, { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Layout = () => {
  const Focus = global.focus_instance;

  const renderPDF = () => {
    ReactPDF.render(<Doc />, "~/hello.pdf");
  };

  const Doc = () => (
    <Document>
      <Page size="A4">HI</Page>
    </Document>
  );

  return [renderPDF];
};

export default Layout;
