import { PDFViewer, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { useState, useRef, useEffect } from "react";
import IDCard from "./IDCard";
import { schema } from "/src/utils";

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
  profile = false,
}) {
  const canvas = useRef(null);
  const [infoTwoSided, setInfoTwoSided] = useState();
  useEffect(() => {
    if (!info) {
      setInfoTwoSided(null);
    } else {
      if (!profile) {
        const users = Object.keys(info).filter((user) => !info[user].inactive);
        const infoLen = users.length;
        const infoTwoSided = [];
        for (let j = 0; j < Math.ceil(infoLen / 6); j++) {
          for (let i = 6 * j; i < 6 * (j + 1); i++) {
            if (i < infoLen) infoTwoSided.push(info[users[i]]);
            else infoTwoSided.push(schema);
          }
          for (let k = 0; k < 3; k++) {
            for (let i = 6 * j + 2 * k + 1; i >= 6 * j + 2 * k; i--) {
              if (i < infoLen) {
                infoTwoSided.push(info[users[i]]);
              } else infoTwoSided.push(schema);
            }
          }
        }
        setInfoTwoSided(infoTwoSided);
      } else {
        setInfoTwoSided(Object.values(info).concat(Object.values(info)));
      }
    }
  }, [info]);

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
              {infoTwoSided &&
                infoTwoSided.map((user, i) => (
                  <IDCard
                    key={`${JSON.stringify(user)} ${i}`}
                    user={user}
                    canvas={canvas}
                    reversed={profile ? i % 2 == 1 : Math.floor(i / 6) % 2 == 1}
                  />
                ))}
            </Page>
          </Document>
        }
      ></PDFViewer>
    </>
  );
}
