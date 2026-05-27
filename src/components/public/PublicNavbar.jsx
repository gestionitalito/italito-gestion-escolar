import { Link } from "react-router-dom";

function PublicNavbar() {
  return (
    <header className="public-navbar">
      <div className="public-logo">
        <div className="public-logo-icon">🌈</div>
        <div>
          <h1>Italito</h1>
          <p>Escuela de Párvulos</p>
        </div>
      </div>

      <nav className="public-menu">
        <Link to="/">Inicio</Link>
        <Link to="/nuestra-escuela">Nuestra Escuela</Link>
        <Link to="/pre-kinder">Pre-Kínder</Link>
        <Link to="/kinder">Kínder</Link>
        <Link to="/noticias">Noticias</Link>
        <Link to="/galeria">Galería</Link>
        <Link to="/admision">Admisión</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>

      <Link className="public-login-button" to="/gestion/login">
        Ingreso gestión
      </Link>
    </header>
  );
}

export default PublicNavbar;