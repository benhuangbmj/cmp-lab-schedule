import { Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import { icons, makeLogo } from "../utils";

const cardTitle = " STUDENT TUTOR ";
const [cw, ch] = [4, 3];
const [iw, ih] = ["0.96in", "1.28in"];
const [companyBackground, display, borderSetting] = [
  "#002856",
  "initial",
  "none",
];

Font.register({ family: "Priori", src: "/zPrioriSansOT-Regular.otf" });
Font.register({
  family: "Priori",
  fontWeight: "bold",
  src: "/PrioriSansOT-Bold.otf",
});
Font.register({
  family: "Priori",
  fontWeight: "light",
  src: "/PrioriSansOT-Light.otf",
});
Font.register({
  family: "Priori-Black",
  fontWeight: "normal",
  src: "/PrioriSansOT-Black.otf",
});
Font.register({ family: "Aptifer-Slab", src: "/Aptifer Slab LT Pro.otf" });
Font.register({
  family: "Aptifer-Slab-Black",
  src: "/Aptifer Slab LT Pro Black.otf",
});

export default function IDCard({ user, canvas, reversed }) {
  const [qr, setQr] = useState([]);
  const [logo, setLogo] = useState();

  user = useMemo(() => Object.assign({}, user), []);
  if (reversed) {
    user.courses = useMemo(() => user.courses.toReversed(), []);
  }

  const toAdjustMargin =
    user.profilePic &&
    user.profilePic.transform &&
    Number(user.profilePic.transform.match(/\d+/g)[0]) % 180 != 0;

  const styles = StyleSheet.create({
    card: {
      border: "2pt dotted black",
      width: `${cw}in`,
      height: `${ch}in`,
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
    },
    image: {
      border: borderSetting,
      objectFit: "cover",
      transform:
        user.profilePic && user.profilePic.transform
          ? user.profilePic.transform
          : "rotate(0deg)",
      width: toAdjustMargin ? ih : iw,
      height: toAdjustMargin ? iw : ih,
      marginTop: toAdjustMargin ? "0.16in" : null,
      marginLeft: toAdjustMargin ? "-0.16in" : null,
    },
    content: {
      border: borderSetting,
      width: "90%",
      height: "80%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignContent: "space-between",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    company: {
      border: borderSetting,
      width: "90%",
      height: "20%",
      backgroundColor: companyBackground,
    },
    logoContainer: {
      width: "2.6in",
      height: "25%",
      border: borderSetting,
    },
    profile: {
      border: borderSetting,
      width: iw,
      height: ih,
    },
    information: {
      boxSizing: "border-box",
      border: borderSetting,
      width: "2.6in",
      fontFamily: "Priori",
      fontWeight: "bold",
      fontSize: "10pt",
      paddingLeft: "2px",
    },
    category: {
      border: borderSetting,
      width: "10%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      backgroundColor: "#1C8AC2",
    },
    rotate: {
      width: `${(1 / cardTitle.length) * ch * 0.97}in`,
      height: `${(1 / cardTitle.length) * ch * 0.97}in`,
      fontSize: `${(1 / cardTitle.length) * ch * 0.8}in`,
      textAlign: "center",
      marginLeft: "20%",
      transform: "rotate(90deg)",
      color: "white",
      fontFamily: "Aptifer-Slab-Black",
      border: borderSetting,
    },
    logo: {
      objectFit: "contain",
      display: display,
      border: borderSetting,
    },
    brand: {
      objectFit: "cover",
      display: display,
      border: borderSetting,
    },
    decoration: {
      width: "0.96in",
      border: borderSetting,
      height: "31.5%",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      alignContent: "flex-end",
      fontSize: "10pt",
      fontFamily: "Priori",
      fontWeight: "light",
    },
    subjects: {
      border: borderSetting,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      textAlign: "left",
      maxHeight: ".415in",
      overflow: "hidden",
      marginTop: "5pt",
    },
    icon: {
      width: "0.6in",
      height: "0.6in",
    },
    social: {
      border: borderSetting,
      width: "2.6in",
      height: "35%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      justifyContent: "space-around",
      alignContent: "space-between",
      overflow: "hidden",
    },
    QR: {
      width: ".55in",
      height: ".55in",
      margin: "auto",
    },
    socialIcon: {
      width: "0.3in",
      height: "0.3in",
      ObjectFit: "contain",
      margin: "auto",
    },
  });

  useEffect(() => {
    if (user.links) {
      Object.keys(user.links).forEach((link) => {
        if (user.links[link] != null && user.links[link] != "") {
          QRCode.toDataURL(user.links[link]).then((res) => {
            const output = {};
            output[link] = res;
            setQr((state) =>
              reversed
                ? Object.entries(output).concat(state)
                : state.concat(Object.entries(output)),
            );
          });
        }
      });
    }

    makeLogo(canvas, setLogo);
  }, []);

  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.company}>
        <Image
          style={[styles.brand, { backgroundColor: companyBackground }]}
          src="src/img/MULogo-DeptCMP-White-Horiz.png"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {logo && <Image style={styles.logo} src={logo} />}
        </View>
        <View style={styles.social}>
          {qr.length > 0 &&
            qr.map(([link, code]) => {
              return (
                <View
                  key={link}
                  style={{ border: borderSetting, width: "33.3%" }}
                >
                  <Image style={styles.socialIcon} src={icons[link]} />
                  <Image style={styles.QR} src={code} />
                </View>
              );
            })}
        </View>
        <View style={styles.information}>
          <Text
            style={{
              fontSize: "15pt",
              fontFamily: "Priori-Black",
            }}
          >
            {user.name + " (" + user.subject + ")"}
          </Text>
          <View style={styles.subjects}>
            {user.courses &&
              user.courses.map((e) => (
                <Text key={e} style={{ width: "33%" }}>
                  {e}
                </Text>
              ))}
          </View>
        </View>
        <View style={styles.profile}>
          <Image
            style={styles.image}
            src={
              user.profilePic && user.profilePic.url
                ? "https:" + user.profilePic.url
                : "https://www.messiah.edu/images/stained_glass_circle1_multicolor.jpg"
            }
          />
        </View>
        <View style={styles.decoration}>
          <Text style={{ width: "100%", paddingRight: "2px" }}>
            Please scan the QR code below to sign in for tutoring
          </Text>
          <Image style={styles.icon} src="src/img/tutorForm.png" />
        </View>
      </View>
      <View style={styles.category}>
        {cardTitle.split("").map((e) => (
          <Text key={e} style={styles.rotate}>
            {e}
          </Text>
        ))}
      </View>
    </View>
  );
}
