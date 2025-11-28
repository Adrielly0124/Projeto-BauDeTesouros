import estilos from '../rodape/Rodape.module.css'

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className='container'>
        <p>© {new Date().getFullYear()} Baú de Tesouros · Economia circular para infância</p>
      </div>
    </footer>
  )
}
