import PublicNavbar from "./PublicNavbar";

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main>{children}</main>
    </div>
  );
}

export default PublicLayout;