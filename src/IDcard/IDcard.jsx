import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
const cardTitle = ' STUDENT TUTOR ';
const [cw,ch] = [4,3];
const [iw,ih] = ['1.2in', '1.6in'];

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  card: {
    border: "1px solid black",
    boxSizing: 'border-box', 
    width: `${cw}in`,
    height: `${ch}in`,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  image: {
    position: 'absolute',
    border: "2px solid black",
    boxSizing: 'border-box',
    width: iw,
    height: ih,
    display: "none"
  },
  information: {
    border: "1px solid red",
    width: "90%",
    height: '90%',
  },
  company: {
    border: "1px solid red",
    width: '90%',
    height: '10%',
    backgroundColor: 'pink',
  },
  category: {
    border: "1px solid red",
    width: '10%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: "blue",
  },
  rotate: {
    boxSizing:'border-box',
    
    width: `${1/(cardTitle.length+.5)*ch}in`,
    height: `${1/(cardTitle.length+.5)*ch}in`,
    fontSize: `${1/(cardTitle.length+.5)*ch*0.9}in`,
    textAlign: "center",
    marginLeft: "25%",
    transform: 'rotate(90deg)',
    color: 'white'
  }
})

export default function IDcard ({info}) {
  return (
    <Document>
      <Page size='LETTER' style={styles.page}>
        {Object.keys(info).map(user => 
          <View key={user} style={styles.card} wrap={false}>
            <Image style={[styles.image, (info[user].profilePic && info[user].profilePic.transform)? {transform: info[user].profilePic.transform, width: ih, height: iw, marginTop:".2in", marginLeft:"-0.2in"}: null]} src={info[user].profilePic? 'https:' + info[user].profilePic.url : 'https://png.pngtree.com/element_our/png/20181205/question-mark-vector-icon-png_256683.jpg'}/>
            <Text style={styles.company} >Messiah University</Text>
            <Text style={styles.information}>{info[user].name + '\n' + '(' + info[user].subject + ')'}</Text>
            <View style={styles.category}>{cardTitle.split("").map((e)=><Text key={e} style={styles.rotate}>{e}</Text> )}</View>
          </View> )}
      </Page>
    </Document>
  )
}