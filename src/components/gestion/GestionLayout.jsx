import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  CalendarDays,
  UserRound,
  Home,
  Menu,
  X,
} from "lucide-react";

import { auth } from "../../firebase";

function GestionLayout({ children }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const anioGestion = localStorage.getItem("italito_anio_gestion") || "2026";

  const usuarioActual = {
    nombre: "Administrador",
    correo: "italito.admin",
    rol: "administrador",
  };

  const rolesPermitidos = ["administrador", "director", "funcionario"];
  const tieneAcceso = usuarioActual && rolesPermitidos.includes(usuarioActual.rol);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setMenuAbierto(false);
      navigate("/gestion/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión. Intenta nuevamente.");
    }
  };

  const nombreRol = {
    administrador: "Administrador",
    director: "Director",
    funcionario: "Funcionario",
    apoderado: "Apoderado",
  };

  if (!usuarioActual) {
    navigate("/gestion/login");
    return null;
  }

  if (usuarioActual.rol === "apoderado") {
    navigate("/portal-apoderado");
    return null;
  }

  if (!tieneAcceso) {
    return (
      <div className="gestion-acceso-denegado">
        <div className="acceso-denegado-card">
          <ShieldCheck size={46} />

          <h1>Acceso restringido</h1>

          <p>
            No tienes permisos para ingresar a Italito Gestión Escolar. Este
            sector está reservado para usuarios autorizados.
          </p>

          <button type="button" onClick={() => navigate("/gestion/login")}>
            Volver al ingreso
          </button>
        </div>
      </div>
    );
  }

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="gestion-shell">
      <style>{`
        .gestion-shell {
          min-height: 100vh;
          width: 100%;
          background: #f8fafc;
        }

        .gestion-header {
          position: sticky;
          top: 0;
          z-index: 50;
          min-height: 78px;
          padding: 14px 24px;
          background: rgba(255, 255, 255, 0.94);
          border-bottom: 1px solid rgba(148, 163, 184, 0.24);
          backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
          box-sizing: border-box;
        }

        .gestion-header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 230px;
        }

        .gestion-header-logo {
          width: 48px;
          height: 48px;
          border-radius: 17px;
          background: linear-gradient(135deg, #ffffff, #eff6ff);
          border: 1px solid rgba(37, 99, 235, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex: 0 0 auto;
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.12);
        }

        .gestion-header-logo img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .gestion-header-brand strong {
          display: block;
          color: #173b70;
          font-size: 15px;
          font-weight: 950;
          line-height: 1.15;
        }

        .gestion-header-brand span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 750;
          margin-top: 3px;
        }

        .gestion-header-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .gestion-nav-link {
          text-decoration: none;
          color: #334155;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.24);
          padding: 10px 13px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 900;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .gestion-nav-link:hover {
          color: #1d4ed8;
          background: #eff6ff;
          border-color: rgba(37, 99, 235, 0.25);
          transform: translateY(-1px);
        }

        .gestion-header-info {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .gestion-year-pill,
        .gestion-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.24);
          background: #f8fafc;
          padding: 9px 12px;
          color: #334155;
          white-space: nowrap;
        }

        .gestion-year-pill span {
          font-size: 11px;
          font-weight: 850;
          color: #64748b;
        }

        .gestion-year-pill strong {
          font-size: 13px;
          color: #173b70;
          font-weight: 950;
        }

        .gestion-user-pill strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          font-weight: 950;
          line-height: 1.1;
        }

        .gestion-user-pill span {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 800;
          margin-top: 2px;
        }

        .gestion-logout-btn {
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #ff6b6b, #f97316);
          color: white;
          padding: 11px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(249, 115, 22, 0.22);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .gestion-logout-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(249, 115, 22, 0.30);
        }

        .gestion-mobile-toggle {
          display: none;
          width: 44px;
          height: 44px;
          border-radius: 15px;
          border: 1px solid rgba(148, 163, 184, 0.28);
          background: #f8fafc;
          color: #173b70;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .gestion-mobile-panel {
          display: none;
        }

        .gestion-main-clean {
          width: 100%;
          min-height: calc(100vh - 78px);
          box-sizing: border-box;
        }

        .gestion-acceso-denegado {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #eff6ff, #fff7ed);
          box-sizing: border-box;
        }

        .acceso-denegado-card {
          width: 100%;
          max-width: 460px;
          background: white;
          border-radius: 28px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.16);
          border: 1px solid rgba(148, 163, 184, 0.24);
        }

        .acceso-denegado-card h1 {
          margin: 16px 0 10px;
          color: #0f172a;
          font-size: 28px;
          font-weight: 950;
        }

        .acceso-denegado-card p {
          color: #64748b;
          line-height: 1.6;
        }

        .acceso-denegado-card button {
          margin-top: 18px;
          border: none;
          border-radius: 16px;
          padding: 13px 18px;
          background: #2563eb;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 1180px) {
          .gestion-header {
            gap: 12px;
          }

          .gestion-year-pill span {
            display: none;
          }

          .gestion-user-pill {
            display: none;
          }
        }

        @media (max-width: 860px) {
          .gestion-header {
            min-height: 70px;
            padding: 11px 14px;
          }

          .gestion-header-brand {
            min-width: 0;
            flex: 1;
          }

          .gestion-header-logo {
            width: 44px;
            height: 44px;
            border-radius: 15px;
          }

          .gestion-header-logo img {
            width: 36px;
            height: 36px;
          }

          .gestion-header-brand strong {
            font-size: 14px;
          }

          .gestion-header-brand span {
            font-size: 11px;
          }

          .gestion-header-nav,
          .gestion-header-info {
            display: none;
          }

          .gestion-mobile-toggle {
            display: inline-flex;
          }

          .gestion-mobile-panel {
            display: block;
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            z-index: 45;
            background: rgba(255, 255, 255, 0.98);
            border-bottom: 1px solid rgba(148, 163, 184, 0.24);
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
            padding: 14px;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.25s ease;
            box-sizing: border-box;
          }

          .gestion-mobile-panel.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .mobile-user-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            border-radius: 20px;
            background: linear-gradient(135deg, #eff6ff, #fff7ed);
            border: 1px solid rgba(148, 163, 184, 0.22);
            margin-bottom: 12px;
          }

          .mobile-user-card strong {
            display: block;
            color: #0f172a;
            font-size: 14px;
            font-weight: 950;
          }

          .mobile-user-card span {
            display: block;
            color: #64748b;
            font-size: 12px;
            font-weight: 800;
            margin-top: 2px;
          }

          .mobile-actions {
            display: grid;
            gap: 10px;
          }

          .mobile-actions .gestion-nav-link,
          .mobile-actions .gestion-logout-btn {
            width: 100%;
            justify-content: flex-start;
            min-height: 48px;
            box-sizing: border-box;
          }

          .mobile-year-pill {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 12px 14px;
            border-radius: 16px;
            background: #f8fafc;
            border: 1px solid rgba(148, 163, 184, 0.24);
            color: #334155;
            font-size: 13px;
            font-weight: 900;
          }

          .mobile-year-pill strong {
            color: #173b70;
          }

          .gestion-main-clean {
            min-height: calc(100vh - 70px);
          }
        }

        @media (max-width: 460px) {
          .gestion-header {
            padding: 10px 12px;
          }

          .gestion-header-brand strong {
            max-width: 190px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .gestion-header-brand span {
            max-width: 190px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>

      <header className="gestion-header">
        <div className="gestion-header-brand">
          <div className="gestion-header-logo">
            <img src="/logo-italito.png" alt="Insignia Italito" />
          </div>

          <div>
            <strong>Italito Gestión Escolar</strong>
            <span>Escuela de Párvulos Italito</span>
          </div>
        </div>

        <nav className="gestion-header-nav">
          <Link to="/gestion" className="gestion-nav-link">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/" className="gestion-nav-link">
            <Home size={18} />
            Sitio público
          </Link>
        </nav>

        <div className="gestion-header-info">
          <div className="gestion-year-pill">
            <CalendarDays size={17} />
            <span>Año escolar</span>
            <strong>{anioGestion}</strong>
          </div>

          <div className="gestion-user-pill">
            <UserRound size={18} />

            <div>
              <strong>{usuarioActual.nombre}</strong>
              <span>{nombreRol[usuarioActual.rol] || "Usuario"}</span>
            </div>
          </div>

          <button
            type="button"
            className="gestion-logout-btn"
            onClick={cerrarSesion}
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>

        <button
          type="button"
          className="gestion-mobile-toggle"
          onClick={() => setMenuAbierto((prev) => !prev)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          {menuAbierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className={`gestion-mobile-panel ${menuAbierto ? "open" : ""}`}>
        <div className="mobile-user-card">
          <UserRound size={22} />

          <div>
            <strong>{usuarioActual.nombre}</strong>
            <span>{nombreRol[usuarioActual.rol] || "Usuario"}</span>
          </div>
        </div>

        <div className="mobile-actions">
          <div className="mobile-year-pill">
            <CalendarDays size={17} />
            Año escolar <strong>{anioGestion}</strong>
          </div>

          <Link to="/gestion" className="gestion-nav-link" onClick={cerrarMenu}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/" className="gestion-nav-link" onClick={cerrarMenu}>
            <Home size={18} />
            Sitio público
          </Link>

          <button
            type="button"
            className="gestion-logout-btn"
            onClick={cerrarSesion}
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>

      <main className="gestion-main-clean">{children}</main>
    </div>
  );
}

export default GestionLayout;