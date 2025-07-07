import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { FormField } from "../components/FormField";
import { COLORS } from "../theme";
import {
  MdForum, MdChat, MdReply, MdEvent, MdGroup, MdAssignmentInd,
  MdWork, MdHowToReg, MdCheckCircle, MdArrowForward
} from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Community Ecosystem: Forums/message board (threads & replies),
 * Upcoming Events/Workshops, Registration UI, Mentorship matching form.
 * Aligned with dashboard card/eco style. In-page state and feedback (no popups).
 * Props: { user }
 */
const API_BASE = process.env.REACT_APP_API_BASE || ""; // e.g. "/api" or "" if same origin

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

// --- Fetch helpers --- //
async function fetchThreads(setError) {
  try {
    setError("");
    const resp = await fetch(apiUrl("/forums/threads"));
    if (!resp.ok) throw new Error("Failed to load threads");
    return await resp.json();
  } catch (e) {
    setError("Could not fetch topics/threads.");
    return [];
  }
}

async function fetchReplies(threadId, setError) {
  try {
    setError("");
    const resp = await fetch(apiUrl(`/forums/threads/${threadId}/replies`));
    if (!resp.ok) throw new Error("Failed to load replies");
    return await resp.json();
  } catch (e) {
    setError("Could not fetch replies for thread.");
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
          <div style={{ color: COLORS.error, fontWeight: 600, marginBottom: 9 }}>{forumError}</div>
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
        <Card style={{ background: "#f7fbfa" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 4
          }}>
            <MdEvent style={{ color: COLORS.secondary }} size={23} />
            <b style={{ color: COLORS.primary }}>Upcoming Events & Workshops</b>
          </div>
          <div style={{
            color: "#285c3c", marginBottom: 12, fontSize: 14.5
          }}>
            <b>Learn, share, and grow: </b>Workshops and local events for a circular economy.
            {/* In a real scenario, would also fetch from /events endpoint */}
          </div>
          {/* Demo static, recommend real integration */}
          <ul style={{ color: "#444", fontSize: 15, margin: "4px 0 0", paddingLeft: 15 }}>
            <li style={{ marginBottom: 7 }}>
              <b>Circularity DIY Repair Night</b> – Apr 18, 7:00pm <br />
              <span style={{ fontSize: 13, color: COLORS.accent }}>
                Hosted by Local Library (bring own items)
              </span>
            </li>
            <li style={{ marginBottom: 7 }}>
              <b>Product Reuse Exchange Fair</b> – May 5, 4:30pm <br />
              <span style={{ fontSize: 13, color: COLORS.accent }}>
                EcoCommunity Center (register early!)
              </span>
            </li>
            <li>
              <b>Mentorship & Career Workshop</b> – May 21, 6pm <br />
              <span style={{ fontSize: 13, color: COLORS.accent }}>
                With industry repair experts & green startups.
              </span>
            </li>
          </ul>
        </Card>
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
            Pair with another community member for learning, upskilling, or sharing experience. (Demo for now)
          </div>
          <div style={{
            fontSize: 14, padding: "7px 0", color: "#4d471b"
          }}>
            <MdAssignmentInd style={{ color: COLORS.secondary, marginRight: 5, fontSize: 18 }} />
            <b>Your mentor request is active!</b> (In production, a mentor/mentee recommendation card would appear here.)
          </div>
          <GreenButton
            style={{ fontSize: 13, marginTop: 6, padding: "7px 18px" }}
            disabled
          >
            Find Mentor / Become Mentor
          </GreenButton>
        </Card>
      </div>
    </div>
  );
}
