import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: 24 }}>
        <h1>Resenity</h1>
        <p>Homepage scaffold is live.</p>
      </main>
      <Footer />
    </>
  );
}
