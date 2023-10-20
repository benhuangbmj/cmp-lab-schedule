import { PDFViewer, Page, Document, StyleSheet } from '@react-pdf/renderer';
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

export default function CardDisplay({ pageSize, info, pageOrientation, toolbar=false }) {
  return (
    <PDFViewer
      width='100%'
      height='100%'
      showToolbar={toolbar}
      children={
        <Document>
          <Page size={pageSize} orientation={pageOrientation} style={styles.page}>
            {Object.keys(info).map(e => <IDCard key={e} user={info[e]} />)}
          </Page>
        </Document>} >
    </PDFViewer>
  )
}