import { useState } from "react";

const TEAM_SIZES = {
  BGMI: 4,
  Valorant: 5,
  // "Free Fire": 4,
};

const WHATSAPP_LINKS = {
  // Add your WhatsApp group invitation links here
  // Format: https://chat.whatsapp.com/XXXXXXXXXXX
  BGMI: "",
  Valorant: "",
  "Free Fire": "",
};

// Add your Looking For Team (LFT) WhatsApp group invitation link here
// Format: https://chat.whatsapp.com/XXXXXXXXXXX
const LFT_WHATSAPP_LINK = "";

const PAYMENT_INFO = {
  BGMI: {
    feeLabel: "Registration Fee: ₹400 per team",
    // Add your UPI ID here (e.g., "username@upi")
    upiId: "",
    // Add QR code image path or URL for BGMI payments
    qrImage: "bgmi qr.jpg", // put these in public/ or use full URLs
  },
  "Free Fire": {
    feeLabel: "Registration Fee: ₹200 per team",
    // Add your UPI ID here (e.g., "username@upi")
    upiId: "",
    // Add QR code image path or URL for Free Fire payments
    qrImage: "Freefire qr.jpg",
  },
  Valorant: {
    feeLabel: "Registration Fee: ₹500 per team",
    // Add your UPI ID here (e.g., "username@upi")
    upiId: "",
    // Add QR code image path or URL for Valorant payments
    qrImage: "valorant qr.jpg",
  },
};



// Add your SheetDB API endpoint here
// Format: https://sheetdb.io/api/v1/YOUR_SHEET_ID
const SHEETDB_URL = "";



function App() {
  const [step, setStep] = useState("basic"); 

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

  const [paymentScreenshot, setPaymentScreenshot] = useState({
    fileName: "",
    dataUrl: "",
  });

  const [selectedGame, setSelectedGame] = useState("");
  const [successGame, setSuccessGame] = useState("");
  const [successLink, setSuccessLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [acceptedTnc, setAcceptedTnc] = useState(false);

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

    
    const mainPlayers = Array.from({ length: size }, () => ({
      name: "",
      ign: "",
      gameId: "",
      isSubstitute: false,
    }));

    const substitutePlayer = {
      name: "",
      ign: "",
      gameId: "",
      isSubstitute: true,
    };

    setPlayers([...mainPlayers, substitutePlayer]);
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


  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPaymentScreenshot({ fileName: "", dataUrl: "" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentScreenshot({
        fileName: file.name,
        dataUrl: reader.result, 
      });
    };
    reader.readAsDataURL(file);
  };

  const gameIdLabel =
    selectedGame === "Valorant"
      ? "Riot ID + #Tag (e.g. Player#1234)"
      : "In-Game ID";

  // ---------- SUBMIT ALL TO SHEET.BEST ----------
  const handlePlayersSubmit = async (e) => {
  e.preventDefault();

  
  for (let i = 0; i < players.length; i++) {
    const p = players[i];

    if (p.isSubstitute) {
      const allEmpty = !p.name && !p.ign && !p.gameId;
      if (allEmpty) continue;

      if (!p.name || !p.ign || !p.gameId) {
        alert(
          "Please either fill all substitute player fields or leave them completely empty."
        );
        return;
      }
    } else {
      if (!p.name || !p.ign || !p.gameId) {
        alert(`Please fill all details for Player ${i + 1}.`);
        return;
      }
    }
  }

  if (!payment.txnId || !payment.confirmed) {
    alert("Please enter payment transaction ID and confirm payment.");
    return;
  }

  if (!paymentScreenshot.dataUrl) {
    alert("Please upload the payment screenshot.");
    return;
  }

  const link = WHATSAPP_LINKS[selectedGame] || "#";

 // Flatten players into columns
const flatPlayers = {
  player1Name: "",
  player1Ign: "",
  player1GameId: "",
  player2Name: "",
  player2Ign: "",
  player2GameId: "",
  player3Name: "",
  player3Ign: "",
  player3GameId: "",
  player4Name: "",
  player4Ign: "",
  player4GameId: "",
  player5Name: "",
  player5Ign: "",
  player5GameId: "",
  substituteName: "",
  substituteIgn: "",
  substituteGameId: "",
};

players.forEach((p, index) => {
  if (p.isSubstitute) {
    flatPlayers.substituteName = p.name || "";
    flatPlayers.substituteIgn = p.ign || "";
    flatPlayers.substituteGameId = p.gameId || "";
  } else {
    const num = index + 1; // 1-based index
    const nameKey = `player${num}Name`;
    const ignKey = `player${num}Ign`;
    const idKey = `player${num}GameId`;

    if (flatPlayers[nameKey] !== undefined) {
      flatPlayers[nameKey] = p.name || "";
      flatPlayers[ignKey] = p.ign || "";
      flatPlayers[idKey] = p.gameId || "";
    }
  }
});

const payload = {
  timestamp: new Date().toISOString(),
  teamName: basicForm.teamName,
  collegeName: basicForm.collegeName,
  email: basicForm.email,
  phone: basicForm.phone,
  game: selectedGame,
  paymentMethod: payment.method,
  transactionId: payment.txnId,
  paymentScreenshotName: paymentScreenshot.fileName || "",
  hasPaymentScreenshot: paymentScreenshot.dataUrl ? "yes" : "no",

  ...flatPlayers,
};



  try {
    setIsSubmitting(true);

    console.log("Sending payload to SheetDB:", payload);

    const res = await fetch(SHEETDB_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ data: payload }), 
});


    const text = await res.text();
    console.log("SheetDB status:", res.status);
console.log("SheetDB response body:", text);

    if (!res.ok) {
      alert(
        `SheetDB error.\n\nStatus: ${res.status}\n\nBody:\n${text}\n\nTake a screenshot of this and share it with the dev.`
      );
      return;
    }

    setSuccessGame(selectedGame);
    setSuccessLink(link);
    setStep("success");

    alert(
      `Thank you for registering for ${selectedGame}!\n\nMake sure you join the WhatsApp group shown on the screen.`
    );
  } catch (err) {
    console.error("Network / CORS error while calling Sheetbest:", err);
    alert(
      "There was a problem submitting your registration (network / CORS). Open the console and check the red error message."
    );
  } finally {
    setIsSubmitting(false);
  }
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
    setPaymentScreenshot({
      fileName: "",
      dataUrl: "",
    });
    setSelectedGame("");
    setSuccessGame("");
    setSuccessLink("");
    setStep("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-wrapper">
      <div className="blur-bg"></div>

      <header className="navbar glass-card fade-down">
        <div className="logo">ArenaX • CSI TERNA</div>
        <nav className="nav-links">
          {/* Rules → open Drive rulebook */}
          <button
            onClick={() =>
              // Add your Google Drive rulebook link here
              window.open(
                "",
                "_blank"
              )
            }
          >
            Rules
          </button>
          <button onClick={() => handleNavClick("faq")}>FAQ</button>
          <button onClick={() => handleNavClick("contact")}>Contact</button>
        </nav>
      </header>

      <main className="content">
        {/* HERO SECTION */}
        <section className="hero-section fade-up">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span>ArenaX</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate campus e-sports showdown. Register your squad and
              battle it out in BGMI, Free Fire and Valorant.
            </p>
          </div>

          <div className="hero-video glass-card">
  <video
    className="video-element"
    controls
    loop
    autoPlay
    // muted
    playsInline
  >
    <source src="/introvideo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

        </section>

        {/* FEES + PRIZEPOOL + LFT BOX */}
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

            {/* LFT / Solo-Duo-Trio Box */}
            <div className="fee-card glass-inner lft-card">
              <h3>Need Team Members?</h3>
              <p className="fee-text">
                If you are solo, duo or trio and want to find teammates, join
                our LFT (Looking For Team) WhatsApp group and share your
                requirement.
              </p>
              <a
                href={LFT_WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-link small-link"
              >
                Join LFT WhatsApp Group
              </a>
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
                <label>Institute Name</label>
                <input
                  type="text"
                  name="collegeName"
                  value={basicForm.collegeName}
                  onChange={handleBasicChange}
                  placeholder="Enter your institute name"
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
                  {/* <option value="Free Fire">Free Fire</option> */}
                  <option value="Valorant">Valorant</option>
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
            <h2>{selectedGame} • Player Details</h2>
            <p className="form-note">
              Enter details of all players in your squad. Make sure everything
              matches the in-game names and IDs.
            </p>

            <form onSubmit={handlePlayersSubmit}>
              <div className="players-grid">
                {players.map((player, index) => (
                  <div key={index} className="player-card glass-inner">
                    <h3>
                      {player.isSubstitute
                        ? "Substitute (optional)"
                        : `Player ${index + 1}`}
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
                            ? "Player#1234"
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
                        Please scan the QR for <strong>{selectedGame}</strong>{" "}
                        and pay the registration amount. Then enter your
                        transaction ID and upload the payment screenshot.
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
                          <p className="fee-label">
                            {info.feeLabel || "Registration Fee"}
                          </p>
                          <p className="upi-id">
                            <strong>UPI ID:</strong>{" "}
                            {info.upiId || "arenax@upi"}
                          </p>
                          <p className="form-note small">
                            Make sure to pay from the team leader&apos;s number,
                            and keep a screenshot as proof.
                            <br />
                            <strong>Entering an incorrect or fake transaction ID will result in immediate disqualification and cancellation of registration.</strong>
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
                            <option value="upi">Paytm</option>
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

                      {/* Screenshot upload */}
                      <div className="screenshot-field">
                        <label>Upload Payment Screenshot (required)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                        />
                        {paymentScreenshot.dataUrl && (
                          <div className="screenshot-preview">
                            <img
                              src={paymentScreenshot.dataUrl}
                              alt="Payment screenshot preview"
                            />
                            <p className="form-note small">
                              {paymentScreenshot.fileName}
                            </p>
                          </div>
                        )}
                      </div>

                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          name="confirmed"
                          checked={payment.confirmed}
                          onChange={handlePaymentChange}
                        />
                        <span>
                          I confirm that transaction ID has been provided and I have paid the registration fees for{" "}
                          {selectedGame}. 
                        </span>
                        </label>
                        <span>
                          <label className="checkbox-row">
  <input
    type="checkbox"
    checked={acceptedTnc}
    onChange={(e) => setAcceptedTnc(e.target.checked)}
  />
  <span>
    I agree to the{" "}
    <a
      href={/* Add your Terms and Conditions URL here */}
      target="_blank"
      rel="noreferrer"
      className="tnc-link"
    >
      Terms & Conditions
    </a>
    .
  </span>
</label>

                        </span>
                      
                    </>
                  );
                })()}
              </div>

              <div className="form-actions between">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setStep("basic")}
                  disabled={isSubmitting}
                >
                  ⬅ Back
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Next"}
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
                className="whatsapp-link"
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

        {/* FAQ & CONTACT SECTIONS */}
        <section id="faq" className="info-section glass-card fade-up">
          <h2>FAQ</h2>
          <p>
            Question: What is the entry fee? <br />
            Answer: ₹400 for BGMI teams, ₹500 for Valorant teams, ₹200 for Free fire <br /> <br />
            Question: What will happen if I provide a fake transaction ID? <br />
            Answer: Immediate disqualification and cancellation of registration. <br /> <br />
            Question: Can non-Terna students participate? <br />
            Answer: Yes, open to all players. <br /> <br />
            Question: How to pay the registration fee? <br />
            Answer: UPI payment via QR code or UPI ID provided during registration. <br /> <br />
            Question: When and where will the matches be held? <br />
            Answer: Online matches; Most likely, the matches will be held in the afternoon(12-6) The exact timings will be notified three days prior to the match day in respective WhatsApp groups. <br /> <br />
            Question: Are there any prizes?  <br />
            Answer: Yes, exciting prizes for winning teams. Details in rules document. <br /> <br />
            Question: What about substitutes? <br />
            Answer: Each team can register one substitute player. <br /> <br />
            Question: Who to contact for support? <br />
            {/* Add your organizer contact information here */}
            Answer: Contact [Organizer Name] (Phone) or [Co-organizer Name] (Phone).
          </p>
        </section>

       <section id="contact" className="info-section glass-card fade-up">
  <h2>Contact Us</h2>
  <p>
    {/* Add organizer names and contact numbers here */}
    [Organizer Name]: +91 XXXXXXXXXX <br />
    [Co-organizer Name]: +91 XXXXXXXXXX <br />
    <br />
    {/* Add your organization email here */}
    [organization@domain.com]
  </p>
</section>

<footer className="footer">
  © 2025 ArenaX. All rights reserved. <br />
  {/* Add developer/credits here */}
  Developed by [Your Name]
</footer>

</main>
</div>
);
}


export default App;
