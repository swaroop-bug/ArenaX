import { useState } from "react";

const TEAM_SIZES = {
  "BGMI": 4,
  "Valorant": 5,
  "Free Fire": 4,
};

const WHATSAPP_LINKS = {
  "BGMI": "https://chat.whatsapp.com/HvVUQHPhx2t1C2nFiJxnOG?mode=wwt",
  "Valorant": "https://chat.whatsapp.com/IMarJKlnLjuGP1SJWKw4os?mode=wwt",
  "Free Fire": "https://chat.whatsapp.com/BRz4Xf5ZIq60SonrGSfPWd?mode=wwt",
};

const PAYMENT_INFO = {
  BGMI: {
    feeLabel: "Registration Fee: ₹400 per team",
    upiId: "9326151339@upi",
    qrImage:
      "bgmi qr.jpg", 
  },
  Valorant: {
    feeLabel: "Registration Fee: ₹500 per team",
    upiId: "9326151339@upi",
    qrImage:
      "valorant qr.jpg", 
  },
  "Free Fire": {
    feeLabel: "Registration Fee: ₹200 per team",
    upiId: "9326151339@upi",
    qrImage:
      "freefire qr.jpg",
  },
};

function App() {
  const [step, setStep] = useState("basic"); // "basic" | "players" | "success"

  const [basicForm, setBasicForm] = useState({
    teamName: "",
    collegeName: "",
    email: "",
    phone: "",
    game: "",
  });

  const [players, setPlayers] = useState([]);
  const [payment, setPayment] = useState({
    method: "upi",
    txnId: "",
    confirmed: false,
  });

  const [selectedGame, setSelectedGame] = useState("");
  const [successGame, setSuccessGame] = useState("");
  const [successLink, setSuccessLink] = useState("");

  // ---------- NAVBAR SCROLL ----------
  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ---------- BASIC FORM ----------
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBasicSubmit = (e) => {
  e.preventDefault();
  if (
    !basicForm.teamName ||
    !basicForm.collegeName ||
    !basicForm.email ||
    !basicForm.phone ||
    !basicForm.game
  ) {
    alert("Please fill all fields and select a game.");
    return;
  }

  const size = TEAM_SIZES[basicForm.game] || 4;

  // ✅ size main players + 1 substitute
  const initialPlayers = Array.from({ length: size + 1 }, (_, index) => ({
    name: "",
    ign: "",
    gameId: "",
    isSubstitute: index === size, // last one is substitute
  }));

  setPlayers(initialPlayers);
  setSelectedGame(basicForm.game);
  setStep("players");
};


  // ---------- PLAYERS FORM ----------
  const handlePlayerChange = (index, field, value) => {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlayersSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (!p.name || !p.ign || !p.gameId) {
        alert(`Please fill all details for Player ${i + 1}.`);
        return;
      }
    }

    if (!payment.txnId || !payment.confirmed) {
      alert("Please enter payment transaction ID and confirm payment.");
      return;
    }

    const link = WHATSAPP_LINKS[selectedGame] || "#";

    setSuccessGame(selectedGame);
    setSuccessLink(link);
    setStep("success");

    alert(
      `Thank you for registering for ${selectedGame}!\n\n` +
      `Make sure you join the WhatsApp group shown on the screen.`
    );
  };

  const resetAll = () => {
    setBasicForm({
      teamName: "",
      collegeName: "",
      email: "",
      phone: "",
      game: "",
    });
    setPlayers([]);
    setPayment({
      method: "upi",
      txnId: "",
      confirmed: false,
    });
    setSelectedGame("");
    setSuccessGame("");
    setSuccessLink("");
    setStep("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gameIdLabel =
    selectedGame === "Valorant"
      ? "Riot ID + #Tag (e.g. Swaroop#1234)"
      : "In-Game ID";

  return (
    <div className="page-wrapper">
      <div className="blur-bg"></div>

      <header className="navbar glass-card fade-down">
        <div className="logo">ArenaX • CSI</div>
        <nav className="nav-links">
  <button onClick={() => handleNavClick("rules")}>Rules</button>
  <button onClick={() => handleNavClick("faq")}>FAQ</button>
  <button onClick={() => handleNavClick("contact")}>Contact</button>
</nav>

      </header>

      <main className="content">
        {/* HERO SECTION */}
        <section className="hero-section fade-up">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to ArenaX</h1>
            <p className="hero-subtitle">
              The ultimate campus e-sports showdown. Register your squad and
              conquer the arena.
            </p>
          </div>

          <div className="hero-video glass-card">
  <video
    className="video-element"
    controls
    loop
    autoPlay
      // muted  // 
    playsInline
  >
    <source
      src={`${import.meta.env.BASE_URL}introvideo.mp4`}
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
</div>

        </section>
{/* FEES & PRIZE POOL SECTION */}
<section className="fees-section glass-card fade-up">
  <h2>Registration Fees & Prize Pool</h2>
  <p className="form-note">
    Register your team and compete for exciting prize pools.
  </p>

  <div className="fees-grid">
    <div className="fee-card glass-inner">
      <h3>BGMI</h3>
      <p className="fee-text">
        <strong>Registration:</strong> ₹400 / team
      </p>
      <p className="prize-text">
        <strong>Prize Pool:</strong> ₹8,000
      </p>
    </div>

    <div className="fee-card glass-inner">
      <h3>Free Fire</h3>
      <p className="fee-text">
        <strong>Registration:</strong> ₹200 / team
      </p>
      <p className="prize-text">
        <strong>Prize Pool:</strong> ₹5,000
      </p>
    </div>

    <div className="fee-card glass-inner">
      <h3>Valorant</h3>
      <p className="fee-text">
        <strong>Registration:</strong> ₹500 / team
      </p>
      <p className="prize-text">
        <strong>Prize Pool:</strong> ₹8,000
      </p>
    </div>
  </div>
</section>

        {/* STEP INDICATOR */}
        <div className="step-indicator glass-card fade-up">
          <div className={`step-dot ${step === "basic" ? "active" : ""}`}>
            <span>1</span> Team & Game
          </div>
          <div className={`step-dot ${step === "players" ? "active" : ""}`}>
            <span>2</span> Player Details & Payment
          </div>
          <div className={`step-dot ${step === "success" ? "active" : ""}`}>
            <span>3</span> Done
          </div>
        </div>

        {/* STEP 1: BASIC FORM */}
        {step === "basic" && (
          <section className="form-section glass-card fade-up">
            <h2>Register Your Team</h2>
            <p className="form-note">
              Fill in your basic details and choose the game you want to play.
            </p>

            <form onSubmit={handleBasicSubmit} className="form-grid">
              <div className="form-field">
                <label>Team Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={basicForm.teamName}
                  onChange={handleBasicChange}
                  placeholder="Enter your team name"
                />
              </div>

              <div className="form-field">
                <label>College Name</label>
                <input
                  type="text"
                  name="collegeName"
                  value={basicForm.collegeName}
                  onChange={handleBasicChange}
                  placeholder="Enter your college name"
                />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={basicForm.email}
                  onChange={handleBasicChange}
                  placeholder="teamlead@example.com"
                />
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={basicForm.phone}
                  onChange={handleBasicChange}
                  placeholder="10-digit WhatsApp number"
                />
              </div>

              <div className="form-field">
                <label>Select Game</label>
                <select
                  name="game"
                  value={basicForm.game}
                  onChange={handleBasicChange}
                >
                  <option value="">-- Choose a game --</option>
                  <option value="BGMI">BGMI</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Free Fire">Free Fire</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  Continue
                </button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 2: PLAYERS + PAYMENT */}
        {step === "players" && (
          <section className="form-section glass-card fade-up">
            <h2>
              {selectedGame} • Player Details
            </h2>
            <p className="form-note">
              Enter details of all players in your squad. Make sure everything
              matches the in-game names and IDs.
            </p>

            <form onSubmit={handlePlayersSubmit}>
              <div className="players-grid">
               {players.map((player, index) => (
  <div key={index} className="player-card glass-inner">
    <h3>
      {player.isSubstitute ? "Substitute" : `Player ${index + 1}`}
    </h3>

                    <div className="form-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) =>
                          handlePlayerChange(index, "name", e.target.value)
                        }
                        placeholder="Player's real name"
                      />
                    </div>
                    <div className="form-field">
                      <label>In-Game Name (IGN)</label>
                      <input
                        type="text"
                        value={player.ign}
                        onChange={(e) =>
                          handlePlayerChange(index, "ign", e.target.value)
                        }
                        placeholder="Exact IGN as in game"
                      />
                    </div>
                    <div className="form-field">
                      <label>{gameIdLabel}</label>
                      <input
                        type="text"
                        value={player.gameId}
                        onChange={(e) =>
                          handlePlayerChange(index, "gameId", e.target.value)
                        }
                        placeholder={
                          selectedGame === "Valorant"
                            ? "Swaroop#1234"
                            : "In-game ID / UID"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* PAYMENT SECTION */}
<div className="payment-section glass-inner">
  {(() => {
    const info = PAYMENT_INFO[selectedGame] || {};
    return (
      <>
        <h3>Payment Details – {selectedGame}</h3>
        <p className="form-note small">
          Please scan the QR for <strong>{selectedGame}</strong> and pay the
          registration amount. Then enter your transaction ID below.
        </p>

        {/* Fee + QR + UPI ID (different for each game) */}
        <div className="payment-game-row">
          <div className="payment-qr-box">
            {info.qrImage ? (
              <img
                src={info.qrImage}
                alt={`${selectedGame} payment QR`}
                className="payment-qr-img"
              />
            ) : (
              <div className="payment-qr-placeholder">
                Add QR for {selectedGame}
              </div>
            )}
          </div>

          <div className="payment-info-text">
            <p className="fee-label">{info.feeLabel || "Registration Fee"}</p>
            <p className="upi-id">
              <strong>UPI ID:</strong> {info.upiId || "arenax@upi"}
            </p>
            <p className="form-note small">
              Make sure to pay from the team leader&apos;s number, and keep a
              screenshot as proof.
            </p>
          </div>
        </div>

        {/* Common payment fields */}
        <div className="payment-grid">
          <div className="form-field">
            <label>Payment Method</label>
            <select
              name="method"
              value={payment.method}
              onChange={handlePaymentChange}
            >
              <option value="upi">UPI</option>
              <option value="gpay">Google Pay</option>
              <option value="phonepe">PhonePe</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label>Transaction ID / UTR</label>
            <input
              type="text"
              name="txnId"
              value={payment.txnId}
              onChange={handlePaymentChange}
              placeholder="Enter payment reference ID"
            />
          </div>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="confirmed"
            checked={payment.confirmed}
            onChange={handlePaymentChange}
          />
          <span>
            I confirm that I have paid the registration fees for{" "}
            {selectedGame}.
          </span>
        </label>
      </>
    );
  })()}
</div>

              <div className="form-actions between">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setStep("basic")}
                >
                  ⬅ Back
                </button>
                <button type="submit" className="primary-btn">
                  Submit Registration
                </button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <section className="success-section glass-card pop-in">
            <h2>Thank You for Registering! 🎉</h2>
            <p className="form-note">
              Your team has been registered for <strong>{successGame}</strong>.
              Make sure you join the official WhatsApp group so you don’t miss
              any updates.
            </p>

            {successLink && successLink !== "#" ? (
              <a
                href={successLink}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-link pulse"
              >
                Join {successGame} WhatsApp Group
              </a>
            ) : (
              <p className="form-note small">
                (Add the correct WhatsApp group link for {successGame} in{" "}
                <code>WHATSAPP_LINKS</code>.)
              </p>
            )}

            <button className="secondary-btn mt-24" onClick={resetAll}>
              Register Another Team
            </button>
          </section>
        )}

        {/* INFO SECTIONS */}
        {/* <button
  onClick={() =>
    window.open(
      "https://docs.google.com/document/d/1sEhN0M1htsD0gwCbjwH8mz_pMhXWwKq-/edit?usp=sharing&ouid=112968532099256946465&rtpof=true&sd=true",
      "_blank"
    )
  }
>
  Rules
</button> */}
<button
  onClick={() =>
    window.open(
      "https://docs.google.com/document/d/1sEhN0M1htsD0gwCbjwH8mz_pMhXWwKq-/edit?usp=sharing&ouid=112968532099256946465&rtpof=true&sd=true"
    )
  }
>
  
</button>


        <section id="faq" className="info-section glass-card fade-up">
          <h2>FAQ</h2>
          <p>
            Question: What is the entry fee? <br />
            Answer: ₹400 for BGMI teams, ₹500 for Valorant teams, ₹200 for Free fire <br /> <br />
            Question: Can non-Terna students participate? <br />
            Answer: Yes, open to all college students. <br /> <br />
            Question: How to pay the registration fee? <br />
            Answer: UPI payment via QR code or UPI ID provided during registration. <br /> <br />
            Question: When and where will the matches be held? <br />
            Answer: Online matches; schedule shared in WhatsApp groups. <br /> <br />
            Question: Are there any prizes? <br />
            Answer: Yes, exciting prizes for winning teams. Details in rules document. <br /> <br />
            Question: What about substitutes? <br />
            Answer: Each team can register one substitute player. <br /> <br />
            Question: Who to contact for support? <br />
            Answer: Contact Swaroop (+91 9326151339) or Aditi (+91 9876543210).
          </p>
        </section>
<footer>
        <section id="contact" className="info-section glass-card fade-up">
          <h2>Contact Us</h2>
          <p>
            Swaroop: +91 9326151339 <br />
            Aditi: +91 9876543210 <br />

            csi@ternaengg.ac.in   
          </p>
        </section>
        </footer>
      </main>
    </div>
  );
}

export default App;
