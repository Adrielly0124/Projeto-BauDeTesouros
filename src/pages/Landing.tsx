import React from "react"
import "../styles/landing.css"
import logo from "../assets/logo.png"   // ajuste o nome real

export default function Landing() {
  return (
    <div className="landing-shell">
      <div className="landing-card">
        <img src={logo} alt="Baú de Tesouros" className="landing-logo" />

        <a href="/login"><button className="landing-btn-primary">ENTRAR</button></a>
        <a href="/cadastro"><button className="landing-btn-secondary">CADASTRE-SE</button></a>
      </div>
    </div>
  )
}





