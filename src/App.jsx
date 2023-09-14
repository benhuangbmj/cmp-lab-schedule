import './App.css'

export default function App() {
  function test() {
    console.log(import.meta.env.VITE_TEST);
    return ([<p key='1'>test</p>, <p key='2'>another</p>])
  };
  return (
    <main>
      React ⚛️ + Vite ⚡ + Replit 🌀
      {test()}
    </main>
  )
}
