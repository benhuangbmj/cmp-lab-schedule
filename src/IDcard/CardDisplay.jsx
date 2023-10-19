import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import IDCard from './IDCard';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
})

export default function CardDisplay({ info }) {
  return (
    <Document>            
      <Page size='LETTER' style={styles.page}>
        {Object.keys(info).map(e => <IDCard key={e} user={info[e]} />)}        
      </Page>
    </Document>
  )
}