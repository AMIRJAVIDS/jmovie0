import React from "react";

export default function NotFound() {
  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* floating orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div style={styles.card} className="card">
        <h1 style={styles.code} className="glitch" data-text="404">
          404
        </h1>

        <h2 style={styles.title}>صفحه‌ای که دنبالش بودی پیدا نشد</h2>
        <p style={styles.subtitle}>
          شاید آدرس اشتباه باشد یا این صفحه جابه‌جا شده باشد.
        </p>

        <a href="/" style={styles.btn} className="home-btn">
          بازگشت به خانه
          <span style={styles.arrow}>←</span>
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    direction: "rtl",
  },

  card: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "48px 56px",
    borderRadius: 24,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    maxWidth: 460,
  },

  code: {
    margin: 0,
    fontSize: 130,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: 4,
    color: "#fff",
    position: "relative",
  },

  title: {
    margin: "18px 0 8px",
    fontSize: 22,
    fontWeight: 700,
    color: "#f1f1f1",
  },

  subtitle: {
    margin: "0 0 28px",
    fontSize: 15,
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.7)",
  },

  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 28px",
    borderRadius: 50,
    color: "#0f0c29",
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    background: "linear-gradient(135deg, #f9d423, #ff4e50)",
    boxShadow: "0 8px 24px rgba(255,78,80,0.35)",
    transition: "transform .2s ease, box-shadow .2s ease",
  },

  arrow: { fontSize: 18, transition: "transform .2s ease" },
};

const css = `
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.6;
  z-index: 1;
  animation: float 9s ease-in-out infinite;
}
.orb1 { width: 320px; height: 320px; top: -80px; left: -60px;
  background: #ff4e50; animation-delay: 0s; }
.orb2 { width: 260px; height: 260px; bottom: -90px; right: -50px;
  background: #1fa2ff; animation-delay: 2s; }
.orb3 { width: 200px; height: 200px; top: 40%; right: 15%;
  background: #f9d423; animation-delay: 4s; }

@keyframes float {
  0%,100% { transform: translateY(0) translateX(0); }
  50%     { transform: translateY(-30px) translateX(20px); }
}

.card { animation: rise .7s ease both; }
@keyframes rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* glitch effect on 404 */
.glitch { position: relative; }
.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute; left: 0; top: 0;
  width: 100%; overflow: hidden;
}
.glitch::before {
  color: #ff4e50; left: 2px;
  clip-path: inset(0 0 55% 0);
  animation: glitchTop 2.5s infinite linear alternate;
}
.glitch::after {
  color: #1fa2ff; left: -2px;
  clip-path: inset(55% 0 0 0);
  animation: glitchBot 2.5s infinite linear alternate;
}
@keyframes glitchTop {
  0%,90%,100% { transform: translateX(0); }
  92% { transform: translateX(-4px); }
  96% { transform: translateX(4px); }
}
@keyframes glitchBot {
  0%,90%,100% { transform: translateX(0); }
  93% { transform: translateX(4px); }
  97% { transform: translateX(-4px); }
}

.home-btn:hover { transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255,78,80,0.5); }
.home-btn:hover span { transform: translateX(-4px); }
`;
