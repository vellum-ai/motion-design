import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import beckyAvatar from "./assets/becky.png";
import ashAvatar from "./assets/ash.jpg";
import marinaAvatar from "./assets/marina.jpg";
import villa1 from "./assets/villa1.jpg";
import villa2 from "./assets/villa2.jpg";
import villa3 from "./assets/villa3.jpg";
import dashboard from "./assets/dashboard.jpg";
import "./App.css";

type Villa = { img: string; name: string; meta: string };

type Message = {
  id: number;
  text: string;
  sender: "them" | "me" | "user";
  time: string;
  ghostType?: boolean;
  reactions?: string[];
  carousel?: Villa[];
  linkPreview?: {
    domain: string;
    title: string;
    img: string;
  };
};

const VILLAS: Villa[] = [
  { img: villa1, name: "Ponderosa Pines Estate", meta: "Sleeps 20 \u00B7 pool \u00B7 lakefront" },
  { img: villa2, name: "Emerald Bay Lookout", meta: "Sleeps 18 \u00B7 firepit \u00B7 views" },
  { img: villa3, name: "Tallac Timber Lodge", meta: "Sleeps 22 \u00B7 hot tub \u00B7 trails" },
];

const SCRIPT: Message[] = [
  {
    id: 1,
    text: "Hey Becky, Akash asked me to plan the offsite with you! I'll lookup the hotels, can you DM everyone for their preferences.",
    sender: "them",
    time: "8:32 PM",
  },
  {
    id: 2,
    text: "Let's do this!! I'll grab details about departure, diet, room pref... etc.",
    sender: "me",
    time: "8:32 PM",
    ghostType: true,
  },
  {
    id: 3,
    text: "Ok I found some nice places for us.",
    sender: "them",
    time: "8:34 PM",
    carousel: VILLAS,
  },
  {
    id: 4,
    text: "I gathered info from 8 people! Built a nice lil webpage to track everything!",
    sender: "me",
    time: "8:36 PM",
    ghostType: true,
    reactions: ["\uD83D\uDD25"],
    linkPreview: {
      domain: "offsite-tracker.vercel.app",
      title: "Vellum Team Offsite \u2014 Response Tracker",
      img: dashboard,
    },
  },
];

const V2_FINAL: Message = {
  id: 5,
  text: "Thanks both! You are awesome!!",
  sender: "user",
  time: "8:37 PM",
  ghostType: true,
  reactions: ["\uD83E\uDEF6", "\uD83C\uDF89"],
};

type KeyDef = { id: string; label: string; flex?: number };

const KEY_ROWS: KeyDef[][] = [
  "Q W E R T Y U I O P".split(" ").map((k) => ({ id: k.toLowerCase(), label: k })),
  "A S D F G H J K L".split(" ").map((k) => ({ id: k.toLowerCase(), label: k })),
  [
    { id: "shift", label: "\u21E7", flex: 1.4 },
    ...("Z X C V B N M".split(" ").map((k) => ({ id: k.toLowerCase(), label: k }))),
    { id: "delete", label: "\u232B", flex: 1.4 },
  ],
  [
    { id: "123", label: "123", flex: 1.3 },
    { id: "emoji", label: "\uD83D\uDE00", flex: 1 },
    { id: "space", label: "", flex: 4.5 },
    { id: "return", label: "\u23CE", flex: 1.6 },
  ],
];

function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-time">8:32</span>
      <div className="status-icons">
        <span className="signal-dot" />
        <span className="signal-dot" />
        <span className="signal-dot" />
        <span className="signal-dot dim" />
        <span className="battery">93%</span>
      </div>
    </div>
  );
}

function SlackHeader() {
  return (
    <div className="slack-header">
      <motion.div
        className="header-circle"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="back-chevron">{"\u2039"}</span>
      </motion.div>
      <motion.div
        className="header-pill"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <span className="header-hash">#</span>
        <div className="header-pill-text">
          <span className="header-channel">offsite-planning</span>
          <span className="header-meta">2 members {"\u2022"} 3 tabs</span>
        </div>
      </motion.div>
      <motion.div
        className="header-right"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="header-circle">
          <span className="header-icon">{"\uD83C\uDFA7"}</span>
        </div>
      </motion.div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <motion.div
      className="date-divider"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <span className="date-pill">{label}</span>
      <div className="date-line" />
    </motion.div>
  );
}

function Avatar({ sender }: { sender: "them" | "me" | "user" }) {
  const src =
    sender === "me" ? beckyAvatar : sender === "user" ? marinaAvatar : ashAvatar;
  const alt = sender === "me" ? "becky" : sender === "user" ? "marina" : "ash";
  return <img className="msg-avatar" src={src} alt={alt} />;
}

function VillaCarousel({ villas }: { villas: Villa[] }) {
  return (
    <div className="carousel">
      {villas.map((villa, i) => (
        <motion.div
          className="carousel-card"
          key={villa.name}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.3 + i * 0.18,
            type: "spring",
            stiffness: 260,
            damping: 24,
          }}
        >
          <img className="carousel-img" src={villa.img} alt={villa.name} />
          <div className="carousel-info">
            <span className="carousel-name">{villa.name}</span>
            <span className="carousel-meta">{villa.meta}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function LinkPreview({
  preview,
}: {
  preview: NonNullable<Message["linkPreview"]>;
}) {
  return (
    <motion.div
      className="link-preview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, type: "spring", stiffness: 280, damping: 26 }}
    >
      <div className="link-bar" />
      <div className="link-content">
        <span className="link-domain">{preview.domain}</span>
        <span className="link-title">{preview.title}</span>
        <img className="link-img" src={preview.img} alt="preview" />
      </div>
    </motion.div>
  );
}

function MessageRow({
  message,
  isFirstFromSender,
}: {
  message: Message;
  isFirstFromSender: boolean;
}) {
  const senderName =
    message.sender === "me"
      ? "becky"
      : message.sender === "user"
        ? "marina"
        : "ash";
  return (
    <motion.div
      className={`slack-message ${isFirstFromSender ? "first" : "grouped"}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      <div className="msg-avatar-slot">
        {isFirstFromSender && <Avatar sender={message.sender} />}
      </div>
      <div className="msg-content">
        {isFirstFromSender && (
          <div className="msg-header">
            <span className="msg-sender">{senderName}</span>
            <span className="msg-time">{message.time}</span>
          </div>
        )}
        <span className="msg-text">{message.text}</span>
        {message.carousel && <VillaCarousel villas={message.carousel} />}
        {message.linkPreview && <LinkPreview preview={message.linkPreview} />}
        {message.reactions && (
          <div className="msg-reactions">
            {message.reactions.map((emoji, i) => (
              <motion.span
                key={emoji}
                className="reaction-pill"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + i * 0.55,
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                }}
              >
                {emoji} <span className="reaction-count">1</span>
              </motion.span>
            ))}

          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      className="slack-message first"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
    >
      <div className="msg-avatar-slot">
        <Avatar sender="them" />
      </div>
      <div className="msg-content">
        <div className="msg-header">
          <span className="msg-sender">ash</span>
          <span className="msg-typing-label">is typing</span>
        </div>
        <div className="typing-dots">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="typing-dot"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function InputCard({
  typedText,
  sendPressed,
}: {
  typedText: string;
  sendPressed: boolean;
}) {
  return (
    <div className="input-card">
      <div className={`input-text ${typedText ? "has-text" : ""}`}>
        {typedText ? (
          <>
            <span className="input-typed">{typedText}</span>
            <span className="input-caret" />
          </>
        ) : (
          <>
            <span className="input-caret" />
            Message #offsite-planning
          </>
        )}
      </div>
      <div className="input-icon-row">
        <div className="input-icon plus-circle">+</div>
        <div className="input-icon icon-aa">Aa</div>
        <div className="input-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" strokeLinecap="round" />
            <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div className="input-icon icon-at">@</div>
        <div className="input-icon slash-box">/</div>
        <div className="input-spacer" />
        <motion.div
          className={`input-send ${typedText ? "active" : ""}`}
          animate={sendPressed ? { scale: 0.8 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 20l19-8L3 4v6l13 2-13 2v6z" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function Keyboard({ activeKey }: { activeKey: string | null }) {
  return (
    <motion.div
      className="keyboard"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      <div className="keyboard-inner">
        {KEY_ROWS.map((row, rowIdx) => (
          <div className="key-row" key={rowIdx}>
            {row.map((key) => {
              const isActive = activeKey === key.id;
              const isSpecial = ["shift", "delete", "123", "emoji", "return"].includes(key.id);
              return (
                <div
                  className={`key ${isSpecial ? "key-special" : "key-letter"} ${isActive ? "key-active" : ""}`}
                  key={key.id}
                  style={{ flex: key.flex || 1 }}
                >
                  {key.label}
                </div>
              );
            })}
          </div>
        ))}
        <div className="keyboard-bottom-row">
          <span className="kb-globe">{"\uD83C\uDF10"}</span>
          <span className="kb-mic">{"\uD83C\uDF99"}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function App({ ghostTyping = true }: { ghostTyping?: boolean }) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [sendPressed, setSendPressed] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const script = ghostTyping
    ? SCRIPT
    : [...SCRIPT.map((m) => ({ ...m, ghostType: false })), V2_FINAL];

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const run = async () => {
      await sleep(1000);

      while (!cancelled) {
        setVisibleMessages([]);
        setTypedText("");
        setIsTyping(false);
        setKeyboardVisible(false);

        await sleep(500);

        for (const msg of script) {
          if (cancelled) return;

          if (msg.ghostType) {
            setKeyboardVisible(true);
            await sleep(600);

            for (const char of msg.text) {
              if (cancelled) return;
              const keyId = char === " " ? "space" : char.toLowerCase();
              setActiveKey(keyId);
              setTypedText((prev) => prev + char);
              await sleep(14);
              setActiveKey(null);
              await sleep(6);
            }

            await sleep(500);
            setSendPressed(true);
            await sleep(180);
            setSendPressed(false);
            setVisibleMessages((prev) => [...prev, msg]);
            setTypedText("");
            await sleep(300);
            setKeyboardVisible(false);
            // extra beat if the message carries rich content
            await sleep(msg.linkPreview || msg.carousel ? 1200 : 450);
          } else if (msg.sender === "them") {
            setIsTyping(true);
            await sleep(1100 + Math.random() * 400);
            if (cancelled) return;
            setIsTyping(false);
            setVisibleMessages((prev) => [...prev, msg]);
            // extra beat so the carousel can stagger in
            await sleep(msg.carousel ? 1600 : 600);
          } else {
            await sleep(300);
            setVisibleMessages((prev) => [...prev, msg]);
            await sleep(msg.linkPreview || msg.carousel ? 1400 : 700);
          }
        }

        await sleep(4000);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleMessages, isTyping, keyboardVisible, typedText]);

  const getIsFirst = (index: number) => {
    if (index === 0) return true;
    const prev = visibleMessages[index - 1];
    const curr = visibleMessages[index];
    return prev.sender !== curr.sender;
  };

  return (
    <div className="app-bg">
      <motion.div
        className="phone-frame"
        initial={{ opacity: 0, y: 40, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="phone-notch" />
        <div className="phone-screen">
          <StatusBar />
          <SlackHeader />
          <div className="chat-body" ref={chatRef}>
            <DateDivider label="Today" />
            <AnimatePresence mode="popLayout">
              {visibleMessages.map((msg, i) => (
                <MessageRow
                  key={msg.id}
                  message={msg}
                  isFirstFromSender={getIsFirst(i)}
                />
              ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator key="typing" />}
          </div>
          <div className="input-area">
            <InputCard typedText={typedText} sendPressed={sendPressed} />
          </div>
          <AnimatePresence>
            {keyboardVisible && <Keyboard activeKey={activeKey} key="keyboard" />}
          </AnimatePresence>
          {!keyboardVisible && <div className="home-indicator" />}
        </div>
      </motion.div>
    </div>
  );
}
