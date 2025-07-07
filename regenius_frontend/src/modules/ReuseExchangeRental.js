import React, { useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { FormField } from "../components/FormField";
import { COLORS } from "../theme";
import { MdReplay, MdAddCircle, MdSend, MdCheckCircle, MdSearch, MdChat, MdHourglassEmpty } from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Main marketplace for reuse/exchange/rental (P2P).
 * Features:
 * - Browse/post/edit listings (cards)
 * - Search listings (by keyword/type)
 * - Initiate chat/rental in context (mock only)
 * - Inline validation for posting
 * - Dashboard-aligned layout & eco-modern design
 * 
 * Props: { user }
 */
export function ReuseExchangeRental({ user }) {
  // Form state for a new listing
  const [showPost, setShowPost] = useState(false);
  const [postType, setPostType] = useState("exchange"); // 'exchange' | 'give' | 'rental'
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "exchange",
    duration: "",
    contact: "",
    image: ""
  });
  const [postErrors, setPostErrors] = useState({});
  const [postSuccess, setPostSuccess] = useState("");
  const [posting, setPosting] = useState(false);

  // Listing storage (in-memory mock)
  const [listings, setListings] = useState([
    {
      id: "001", type: "exchange", title: "Reusable Water Filter",
      description: "Gently used eco-filter. Swap for kitchen tool. Chat if interested!",
      postedBy: "ecohero1",
      postedByMe: false, status: "active"
    },
    {
      id: "002", type: "give", title: "Free Clothes Hangers (20x)",
      description: "Strong plastic hangers, clean. Can give away—pick up only.",
      postedBy: "reuser99", postedByMe: false, status: "active"
    },
    {
      id: "003", type: "rental", title: "Compost Bin (Short-term Rental)",
      description: "Need a bin for festival? Rent for 1 week. Clean and ready!",
      postedBy: user?.name || "me", postedByMe: true, status: "active", duration: "1 week"
    }
  ]);
  // Mocked state for chat/rental initiation
  const [activeDialog, setActiveDialog] = useState(null);

  // Search/filter state
  const [search, setSearch] = useState("");
  const filteredListings = listings.filter(
    l => (l.status === "active") &&
      ((!search) ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase()) ||
        l.type === search.toLowerCase()));

  // --- Inline validation for posting ---
  function handlePostField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setPostSuccess("");
    setPostErrors(errs => ({ ...errs, [name]: undefined }));
  }
  function handlePostType(type) {
    setPostType(type);
    setForm(f => ({ ...f, type, duration: "" }));
    setPostErrors({});
  }

  function validatePost() {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = "Enter a title (min. 3 chars)";
    if (!form.description || form.description.length < 8) e.description = "Add a description";
    if (!form.contact || form.contact.length < 5) e.contact = "Contact method required";
    if (form.type === "rental" && (!form.duration || form.duration.length < 2)) e.duration = "Duration needed";
    setPostErrors(e);
    return Object.keys(e).length === 0;
  }

  // PUBLIC_INTERFACE: Post a new listing (mock, adds only to local state)
  function handlePost(e) {
    e.preventDefault();
    if (!validatePost()) return;
    setPosting(true);
    setTimeout(() => {
      setListings(list => [
        {
          id: "L" + String(Date.now()).slice(-7),
          ...form,
          postedBy: user?.name || "me",
          postedByMe: true,
          status: "active"
        }, ...list
      ]);
      setForm({
        title: "",
        description: "",
        type: postType,
        duration: "",
        contact: "",
        image: ""
      });
      setPosting(false);
      setShowPost(false);
      setPostSuccess("Listing posted!");
      setTimeout(() => setPostSuccess(""), 1350);
    }, 650);
  }

  function canChat(listing) {
    return !listing.postedByMe && listing.status === "active";
  }

  // PUBLIC_INTERFACE: Start chat/express interest
  function handleChat(listing) {
    setActiveDialog({
      type: "chat",
      listing
    });
  }
  // PUBLIC_INTERFACE: Initiate rental request
  function handleRental(listing) {
    setActiveDialog({
      type: "rental",
      listing
    });
  }

  // PUBLIC_INTERFACE: Close any modal dialog
  function closeDialog() {
    setActiveDialog(null);
  }

  // PUBLIC_INTERFACE: Simple in-page chat/rental initiation (not persistent)
  function handleDialogSend() {
    setActiveDialog(d => ({
      ...d,
      done: true
    }));
    setTimeout(() => setActiveDialog(null), 1000);
  }

  // ---- Layout ----
  return (
    <div style={{
      maxWidth: 1200, margin: "0 auto", padding: "0", minHeight: "80vh"
    }}>
      <h2 style={{
        display: "flex", alignItems: "center", gap: 12,
        color: COLORS.primary, fontWeight: 700,
        fontSize: "2rem", letterSpacing: "0.01em", marginBottom: 10
      }}>
        <MdReplay size={28} style={{ opacity: 0.84 }} />
        Reuse, Exchange & Rental Marketplace
      </h2>
      <div style={{
        color: COLORS.text, opacity: .85, fontSize: 18, marginBottom: 30
      }}>
        Exchange, lend, rent or give away household items locally. Browse what’s available, post your own, or initiate an eco-fair trade!
      </div>
      {/* === Post New Listing Button === */}
      <Card style={{
        margin: "0px 0 22px 0", padding: 20, background: "#f2f8f5"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <GreenButton onClick={() => setShowPost(v => !v)} style={{ fontWeight: 700, padding: "9px 24px" }}>
            <MdAddCircle style={{ verticalAlign: -3, marginRight: 7 }} />{showPost ? "Cancel" : "Post New Listing"}
          </GreenButton>
          <div style={{ flex: 1 }} />
          <div style={{ width: 320, maxWidth: "80vw", display: "flex", alignItems: "center", gap: 6 }}>
            <MdSearch color={COLORS.primary} />
            <input
              type="text"
              value={search}
              placeholder="Search items, keywords, or type"
              style={{
                border: `1.4px solid ${COLORS.accent}`,
                borderRadius: 7,
                padding: "8px 16px",
                width: "100%",
                background: "#ffffff",
                fontSize: "1.05em",
                outline: "none"
              }}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search marketplace"
            />
          </div>
        </div>
        {/* Post form (inline, collapsible) */}
        {showPost && (
          <form onSubmit={handlePost} style={{
            marginTop: 20, background: "#FCFEFD", borderRadius: 12,
            boxShadow: "0 1px 4px #a1cfc944", padding: "26px 18px"
          }}>
            {/* Listing type selector */}
            <div style={{ marginBottom: 15, display: "flex", gap: 13 }}>
              {["exchange", "give", "rental"].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePostType(type)}
                  style={{
                    background: postType === type ? COLORS.secondary : "#e7f7e6",
                    color: postType === type ? "#fff" : COLORS.primary,
                    border: "none",
                    borderRadius: 18,
                    margin: "0 7px 0 0",
                    fontWeight: 600,
                    padding: "8px 27px",
                    fontSize: "1em",
                    cursor: "pointer",
                    boxShadow: postType === type ? "0 1px 7px #FFA60042" : undefined
                  }}
                  aria-pressed={postType === type}
                >
                  {type === "exchange" ? "Exchange" : type === "give" ? "Give Away" : "Rental"}
                </button>
              ))}
            </div>
            <FormField
              label="Title"
              name="title"
              value={form.title}
              onChange={handlePostField}
              required
              error={postErrors.title}
              placeholder="E.g. Power drill for swap"
            />
            <FormField
              label="What are you offering/exchanging?"
              name="description"
              value={form.description}
              onChange={handlePostField}
              required
              error={postErrors.description}
              placeholder="Describe the item, usage, any requirements or eco benefit..."
            />
            {postType === "rental" && (
              <FormField
                label="Rental Duration"
                name="duration"
                value={form.duration}
                onChange={handlePostField}
                required
                error={postErrors.duration}
                placeholder="E.g. 2 days, 1 week"
              />
            )}
            <FormField
              label="Contact Method"
              name="contact"
              value={form.contact}
              onChange={handlePostField}
              required
              error={postErrors.contact}
              placeholder="Your number, email, or chat handle"
            />
            {/* Simple placeholder for image */}
            {/* <FormField label="Image URL" name="image" value={form.image} onChange={handlePostField} /> */}
            <GreenButton type="submit" disabled={posting} style={{ marginTop: 10, width: 190 }}>
              {posting ? "Posting..." : <><MdAddCircle style={{ verticalAlign: -3, marginRight: 5 }} /> Post</>}
            </GreenButton>
            {postSuccess &&
              <div style={{
                color: COLORS.success, fontWeight: 600, marginLeft: 14, marginTop: 6
              }}>
                <MdCheckCircle style={{ verticalAlign: -3, marginRight: 4 }} />
                {postSuccess}
              </div>}
          </form>
        )}
      </Card>
      {/* === Listings Grid === */}
      <div style={{
        display: "grid",
        gridGap: 21,
        gridTemplateColumns: "repeat(auto-fit, minmax(336px, 1fr))",
        alignItems: "stretch"
      }}>
        {filteredListings.length === 0 && (
          <Card style={{ color: "#888", textAlign: "center", fontSize: 19 }}>
            <MdHourglassEmpty size={39} style={{ opacity: 0.34, marginBottom: 7 }} /><br />
            No listings found.<br />
            Try a different search, or post your own!
          </Card>
        )}
        {filteredListings.map(listing => (
          <Card key={listing.id}
            style={{
              minHeight: 124, display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
            <div>
              <div style={{
                fontWeight: 700, color: COLORS.primary, fontSize: 19, marginBottom: 2, display: "flex", gap: 8
              }}>
                {listing.title}
                <span style={{
                  color: listing.type === "exchange"
                    ? COLORS.secondary
                    : listing.type === "give" ? COLORS.accent : "#3086db",
                  fontWeight: 600, marginLeft: 6,
                  background: listing.type === "exchange"
                    ? "#FFF6DE"
                    : listing.type === "give" ? "#EEFDF3" : "#E4EFF7",
                  borderRadius: 8, padding: "2px 10px", fontSize: 14
                }}>
                  {listing.type === "exchange"
                    ? "Exchange"
                    : listing.type === "give"
                      ? "Give Away"
                      : "Rental"}
                </span>
              </div>
              <div style={{ fontSize: 15, color: "#434", opacity: 0.88, marginBottom: 8 }}>
                {listing.description}
                {listing.type === "rental" && (
                  <span style={{ color: COLORS.secondary, marginLeft: 11 }}>
                    (Duration: {listing.duration})
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 13, color: "#777", marginBottom: 4
              }}>
                <b>Contact:</b> {listing.contact}
              </div>
              <div style={{ fontSize: 13, color: "#aaa" }}>
                Posted by: {listing.postedByMe ? "You" : listing.postedBy}
              </div>
            </div>
            {/* Actions (Exchange/Message/Rent) */}
            <div style={{
              marginTop: 12,
              display: "flex",
              gap: 13,
              alignItems: "center"
            }}>
              {canChat(listing) && (
                <>
                  <GreenButton
                    style={{ fontSize: "0.97em", minWidth: 110, padding: "7px 20px" }}
                    onClick={() => handleChat(listing)}
                  >
                    <MdChat style={{ verticalAlign: -3, marginRight: 6 }} />
                    Message
                  </GreenButton>
                  {listing.type === "rental" &&
                    <GreenButton
                      style={{
                        fontSize: "0.97em", padding: "7px 20px",
                        background: "#F6DD77", color: "#365"
                      }}
                      onClick={() => handleRental(listing)}
                    >
                      <MdSend style={{ verticalAlign: -3, marginRight: 7 }} />
                      Request Rental
                    </GreenButton>
                  }
                </>
              )}
              {listing.postedByMe &&
                <div style={{
                  fontWeight: 500,
                  color: "#6cc881",
                  background: "#e9f8ec",
                  borderRadius: 8,
                  padding: "4px 13px"
                }}>Your listing</div>
              }
            </div>
          </Card>
        ))}
      </div>
      {/* In-page dialog for chat/rental */}
      {activeDialog && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "#113a1843", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
          aria-modal="true"
          role="dialog"
        >
          <div style={{
            background: "#fff", minWidth: 310, maxWidth: "95vw", minHeight: 160,
            borderRadius: 16, boxShadow: "0 6px 22px #206a3932", padding: "34px 28px",
            maxWidth: 370, position: "relative"
          }}>
            <button
              aria-label="Close dialog"
              onClick={closeDialog}
              style={{
                position: "absolute", right: 17, top: 19, background: "none",
                border: "none", fontSize: 28, color: "#7a8f73", cursor: "pointer"
              }}
            >×</button>
            <div style={{ fontWeight: 700, fontSize: 17, color: COLORS.primary, marginBottom: 5 }}>
              {activeDialog.type === "chat" ? "Message Seller" : "Request Rental"}
            </div>
            <div style={{ fontSize: 14, color: "#444", marginBottom: 7 }}>
              {activeDialog.listing.title}
            </div>
            {!activeDialog.done ? (
              <>
                <div>
                  <input type="text"
                    placeholder={activeDialog.type === "chat"
                      ? "Write a message (simulated chat)..."
                      : "Leave a message for the owner"}
                    style={{
                      width: "100%", borderRadius: 8,
                      border: "1.3px solid #aad8b6", padding: "10px 10px",
                      fontSize: 15, marginBottom: 11, outline: COLORS.accent
                    }}
                  />
                </div>
                <GreenButton
                  onClick={handleDialogSend}
                  style={{ fontWeight: 600, minWidth: 110, fontSize: 15, padding: "8px 14px" }}
                >
                  <MdSend style={{ verticalAlign: -3, marginRight: 5 }} />
                  Send
                </GreenButton>
              </>
            ) : (
              <div style={{ color: COLORS.success, fontSize: "1.11em", fontWeight: 600, marginTop: 10 }}>
                <MdCheckCircle style={{ verticalAlign: -5, marginRight: 7 }} />
                {activeDialog.type === "chat" ? "Message sent!" : "Rental request sent!"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
