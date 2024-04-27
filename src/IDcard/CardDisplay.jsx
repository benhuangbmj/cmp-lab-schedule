import { PDFViewer, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { useState, useRef, useEffect } from "react";
import IDCard from "./IDCard";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignContent: "space-around",
  },
});

export default function CardDisplay({
  pageSize,
  info,
  pageOrientation,
  toolbar = false,
}) {
  const [rerender, setRerender] = useState(0);
  const canvas = useRef(null);
  return (
    <>
      <canvas
        ref={canvas}
        style={{ display: "none" }}
        width="429"
        height="167"
      ></canvas>
      <PDFViewer
        width="100%"
        height="100%"
        showToolbar={toolbar}
        children={
          <Document>
            <Page
              size={pageSize}
              orientation={pageOrientation}
              style={styles.page}
            >
              {Object.keys(info).map(
                (e) =>
                  !info[e].inactive && (
                    <IDCard
                      key={e}
                      user={info[e]}
                      setRerender={setRerender}
                      canvas={canvas}
                    />
                  ),
              )}
            </Page>
          </Document>
        }
      ></PDFViewer>
    </>
  );
}
