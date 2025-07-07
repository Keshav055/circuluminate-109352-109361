import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { FormField } from "../components/FormField";
import { COLORS } from "../theme";
import {
  MdForum, MdChat, MdReply, MdEvent, MdGroup, MdAssignmentInd,
  MdWork, MdHowToReg, MdCheckCircle, MdArrowForward, MdRefresh, MdPeople
} from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Community Ecosystem: Forums/message board (threads & replies),
 * Upcoming Events/Workshops, Registration UI, Mentorship matching form.
 * Aligned with dashboard card/eco style. In-page state and feedback (no popups).
 * Props: { user }
 */
/**
 * API_BASE should point to where the backend API is served from.
 *
 * IN DEVELOPMENT:
 * - If running React frontend on http://localhost:3000 and backend at http://localhost:5000,
 *   you must set up either:
 *   1. A "proxy" field in package.json (see README) pointing to backend (e.g. "proxy": "http://localhost:5000")
 *   OR
 *   2. Set REACT_APP_API_BASE in a .env file to the backend base URL (e.g. "REACT_APP_API_BASE=http://localhost:5000")
 * - If you do not do this, API requests may return HTML (the dev server's index.html), causing all fetches to fail 
 *   and demo/sample data to appear.
 *
 * PRODUCTION:
 * - Set REACT_APP_API_BASE via environment variable at build/deploy time if API uses a different origin/path.
 */
const API_BASE = process.env.REACT_APP_API_BASE || ""; // e.g. "/api" or "" if same origin

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

/**
 * PUBLIC_INTERFACE
 * Fetch community forum threads/topics from backend
 * If backend unavailable, fall back to demo threads.
 */
/**
 * PUBLIC_INTERFACE
 * Fetch community forum threads/topics from backend with robust Content-Type check.
 * If backend unavailable, fall back to demo threads.
 * Enhanced error info for HTML/non-JSON response.
 */
async function fetchThreads(setError) {
  const DEMO_THREADS = [
    {
      id: "demo1",
      title: "How do I repair a cracked phone screen sustainably?",
      body: "I want to avoid e-waste and repair my phone's cracked glass myself or locally. Any tips or shops?",
      author: "EcoFan",
      replyCount: 2
    },
    {
      id: "demo2",
      title: "Community recycling event next week!",
      body: "Join us for a drop-off event. Bring plastics, e-waste, etc.",
      author: "GreenChris",
      replyCount: 1
    }
  ];
  try {
    setError("");
    const resp = await fetch(apiUrl("/forums/threads"));
    if (!resp.ok) throw new Error("Failed to load threads");
    const contentType = resp.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await resp.json();
    } else {
      // Likely backend misconfiguration, auth error, or server error/HTML.
      const text = await resp.text();
      if (typeof window !== "undefined" && window.console) {
        console.error("Expected JSON, got non-JSON response:", text);
      }
      setError(`Could not fetch topics/threads. The backend did not return valid JSON${
        API_BASE ? " (check the configuration for REACT_APP_API_BASE: '" + API_BASE + "')" : ""
      }. First bytes: ${text.slice(0, 120).replace(/\\n/g, " ").replace(/</g, "&lt;")} ... Showing demo topics.`);
      return DEMO_THREADS;
    }
  } catch (e) {
    setError(
      `Could not fetch topics/threads.${
        e && e.message ? " " + e.message : ""
      }${API_BASE ? " (Check REACT_APP_API_BASE: '" + API_BASE + "')" : ""} Showing demo topics.`
    );
    return DEMO_THREADS;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch replies for a given thread, with robust Content-Type handling.
 */
async function fetchReplies(threadId, setError) {
  try {
    setError("");
    const resp = await fetch(apiUrl(`/forums/threads/${threadId}/replies`));
    if (!resp.ok) throw new Error("Failed to load replies");
    const contentType = resp.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await resp.json();
    } else {
      const text = await resp.text();
      if (typeof window !== "undefined" && window.console) {
        console.error("Expected JSON for replies, got non-JSON response:", text);
      }
      setError(
        `Could not fetch replies for thread. Backend did not return JSON${
          API_BASE ? " (check REACT_APP_API_BASE: '" + API_BASE + "')" : ""
        }. First bytes: ${text.slice(0, 80).replace(/\\n/g, " ").replace(/</g, "&lt;")}`
      );
      return [];
    }
  } catch (e) {
    setError(
      `Could not fetch replies for thread.${e && e.message ? " " + e.message : ""}${
        API_BASE ? " (Check REACT_APP_API_BASE: '" + API_BASE + "')" : ""
      }`
    );
    return [];
  }
}

async function postThread({ title, body, author }, setError) {
  try {
    setError("");
    const resp = await fetch(apiUrl("/forums/threads"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, author })
    });
    if (!resp.ok) {
      let data;
      try { data = await resp.json(); } catch {}
      throw new Error(data?.message || "Failed to create thread");
    }
    return await resp.json();
  } catch (e) {
    setError(e.message || "Could not post topic.");
    return null;
  }
}

async function postReply({ threadId, reply, author }, setError) {
  try {
    setError("");
    const resp = await fetch(apiUrl(`/forums/threads/${threadId}/replies`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply, author })
    });
    if (!resp.ok) {
      let data;
      try { data = await resp.json(); } catch {}
      throw new Error(data?.message || "Failed to post reply");
    }
    return await resp.json();
  } catch (e) {
    setError(e.message || "Could not post reply.");
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch event/workshop list from backend.
 * Returns fallback demo data if backend fails/unavailable.
 * Expects: [{ id, title, description, date, time, location, host, spots, registered, ... }]
 */
async function fetchEvents(setEventError) {
  const DEMO_EVENTS = [
    {
      id: "event1",
      title: "Repair Cafe - Fix Your Broken Gadgets",
      description: "Join our community event and get help repairing small electronics and appliances. Tools & volunteers available.",
      date: new Date(Date.now() + 4 * 24 * 3600000).toISOString(), // 4 days from now
      time: "15:00–18:00",
      location: "Makerspace, Main Street",
      host: "CircularTown",
      spots: 16,
      registered: false
    },
    {
      id: "event2",
      title: "Workshop: Upcycling Old Clothing",
      description: "Hands-on session: Give new life to your unused clothes. Bring your own or use ours.",
      date: new Date(Date.now() + 8 * 24 * 3600000).toISOString(), // 8 days from now
      time: "10:30–12:30",
      location: "GreenCenter Hall",
      host: "EcoDesigners",
      spots: 20,
      registered: false
    }
  ];
  try {
    setEventError("");
    const resp = await fetch(apiUrl("/events"));
    if (!resp.ok) throw new Error("Failed to load events");
    const events = await resp.json();
    return Array.isArray(events) ? events : [];
  } catch (e) {
    setEventError(
      `Could not fetch events.${e && e.message ? " " + e.message : ""} Displaying sample events.`
    );
    return DEMO_EVENTS;
  }
}

/**
 * Register for an event/workshop. Expects { eventId, user }
 * Returns { success, ... }
 */
async function registerEvent(eventId, user, setEventError) {
  try {
    setEventError("");
    const resp = await fetch(apiUrl(`/events/${eventId}/register`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user })
    });
    if (!resp.ok) {
      let data;
      try { data = await resp.json(); } catch {}
      throw new Error(data?.message || "Registration failed");
    }
    return await resp.json();
  } catch (e) {
    setEventError(e.message || "Could not register for event.");
    return null;
  }
}

/**
 * Event/Workshop Listing & Registration UI, consistent with eco-dashboard style.
 * Polished for accessibility, responsive, in-card feedback. Replaces hardcoded demo.
 */
function EventWorkshopCard({ user }) {
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState("");
  const [registering, setRegistering] = useState("");
  const [regFeedback, setRegFeedback] = useState("");
  const [regErr, setRegErr] = useState("");

  // Track which event has just been registered so we can optimistically update
  const [justRegistered, setJustRegistered] = useState(null);

  // Fetch real events from API
  useEffect(() => {
    setEventLoading(true);
    fetchEvents(setEventError).then(evts => {
      setEvents(evts);
      setEventLoading(false);
    });
  }, []);

  // Handle event registration
  async function handleRegister(evId) {
    if (!user || !user.name) {
      setRegErr("Please sign in to register.");
      return;
    }
    setRegistering(evId);
    setRegErr("");
    const res = await registerEvent(evId, user, setRegErr);
    setRegistering("");
    if (res && res.success) {
      setRegFeedback("Registered for event!");
      setEvents(es =>
        es.map(ev => ev.id === evId ? { ...ev, registered: true, spots: Math.max(0, (ev.spots || 1) - 1) } : ev)
      );
      setJustRegistered(evId);
      setTimeout(() => {
        setRegFeedback("");
        setJustRegistered(null);
      }, 1400);
    } else if (res && res.message) {
      setRegErr(res.message);
    } else {
      setRegErr("Could not register at this time.");
    }
  }

  return (
    <Card style={{ background: "#f7fbfa" }} aria-labelledby="eco-events-head">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <MdEvent style={{ color: COLORS.secondary }} size={23} />
        <b id="eco-events-head" style={{ color: COLORS.primary }}>Upcoming Events & Workshops</b>
        <GreenButton
          type="button"
          style={{ marginLeft: "auto", fontSize: 13, padding: "7px 17px", minWidth: 50 }}
          onClick={() => {
            setEventLoading(true);
            fetchEvents(setEventError).then(evts => {
              setEvents(evts);
              setEventLoading(false);
            });
          }}
          aria-label="Refresh events"
        >
          <MdRefresh style={{ verticalAlign: -2, marginRight: 6 }} />
          Refresh
        </GreenButton>
      </div>
      <div style={{
        color: "#285c3c", marginBottom: 12, fontSize: 14.5
      }}>
        <b>Learn, share, and grow:</b> Workshops and local events for a circular economy.
      </div>
      {eventError && <div style={{ color: COLORS.error, fontWeight: 600, marginBottom: 9 }}>
        {eventError}
        <div style={{color:'#955',fontWeight:400,fontSize:13}}>(This is sample data. <b>Try again later</b> or <b>contact support</b> if issue persists.)</div>
      </div>}
      {eventLoading ? (
        <div style={{ color: COLORS.accent, fontWeight: 500, fontSize: 15 }}>Loading events...</div>
      ) : (
        <>
          <ul style={{ color: "#444", fontSize: 15, margin: "4px 0 0", paddingLeft: 0, listStyle: "none" }}>
            {Array.isArray(events) && events.length > 0 ? (
              events.map(ev => (
                <li key={ev.id} style={{
                  marginBottom: 13,
                  borderRadius: 13,
                  background: "#f8fffc",
                  boxShadow: "0 1.5px 6px #e3f9eb19",
                  padding: "11px 15px",
                  display: "flex", flexDirection: "column",
                  border: `1.5px solid ${ev.registered ? COLORS.secondary : COLORS.accent}13`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <b style={{ fontSize: 17, color: COLORS.primary }}>{ev.title}</b>
                    <span style={{ fontSize: 13, color: COLORS.accent, marginLeft: 7 }}>
                      {ev.date ? new Date(ev.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                      {ev.time && " – " + ev.time}
                    </span>
                    <span style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: COLORS.secondary,
                      background: "#ffa60023",
                      borderRadius: 9,
                      marginLeft: 10,
                      padding: "2px 11px"
                    }}>
                      {ev.host || "Hosted by Community"}
                    </span>
                    {ev.spots !== undefined &&
                      <span style={{ fontSize: 12, marginLeft: 12, color: "#589c3e" }}>
                        {ev.spots === 0 ? "Full" : `${ev.spots} spots`}
                      </span>
                    }
                    {ev.registered &&
                      <span style={{
                        fontSize: 13, color: COLORS.secondary,
                        marginLeft: 16, fontWeight: 700
                      }}>
                        <MdCheckCircle style={{ color: COLORS.accent, verticalAlign: -4 }} /> Registered
                      </span>
                    }
                  </div>
                  <div style={{
                    color: "#285c3c", fontSize: 14, margin: "3px 0 2px", fontWeight: 500, opacity: .9
                  }}>
                    {ev.description}
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    marginTop: 5,
                  }}>
                    <span style={{ fontSize: 12, color: "#888" }}>{ev.location}</span>
                    <GreenButton
                      type="button"
                      style={{
                        marginLeft: "auto", fontSize: 14, padding: "7px 19px",
                        background: ev.registered ? "#d2ede2" : COLORS.primary,
                        color: ev.registered ? "#206a39" : COLORS.textInverse,
                        cursor: ev.registered ? "not-allowed" : "pointer"
                      }}
                      disabled={!!ev.registered || registering === ev.id || (ev.spots === 0)}
                      onClick={() => handleRegister(ev.id)}
                      aria-disabled={!!ev.registered || registering === ev.id || (ev.spots === 0)}
                      aria-label={ev.registered ? "Already Registered" : "Register for " + ev.title}
                    >
                      {registering === ev.id
                        ? <>Registering...</>
                        : ev.registered
                          ? <>Registered <MdCheckCircle style={{ verticalAlign: -4, marginLeft: 4 }} /></>
                          : ev.spots === 0
                            ? <>Full</>
                            : <>Register <MdHowToReg style={{ verticalAlign: -4, marginLeft: 5 }} /></>
                      }
                    </GreenButton>
                  </div>
                </li>
              ))
            ) : (
              <li style={{ color: "#888", fontSize: 16, textAlign: "center", marginTop: 19 }}>No upcoming events found.</li>
            )}
          </ul>
          {regFeedback && <div style={{
            color: COLORS.success, fontWeight: 600, marginTop: 8, marginBottom: 2
          }}><MdCheckCircle style={{ verticalAlign: -3, marginRight: 3 }} />{regFeedback}</div>}
          {regErr && <div style={{
            color: COLORS.error, fontWeight: 600, marginTop: 9
          }}>{regErr}</div>}
        </>
      )}
    </Card>
  );
}

// PUBLIC_INTERFACE
export function CommunityEcosystem({ user }) {
  // Threads (=topics), and state
  const [threads, setThreads] = useState([]);
  const [forumLoading, setForumLoading] = useState(true);
  const [forumError, setForumError] = useState("");
  const [showNewThread, setShowNewThread] = useState(false);

  // Thread creation
  const [newThread, setNewThread] = useState({ title: "", body: "" });
  const [newThreadError, setNewThreadError] = useState("");
  const [newThreadLoading, setNewThreadLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Active thread: show replies, reply form
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState("");

  // Reply
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    setForumLoading(true);
    fetchThreads(setForumError).then(data => {
      setThreads(data);
      setForumLoading(false);
    });
  }, []);

  useEffect(() => {
    // load replies if focused thread
    if (activeThreadId !== null) {
      setRepliesLoading(true);
      fetchReplies(activeThreadId, setRepliesError).then(data => {
        setReplies(data);
        setRepliesLoading(false);
      });
    }
  }, [activeThreadId]);

  function handleNewThreadField(e) {
    const { name, value } = e.target;
    setNewThread(x => ({ ...x, [name]: value }));
    setNewThreadError("");
    setSuccessMsg("");
  }
  function handleReplyField(e) {
    setReplyText(e.target.value);
    setReplyError("");
  }
  // Validate and create thread
  async function handlePostThread(e) {
    e.preventDefault();
    setNewThreadError("");
    setSuccessMsg("");
    if (!newThread.title || newThread.title.length < 3) {
      setNewThreadError("Enter a title (min 3 chars)");
      return;
    }
    if (!newThread.body || newThread.body.length < 10) {
      setNewThreadError("Add a description (min 10 chars)");
      return;
    }
    setNewThreadLoading(true);
    const result = await postThread({
      title: newThread.title,
      body: newThread.body,
      author: user?.name || "anon"
    }, setNewThreadError);
    setNewThreadLoading(false);
    if (result) {
      setThreads(ts => [result, ...ts]);
      setShowNewThread(false);
      setNewThread({ title: "", body: "" });
      setSuccessMsg("Thread created!");
      setTimeout(() => setSuccessMsg(""), 1200);
    }
  }

  // Open thread to show replies
  function handleOpenThread(thread) {
    setActiveThreadId(thread.id ?? thread._id ?? thread.threadId ?? null);
    setReplies([]);
    setRepliesLoading(true);
    setRepliesError("");
    setSuccessMsg("");
  }
  // Post reply (with optimistic UI)
  async function handlePostReply(e) {
    e.preventDefault();
    setReplyError("");
    if (!replyText || replyText.length < 2) {
      setReplyError("Reply too short.");
      return;
    }
    setReplyLoading(true);
    const posted = await postReply({
      threadId: activeThreadId,
      reply: replyText,
      author: user?.name || "anon"
    }, setReplyError);
    setReplyLoading(false);
    if (posted) {
      setReplies(rs => [posted, ...rs]);
      setThreads(tlist => tlist.map(t =>
        (t.id ?? t._id ?? t.threadId) === activeThreadId
          ? { ...t, replyCount: (t.replyCount || 0) + 1 }
          : t
      ));
      setReplyText("");
      setSuccessMsg("Reply posted!");
      setTimeout(() => setSuccessMsg(""), 1000);
    }
  }

  // UI: Accessible, Card style, Error handling
  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", padding: "11px 2vw" }}>
      <h2 style={{
        display: "flex",
        alignItems: "center", gap: 13,
        color: COLORS.primary, fontWeight: 800, fontSize: "2rem", letterSpacing: ".01em", marginBottom: 5
      }}>
        <MdForum size={33} style={{ opacity: 0.85 }} /> Community Forums & Events
      </h2>
      <div style={{
        color: "#286541", fontSize: 18, opacity: .93,
        marginBottom: 24, fontWeight: 500
      }}>
        Discuss, share, and grow circularity together! Connect in forums, join/upcoming events, or seek a mentor.
      </div>

      {/* Forums / Message Board (Topics/Threads) */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 11 }}>
          <MdForum color={COLORS.secondary} size={25} />
          <span style={{ fontWeight: 700, color: COLORS.primary, fontSize: "1.25em" }}>
            Message Board
          </span>
          <GreenButton
            style={{ marginLeft: "auto", fontSize: 15, padding: "7px 18px" }}
            onClick={() => setShowNewThread(v => !v)}
          >
            {showNewThread ? "Cancel" : "New Topic"}
          </GreenButton>
        </div>
        {showNewThread &&
          (<form onSubmit={handlePostThread} style={{
            background: "#fbfaf2", marginBottom: 16,
            borderRadius: 11, boxShadow: "0 1px 8px #faebc825", padding: "24px 11px"
          }}>
            <FormField
              label="Title"
              name="title"
              value={newThread.title}
              onChange={handleNewThreadField}
              required
              error={newThreadError}
              placeholder="Thread topic (e.g. 'Repair: broken screen on laptop')"
            />
            <FormField
              label="Description"
              name="body"
              value={newThread.body}
              onChange={handleNewThreadField}
              required
              error={newThreadError}
              placeholder="Describe your question, share a resource, etc. (min 10 chars)"
            />
            <GreenButton type="submit" disabled={newThreadLoading} style={{ marginTop: 7, width: 140 }}>
              {newThreadLoading ? "Posting..." : "Post Topic"}
            </GreenButton>
            {successMsg &&
              <div style={{
                color: COLORS.success, fontWeight: 600, marginLeft: 12, marginTop: 6
              }}>
                <MdCheckCircle style={{ verticalAlign: -4, marginRight: 4 }} />
                {successMsg}
              </div>
            }
          </form>)
        }
        {forumError &&
          <div style={{ color: COLORS.error, fontWeight: 600, marginBottom: 9 }}>
            {forumError}
            <div style={{color:'#955',fontWeight:400,fontSize:13}}>(This is sample data. <b>Try again later</b> or <b>contact support</b> if issue persists.)</div>
          </div>
        }
        {forumLoading ?
          (<div style={{ color: COLORS.accent, fontWeight: 500 }}>
            Loading forum topics...
          </div>)
          : (threads.length === 0 ?
            <div style={{ color: "#888", textAlign: "center", fontSize: 17, margin: "17px 0" }}>
              No discussions yet. Start the first topic!
            </div>
            :
            <>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {threads.map(thread => (
                  <li key={thread.id ?? thread._id ?? thread.threadId}
                    style={{
                      margin: "9px 0", borderRadius: 11, background: "#fffef7",
                      boxShadow: "0 1px 7px #e3f9eb15", padding: "13px 17px"
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <b style={{ fontSize: 17, color: COLORS.primary }}>{thread.title}</b>
                      <span style={{
                        color: "#888", marginLeft: 9, fontSize: 14
                      }}>{thread.author || "anon"}</span>
                      <span style={{
                        marginLeft: "auto", color: COLORS.secondary, fontWeight: 600,
                        background: "#ffa60022", borderRadius: 9, fontSize: 13, padding: "2px 11px"
                      }}>
                        {thread.replyCount ?? (thread.replies?.length ?? 0)} Replies
                      </span>
                      <GreenButton
                        style={{
                          fontSize: 13, padding: "5px 15px", marginLeft: 10,
                          background: "#e3f8de", color: COLORS.primary
                        }}
                        onClick={() => handleOpenThread(thread)}
                      >
                        <MdChat style={{ verticalAlign: -3, marginRight: 4 }} /> View
                      </GreenButton>
                    </div>
                    <div style={{
                      color: "#426", marginTop: 7, fontSize: 15, opacity: .92,
                      maxHeight: 44, overflow: "hidden", textOverflow: "ellipsis"
                    }}>
                      {thread.body}
                    </div>
                  </li>
                ))}
              </ul>
            </>)
        }
      </Card>

      {/* --- Replies and Reply Form --- */}
      {activeThreadId && (
        <Card style={{ marginBottom: 24 }}>
          <div style={{
            display: "flex", gap: 13, alignItems: "center", marginBottom: 6
          }}>
            <MdReply size={23} color={COLORS.accent} /> <b style={{ color: COLORS.primary }}>
              Thread: {threads.find(t => (t.id ?? t._id ?? t.threadId) === activeThreadId)?.title || "View"}
            </b>
            <button
              aria-label="Close thread details"
              onClick={() => { setActiveThreadId(null); setReplies([]); setRepliesError(""); }}
              style={{
                marginLeft: "auto", background: "none", border: "none",
                color: COLORS.secondary, fontWeight: 700, fontSize: 20, cursor: "pointer"
              }}>×</button>
          </div>
          {repliesError &&
            <div style={{ color: COLORS.error, fontWeight: 600, marginBottom: 9 }}>{repliesError}</div>
          }
          <form onSubmit={handlePostReply} style={{ marginBottom: 17 }}>
            <FormField
              label="Your reply"
              name="reply"
              value={replyText}
              onChange={handleReplyField}
              error={replyError}
              required
              placeholder="Share your thoughts, resources, or suggestions…"
            />
            <GreenButton type="submit" disabled={replyLoading} style={{ marginTop: 5, width: 130 }}>
              {replyLoading ? "Replying..." : <>Reply <MdReply style={{ verticalAlign: -4, marginLeft: 3 }} /></>}
            </GreenButton>
            {successMsg &&
              <div style={{
                color: COLORS.success, fontWeight: 600, marginLeft: 10, marginTop: 6
              }}><MdCheckCircle style={{ verticalAlign: -4, marginRight: 4 }} />
                {successMsg}
              </div>
            }
          </form>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {repliesLoading ? (
              <li style={{ color: COLORS.accent, fontWeight: 500 }}>
                Loading replies...
              </li>
            ) : (
              replies.length === 0 ?
                <li style={{ color: "#888", fontSize: 15, margin: "6px 0" }}>No replies yet.</li>
                :
                replies.map((rep, idx) => (
                  <li key={rep.id ?? rep._id ?? idx}
                    style={{
                      marginBottom: 11, padding: "8px 15px", background: "#f7fff7",
                      borderRadius: 8, boxShadow: "0 1px 6px #6dd39918"
                    }}>
                    <div style={{ fontWeight: 600, color: COLORS.primary, fontSize: 15 }}>
                      {rep.author || "anon"}
                      <span style={{ color: "#976b36", fontWeight: 500, marginLeft: 13, fontSize: 12 }}>
                        {rep.createdAt ? (new Date(rep.createdAt)).toLocaleString() : ""}
                      </span>
                    </div>
                    <div style={{
                      color: "#384927", marginTop: 2.5, fontSize: 15,
                      whiteSpace: "pre-line"
                    }}>
                      {rep.reply ?? rep.body ?? rep.text}
                    </div>
                  </li>
                ))
            )}
          </ul>
        </Card>
      )}

      {/* --- Events and Mentorship --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1.17fr 1fr", gap: 23, alignItems: "start" }}>
        <EventWorkshopCard user={user} />
        <Card style={{ background: "#fdfbf4" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 4
          }}>
            <MdGroup style={{ color: COLORS.primary }} size={23} />
            <b style={{ color: COLORS.secondary }}>Mentorship Match</b>
          </div>
          <div style={{
            color: "#285c3c", marginBottom: 7, fontSize: 14.5
          }}>
            Pair with another community member for learning, upskilling, or sharing experience.
          </div>
          {/* MENTORSHIP feature: now interactive with backend if available */}
          <MentorshipSection user={user} />
        </Card>
      </div>
    </div>
  );
}

// --- Mentorship: Backend-connected matching, mentor directory, availability, direct message ---

/**
 * Render matchmaking UI, list mentors, allow requests and (if feasible) direct message.
 * - Connects to `/mentorship/mentors` GET for mentor list,
 * - POST `/mentorship/request` to request match,
 * - (optional) POST `/mentorship/message` for direct message.
 * If backend is unavailable, shows a smart fallback/demo with mock data.
 */
function MentorshipSection({ user }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorshipError, setMentorshipError] = useState("");
  const [showRequest, setShowRequest] = useState(false);
  const [requestType, setRequestType] = useState("find"); // 'find' (mentee) or 'offer' (mentor)
  const [reqMsg, setReqMsg] = useState("");
  const [reqSuccess, setReqSuccess] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [availability, setAvailability] = useState("");
  const [selectMentor, setSelectMentor] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [msgStatus, setMsgStatus] = useState("");

  // --- Helper function: Get real backend endpoint if available ---
  function getMentorshipApiUrl(path) {
    return (process.env.REACT_APP_API_BASE || "") + path;
  }

  // Demo fallback mentor directory if backend not present
  const DEMO_MENTORS = [
    { id: 1, name: "Jess Green", skills: ["Eco Design", "Repair"], location: "Berlin", bio: "Product circle expert", available: "Weds and Sat AM" },
    { id: 2, name: "Derek T. Cycle", skills: ["Reuse", "Repair", "Electronics"], location: "London", bio: "Sustainable engineering lead", available: "Mon–Fri after 18:00" }
  ];

  // Fetch mentors from backend or fallback to demo
  useEffect(() => {
    async function fetchMentors() {
      setLoading(true); setMentorshipError("");
      try {
        const apiEndpoint = getMentorshipApiUrl("/mentorship/mentors");
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error("");
        const data = await res.json();
        setMentors(Array.isArray(data) ? data : []);
      } catch {
        setMentors(DEMO_MENTORS); // Fallback
        setMentorshipError("Showing demo mentors.");
      }
      setLoading(false);
    }
    fetchMentors();
  }, []);

  // Request mentor or become one (POST to backend)
  async function handleRequest(e) {
    e.preventDefault();
    setRequesting(true); setReqMsg(""); setReqSuccess(""); setMentorshipError("");
    try {
      const apiEndpoint = getMentorshipApiUrl("/mentorship/request");
      const body = {
        sender: user?.name || "anon",
        type: requestType,
        availability,
        message: reqMsg
      };
      let res, data;
      try {
        res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        data = await res.json();
        setReqSuccess(data?.message || "Mentorship request sent!");
      } catch {
        setReqSuccess("Mentorship request sent! (Demo mode)");
      }
      setShowRequest(false);
      setAvailability(""); setReqMsg("");
      setTimeout(() => setReqSuccess(""), 2400);
    } catch (ex) {
      setMentorshipError("Could not complete request.");
    } finally {
      setRequesting(false);
    }
  }

  // Open chat direct message modal with a mentor (if backend supports POST)
  async function handleSendMessage(e) {
    e.preventDefault();
    setMsgStatus("Sending...");
    try {
      const apiEndpoint = getMentorshipApiUrl("/mentorship/message");
      const body = {
        mentorId: selectMentor?.id,
        sender: user?.name || "anon",
        message: messageText
      };
      let res, data;
      try {
        res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error();
        data = await res.json();
        setMsgStatus(data?.message || "Message sent!");
      } catch {
        setMsgStatus("Message sent! (Demo: not delivered)");
      }
      setTimeout(() => {
        setSelectMentor(null); setMessageText(""); setMsgStatus("");
      }, 1400);
    } catch {
      setMsgStatus("Could not send message.");
    }
  }

  return (
    <div>
      <div style={{
        fontSize: 14,
        color: "#4d471b",
        marginBottom: 7
      }}>
        {reqSuccess && (
          <div style={{ color: COLORS.success, fontWeight: 600, marginBottom: 7 }}>
            <MdCheckCircle style={{ verticalAlign: "-4%", color: COLORS.secondary, marginRight: 6 }} />
            {reqSuccess}
          </div>
        )}
        {mentorshipError && (
          <span style={{ color: COLORS.error, fontWeight: 500 }}>{mentorshipError}</span>
        )}
        {!reqSuccess && <span>
          Ready to grow? <b>Find a mentor</b> or <b>offer yourself</b> as a mentor! <br />
          <a href="#" style={{ color: COLORS.accent, textDecoration: "underline", marginRight: 8 }}
            onClick={e => { e.preventDefault(); setShowRequest(s => !s); setRequestType("find"); }}>
            {showRequest && requestType === "find" ? "Cancel" : "Request a Mentor"}
          </a>
          <a href="#" style={{ color: COLORS.secondary, textDecoration: "underline", marginLeft: 8 }}
            onClick={e => { e.preventDefault(); setShowRequest(s => !s); setRequestType("offer"); }}>
            {showRequest && requestType === "offer" ? "Cancel" : "Offer to Mentor"}
          </a>
        </span>}
      </div>
      {showRequest && (
        <form onSubmit={handleRequest} style={{ background: "#fcfff7", borderRadius: 13, padding: "19px 13px", marginBottom: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {requestType === "find" ? "Mentor Match Request" : "Register as Mentor"}
          </div>
          <FormField
            label={requestType === "offer" ? "Your Areas (skills/topics)" : "Preferred Mentor Areas"}
            name="message"
            value={reqMsg}
            onChange={e => setReqMsg(e.target.value)}
            required
            placeholder="E.g. repair, eco design, sustainability, electronics, upcycling"
          />
          <FormField
            label="Your Availability"
            name="availability"
            value={availability}
            onChange={e => setAvailability(e.target.value)}
            required
            placeholder="e.g. Mon-Wed 6-9pm, Weekends, etc."
          />
          <GreenButton type="submit" style={{ marginTop: 4, width: 130 }} disabled={requesting}>
            {requesting ? "Submitting..." : (requestType === "find" ? "Find Mentor" : "Offer Mentorship")}
          </GreenButton>
        </form>
      )}
      {/* Mentor Directory */}
      <div style={{
        fontWeight: 700, color: COLORS.primary, fontSize: 15.5, margin: "9px 0 7px", display: "flex", alignItems: "center", gap: 9
      }}>
        <MdPeople style={{ color: COLORS.accent }} /> Available Mentors
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {loading
          ? <li style={{ color: COLORS.accent }}>Loading mentor directory...</li>
          : mentors.length === 0
            ? <li style={{ color: "#888" }}>No mentors listing found.</li>
            : mentors.map(m => (
              <li key={m.id}
                style={{
                  marginBottom: 13,
                  borderRadius: 13,
                  background: "#f8fffc",
                  boxShadow: "0 2px 9px #e3f9eb28",
                  padding: "15px 15px",
                  border: `1.5px solid #${COLORS.accent.replace('#', '')}1c`
                }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    borderRadius: "50%", background: "#fffbe8",
                    boxShadow: "0 1.5px 9px #afc86618", width: 48, height: 48, justifyContent: "center"
                  }}>
                    <MdAssignmentInd size={28} style={{ color: COLORS.secondary }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.primary, letterSpacing: ".01em" }}>
                      {m.name}
                    </div>
                    <div style={{
                      fontSize: 14, color: COLORS.accent,
                      margin: "2px 0 1px", fontWeight: 500, whiteSpace: "pre-line", wordBreak: "break-word"
                    }}>
                      {Array.isArray(m.skills) ? m.skills.join(", ") : m.skills}
                      {m.location && <> – <span style={{ color: "#555" }}>{m.location}</span></>}
                    </div>
                    {m.bio &&
                      <div style={{ color: "#665", fontSize: 13, marginBottom: 2 }}>
                        {m.bio}
                      </div>
                    }
                    <div style={{
                      color: "#458715", fontSize: 13, marginBottom: 3, fontWeight: 500
                    }}>
                      <b>Availability:</b> {m.available || m.availability || <span style={{ color: "#bbb" }}>Not specified</span>}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 1 }}>
                      <GreenButton
                        type="button"
                        style={{
                          fontSize: 15,
                          padding: "7px 23px",
                          background: COLORS.primary,
                          color: COLORS.textInverse,
                          boxShadow: "0 1px 3px #44af551c"
                        }}
                        onClick={() => {
                          setSelectMentor(m); setMessageText(""); setMsgStatus("");
                        }}
                        aria-label={`Message mentor ${m.name}`}
                      >
                        Message
                      </GreenButton>
                    </div>
                  </div>
                </div>
              </li>
            ))}
      </ul>
      {/* Direct Message Modal */}
      {selectMentor &&
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mentorModalTitle"
          tabIndex={-1}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "#113a1843", zIndex: 200, display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
          <div style={{
            background: "#fff",
            minWidth: 310, minHeight: 180,
            borderRadius: 20,
            boxShadow: "0 8px 32px #1c7c3534",
            padding: "34px 25px 28px 25px",
            maxWidth: 355,
            position: "relative",
            border: `1.5px solid #${COLORS.secondary.replace('#', '')}33`
          }}>
            <button
              aria-label="Close dialog"
              onClick={() => { setSelectMentor(null); setMsgStatus(""); setMessageText(""); }}
              style={{
                position: "absolute", right: 17, top: 17, background: "none",
                border: "none", fontSize: 25, color: "#7a8f73", cursor: "pointer", fontWeight: 700
              }}>
              ×
            </button>
            <div id="mentorModalTitle" style={{
              fontWeight: 800, fontSize: 20,
              color: COLORS.primary, marginBottom: 5, letterSpacing: ".01em"
            }}>
              Message {selectMentor.name}
            </div>
            <div style={{ fontSize: 14, color: "#444", marginBottom: 8 }}>
              <b>Topics:</b> {Array.isArray(selectMentor.skills) ? selectMentor.skills.join(", ") : selectMentor.skills}
            </div>
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={messageText}
                required
                onChange={e => setMessageText(e.target.value)}
                placeholder="Write your message here…"
                aria-label={`Message to ${selectMentor.name}`}
                style={{
                  width: "100%", borderRadius: 9,
                  border: `1.3px solid #${COLORS.accent.replace('#', '')}88`,
                  padding: "11px 11px",
                  fontSize: 15.5, marginBottom: 12, background: "#fbfaf7"
                }}
              />
              <GreenButton
                type="submit"
                style={{
                  fontWeight: 700, fontSize: 15.5, minWidth: 115, padding: "7px 19px",
                  background: COLORS.secondary, color: "#1a2630"
                }}
                aria-label={`Send message to ${selectMentor.name}`}
              >
                Send
              </GreenButton>
            </form>
            {msgStatus &&
              <div
                role="status"
                style={{
                  color: COLORS.success,
                  fontWeight: 700,
                  marginTop: 12,
                  marginBottom: -8,
                  fontSize: 15.5,
                  letterSpacing: ".01em"
                }}>
                <MdCheckCircle style={{
                  verticalAlign: "-12%",
                  color: COLORS.secondary,
                  marginRight: 6
                }} />
                {msgStatus}
              </div>
            }
          </div>
        </div>
      }
    </div>
  );
}

