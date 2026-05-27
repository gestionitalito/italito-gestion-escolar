import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  GraduationCap,
  FileText,
  UsersRound,
} from "lucide-react";

import { auth } from "../../firebase";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const ingresarSistema = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo.trim() || !password.trim()) {
      setError("Debes ingresar correo electrónico y contraseña.");
      return;
    }

    try {
      setCargando(true);

      await signInWithEmailAndPassword(auth, correo.trim(), password);

      navigate("/gestion/dashboard", { replace: true });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      if (err.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/user-not-found") {
        setError("No existe un usuario registrado con ese correo.");
      } else if (err.code === "auth/wrong-password") {
        setError("La contraseña ingresada no es correcta.");
      } else if (err.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else {
        setError("No se pudo iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          background:
            radial-gradient(circle at 10% 15%, rgba(59, 130, 246, 0.16), transparent 30%),
            radial-gradient(circle at 90% 20%, rgba(249, 115, 22, 0.12), transparent 28%),
            linear-gradient(135deg, #f8fafc 0%, #eef6ff 45%, #fff7ed 100%);
          color: #0f172a;
          overflow: hidden;
        }

        .login-panel {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 42px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.24);
          border-radius: 34px;
          padding: 34px;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16);
          backdrop-filter: blur(18px);
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .login-logo-box {
          width: 78px;
          height: 78px;
          border-radius: 24px;
          background: linear-gradient(135deg, #ffffff, #eff6ff);
          border: 1px solid rgba(37, 99, 235, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 34px rgba(37, 99, 235, 0.14);
          overflow: hidden;
          flex: 0 0 auto;
        }

        .login-logo-box img {
          width: 66px;
          height: 66px;
          object-fit: contain;
        }

        .login-brand h1 {
          margin: 0;
          font-size: 31px;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #173b70;
          font-weight: 950;
        }

        .login-brand p {
          margin: 7px 0 0;
          color: #2563eb;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .login-intro {
          margin-bottom: 26px;
        }

        .login-intro span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 14px;
        }

        .login-intro h2 {
          margin: 0;
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: -0.05em;
          font-weight: 950;
          color: #0f274f;
        }

        .login-intro p {
          margin: 14px 0 0;
          font-size: 14.5px;
          line-height: 1.65;
          color: #52637a;
          font-weight: 650;
        }

        .login-form {
          display: grid;
          gap: 16px;
        }

        .login-field {
          display: grid;
          gap: 8px;
        }

        .login-field label {
          font-size: 13px;
          color: #173b70;
          font-weight: 900;
        }

        .input-wrap {
          position: relative;
        }

        .input-wrap svg {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .input-wrap input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: #f8fafc;
          color: #0f172a;
          border-radius: 17px;
          padding: 14px 14px 14px 46px;
          font-size: 14px;
          font-weight: 700;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-wrap input:focus {
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .login-error {
          padding: 13px 14px;
          border-radius: 16px;
          background: #fff1f2;
          color: #be123c;
          border: 1px solid rgba(244, 63, 94, 0.24);
          font-size: 13px;
          font-weight: 850;
        }

        .login-submit {
          border: none;
          border-radius: 18px;
          padding: 15px 18px;
          margin-top: 4px;
          background: linear-gradient(135deg, #ff6b6b 0%, #f97316 100%);
          color: white;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 18px 38px rgba(249, 115, 22, 0.25);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 22px 46px rgba(249, 115, 22, 0.32);
        }

        .login-submit:disabled {
          opacity: 0.74;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-footer {
          margin-top: 22px;
          display: flex;
          justify-content: center;
        }

        .login-footer a {
          color: #2563eb;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .login-visual {
          min-height: 100vh;
          position: relative;
          padding: 56px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .visual-card {
          width: 100%;
          max-width: 760px;
          min-height: 650px;
          border-radius: 42px;
          padding: 44px;
          box-sizing: border-box;
          color: white;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.24), transparent 26%),
            linear-gradient(135deg, #0f274f 0%, #1d4ed8 52%, #38bdf8 100%);
          box-shadow: 0 34px 90px rgba(15, 23, 42, 0.24);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .visual-card::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          right: -150px;
          top: -150px;
        }

        .visual-card::after {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.24);
          left: -140px;
          bottom: -160px;
        }

        .visual-content {
          position: relative;
          z-index: 1;
        }

        .foundation-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          font-weight: 850;
          margin-bottom: 24px;
        }

        .visual-content h3 {
          margin: 0;
          max-width: 620px;
          font-size: 48px;
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .visual-content p {
          max-width: 590px;
          margin: 20px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 16px;
          line-height: 1.7;
          font-weight: 650;
        }

        .visual-illustration {
          position: relative;
          z-index: 1;
          margin: 36px 0;
          min-height: 210px;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          font-size: 48px;
          backdrop-filter: blur(10px);
        }

        .visual-illustration span {
          filter: drop-shadow(0 12px 18px rgba(15, 23, 42, 0.20));
        }

        .visual-features {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .feature-card {
          padding: 16px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(10px);
        }

        .feature-card svg {
          margin-bottom: 10px;
          color: #ffffff;
        }

        .feature-card strong {
          display: block;
          font-size: 14px;
          font-weight: 950;
          margin-bottom: 5px;
        }

        .feature-card span {
          display: block;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12.5px;
          line-height: 1.4;
          font-weight: 650;
        }

        @media (max-width: 980px) {
          .login-page {
            grid-template-columns: 1fr;
            overflow: auto;
          }

          .login-panel {
            min-height: auto;
            padding: 28px 20px;
          }

          .login-card {
            max-width: 560px;
            padding: 28px;
          }

          .login-visual {
            min-height: auto;
            padding: 0 20px 28px;
          }

          .visual-card {
            min-height: auto;
            padding: 30px;
            border-radius: 30px;
          }

          .visual-content h3 {
            font-size: 34px;
          }

          .visual-illustration {
            min-height: 150px;
            font-size: 38px;
          }

          .visual-features {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .login-brand {
            align-items: flex-start;
          }

          .login-logo-box {
            width: 66px;
            height: 66px;
            border-radius: 20px;
          }

          .login-logo-box img {
            width: 56px;
            height: 56px;
          }

          .login-brand h1 {
            font-size: 27px;
          }

          .login-intro h2 {
            font-size: 28px;
          }

          .visual-illustration {
            gap: 10px;
            font-size: 30px;
          }
        }
      `}</style>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-logo-box">
              <img src="/logo-italito.png" alt="Insignia Italito" />
            </div>

            <div>
              <h1>Italito</h1>
              <p>Gestión Escolar</p>
            </div>
          </div>

          <div className="login-intro">
            <span>
              <ShieldCheck size={15} />
              Acceso privado
            </span>

            <h2>Ingreso al sistema interno</h2>

            <p>
              Plataforma para la gestión escolar de alumnos, apoderados,
              certificados, informes al hogar e historial documental.
            </p>
          </div>

          <form className="login-form" onSubmit={ingresarSistema}>
            <div className="login-field">
              <label htmlFor="correo">Correo electrónico</label>
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  id="correo"
                  type="email"
                  placeholder="usuario@italito.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="login-submit" type="submit" disabled={cargando}>
              {cargando ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Ingresando...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Ingresar a Italito Gestión
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/">
              <ArrowLeft size={16} />
              Volver al sitio público
            </Link>
          </div>
        </div>
      </section>

      <section className="login-visual">
        <div className="visual-card">
          <div className="visual-content">
            <div className="foundation-pill">
              <ShieldCheck size={16} />
              Fundación Educacional Julio Inocencio Alvear
            </div>

            <h3>Escuela de Párvulos Italito</h3>

            <p>
              Sistema interno diseñado para ordenar la información escolar de
              Pre-Kínder y Kínder de manera simple, segura y profesional.
            </p>
          </div>

          <div className="visual-illustration">
            <span>☀️</span>
            <span>🌈</span>
            <span>🏫</span>
            <span>👧</span>
            <span>👦</span>
          </div>

          <div className="visual-features">
            <div className="feature-card">
              <GraduationCap size={22} />
              <strong>Alumnos</strong>
              <span>Base escolar, matrícula, salud e historial.</span>
            </div>

            <div className="feature-card">
              <UsersRound size={22} />
              <strong>Apoderados</strong>
              <span>Contactos, autorizaciones y vinculación.</span>
            </div>

            <div className="feature-card">
              <FileText size={22} />
              <strong>Documentos</strong>
              <span>Certificados, informes y registros institucionales.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;