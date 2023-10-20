import { Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import {useState, useEffect} from 'react';
import QRCode from 'qrcode';
import {icons} from '../util';


const cardTitle = ' STUDENT TUTOR ';
const [cw,ch] = [4,3];
const [iw,ih] = ['1.2in', '1.6in'];
const [companyBackground, display, borderSetting] = ['#002856', 'initial', "none"];

Font.register({family: 'Priori', src: '/zPrioriSansOT-Regular.otf'});
Font.register({family: 'Priori', fontWeight: 'bold', src: '/PrioriSansOT-Bold.otf'});
Font.register({family: 'Priori', fontWeight: 'light', src: '/PrioriSansOT-Light.otf'});
Font.register({family: 'Priori-Black', src: '/PrioriSansOT-Black.otf'});
Font.register({family: 'Aptifer-Slab', src: '/Aptifer Slab LT Pro.otf'});
Font.register({family: 'Aptifer-Slab-Black', src: '/Aptifer Slab LT Pro Black.otf'});

const styles = StyleSheet.create({  
  card: {
    border: '2pt dotted black',
    width: `${cw}in`,
    height: `${ch}in`,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  image: {
    border: borderSetting,
    objectFit: 'fill',
    width: iw,
    height: ih,    
  },
  content: {
    border: borderSetting,
    width: "90%",
    height: '80%',
    display: "flex",
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    alignItems: 'flex-end',
  },
  company: {
    border: borderSetting,
    width: '90%',
    height: '20%',
    backgroundColor: companyBackground,
  },
  department: {
    width: '60%',
    height: "50%",
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
    width: '60%',
    height: "50%",
    fontFamily: 'Priori',
    fontWeight: "light",
    fontSize: '12pt',
    paddingLeft: '4pt',
  },
  category: {
    border: borderSetting,
    width: '10%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: "#1C8AC2",
  },
  rotate: {
    width: `${1/(cardTitle.length)*ch*0.97}in`,
    height: `${1/(cardTitle.length)*ch*0.97}in`,
    fontSize: `${1/(cardTitle.length)*ch*0.8}in`,
    textAlign: "center",
    marginLeft: "20%",
    transform: 'rotate(90deg)',
    color: 'white',
    fontFamily: 'Aptifer-Slab-Black',
    border: borderSetting,
  },
  logo: {
    objectFit: 'cover',
    width: '100%',
    display: display,
    border: borderSetting,
  },
  decoration: {
    width: '40%',
    border: borderSetting,
    height: '31.5%',
    paddingTop: '2px',
  },
  subjects: {
    border: borderSetting,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '4pt',    
    justifyContent: "flex-start",
    textAlign: 'left',        
  },
  icon: {
    margin: 'auto',
    width: '50px',
    height: '50px',
  }
})

export default function IDCard ({user}) {
  /*const [qr, setQr] = useState({});

  useEffect(() => {    
    if(user.links) {
      Object.keys(user.links).forEach(link => {
        if(user.links[link]) {
          QRCode.toDataURL(user.links[link])
          .then(res => {
            const output = {};
            output[link] = res;
            setQr(prev => Object.assign(prev, output));
          })
        }
      })
    }
  }, []);*/
  
  return (    
    <View style={styles.card} wrap={false}>      
      <View style={styles.company}>
        <Image style={[styles.logo, {backgroundColor: companyBackground}]} src='src/img/MULogo-DeptCMP-White-Horiz.png'/>
      </View>
      <View style={styles.content}>
        <View style={styles.department}>
          <Image style={styles.logo} src='src/img/see anew-purpleblueword.jpg' />
        </View>
        <View style={styles.information}>
          <Text style={{fontSize: '15pt', fontFamily:"Priori-Black", fontWeight:"normal",}}>{user.name + ' (' + user.subject + ')'}</Text>
          <Text >{user.day.map((e,i) => `${e} ${user.time[i]}`)}</Text>
          <View style={styles.subjects}>
            {user.courses && user.courses.map(e => <Text key = {e} style={{width:'33%'}}>{e}</Text>)}
          </View>
          
        </View>        
        <View style={styles.profile}>
          {
            (user.profilePic && user.profilePic.transform)?
            <Image 
              style={
                [
                  styles.image, 
                  {
                    transform: user.profilePic.transform, 
                    width: ih, 
                    height: iw, 
                    marginTop: '0.2in', 
                    marginLeft: "-0.2in" 
                  }
                ]
              }
              src= {
                user.profilePic? 
                'https:' + user.profilePic.url:
                'https://images.ctfassets.net/o0mxfnwxsmg0/7wk9sXm2sQjMhg7pmyffqr/39c218f89506084b406222c6ee680905/question-mark-hacker-attack-mask-preview.jpg'
              }
            />:
            <Image 
              style={styles.image}
              src= {
                user.profilePic? 
                'https:' + user.profilePic.url:
                'https://images.ctfassets.net/o0mxfnwxsmg0/7wk9sXm2sQjMhg7pmyffqr/39c218f89506084b406222c6ee680905/question-mark-hacker-attack-mask-preview.jpg'
              }
            />
          }
          
        </View>
        <View style={styles.decoration}>
          <Image style={styles.icon} src='src/img/tutorForm.png'/>
        </View>
      </View>      
      <View style={styles.category}>{cardTitle.split("").map((e)=><Text key={e} style={styles.rotate}>{e}</Text> )}</View>
    </View> 
  )
  //<Image style={styles.icon} src = {qr[link]}/>
}