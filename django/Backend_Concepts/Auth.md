Here are your refined notes, cleaned up, completed, and structured for studying:

---

# Authentication & Tokens — Study Notes

---

## The Core Problem

HTTP is a **stateless protocol** — every request the server receives arrives with zero memory of anything before it. The server doesn't know if you're the same person who logged in 5 seconds ago or a complete stranger. All auth systems exist to solve this one problem.

---

## Part 1 — Stateful Authentication (Sessions)

### How it works

```
1. Login          → User sends email + password (called "credentials") to the server
2. Verify         → Server checks the DB: are these credentials correct?
3. Session        → Server creates a session object in its memory/DB and gives it a unique ID (session ID)
4. Cookie         → Server sends a cookie (a small text file) to the browser containing that session ID
5. Next request   → Browser automatically attaches the cookie on every future request
6. Lookup         → Server receives the session ID and looks it up in memory/DB to verify it's valid
7. Response       → Server sends back the requested data
```

### What's inside a cookie
- Name & value (the session ID itself)
- Expiration date
- Domain (which server this cookie belongs to)
- `httpOnly` flag (prevents JS from reading it — security)
- `Secure` flag (only sent over HTTPS)

### Why sessions became a problem
- **Memory/DB bloat** — with millions of users, storing a session per user per device fills up server memory fast and can crash it
- **Load balancer problem** — if you have multiple servers (A, B, C), Server A doesn't know about sessions created by Server B. You'd need a shared session store (like Redis) that all servers access, which adds complexity and becomes a single point of failure

---

## Part 2 — Stateless Authentication (Tokens / JWT)

### The key idea
The server stores **nothing**. Instead, it gives the user a token that contains all needed identity information, signed with a secret key. The user carries it and sends it with every request. The server just verifies the signature — no DB lookup required.

### How it works

```
1. Login          → User sends credentials to server
2. Verify         → Server checks DB: are credentials correct?
3. Token creation → Server creates two JWTs (access token + refresh token)
                    Each token = Header.Payload.Signature
4. Token handoff  → Server sends both tokens to the user (nothing stored on server)
5. Next request   → User sends request with JWT in the Authorization header:
                    "Authorization: Bearer <access_token>"
6. Validation     → Server verifies the cryptographic signature (no DB hit)
7. Response       → If signature valid → server sends requested data
```

### Anatomy of a JWT

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJ1c2VyX2lkIjo0MiwiZW1haWwiOiJhbGlAZXhhbXBsZS5jb20iLCJleHAiOjE3MTM5MTQ0MDB9
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Three parts separated by dots: `Header.Payload.Signature`

| Part | Contains | Notes |
|---|---|---|
| **Header** | Algorithm used (e.g. HS256) + type ("JWT") | Tells the server how to verify |
| **Payload** | User data: id, email, expiry timestamp | Base64-encoded, NOT encrypted — anyone can decode and read it |
| **Signature** | `HMAC(header + payload, SECRET_KEY)` | Only the server knows the secret key — tamper-proof seal |

> ⚠️ **Critical rule:** JWT is encoded, not encrypted. Anyone can decode the payload and read it. Never put passwords, secrets, or sensitive data inside a JWT. If anyone modifies the payload, the signature won't match and the server rejects it.

### Why two tokens?

| Token | Lifespan | Purpose |
|---|---|---|
| **Access token** | Short (5–15 min) | Sent with every API request. Short-lived to limit damage if leaked |
| **Refresh token** | Long (7 days) | Only used to get a new access token when it expires. Never sent to regular endpoints |

The reason for two: **you cannot invalidate a JWT once it's signed** — it's valid until expiry. So you keep the access token short-lived. Even if it's stolen, the attacker only has a 15-minute window. The refresh token lives longer but is used far less frequently and on one endpoint only.

---

## Part 3 — The Logout Problem (JWT's Main Weakness)

**Sessions:** Logout = delete the session row from DB. Instant. The session ID the user holds becomes meaningless immediately.

**JWT:** The token is self-validating. There's no row to delete. "Logout" has two levels:

| Level | What happens | Security |
|---|---|---|
| **Frontend logout** | React deletes tokens from localStorage. No more authenticated requests from this device | ❌ Token technically still valid until expiry if someone else has a copy |
| **True logout** | Token is added to a blacklist in DB/Redis. Every request checks the blacklist | ✅ Token immediately dead — but re-introduces a DB hit per request |

### The solution for production — Blacklist + httpOnly Cookie

Since this project is going to production, the right setup is:

1. **`djangorestframework-simplejwt`** with its built-in **blacklist app** — handles blacklisting revoked tokens in a DB table automatically
2. **httpOnly cookie** instead of localStorage — the token is stored in a cookie that JavaScript cannot read at all, making XSS attacks unable to steal it
3. **CSRF protection** added alongside (Django has this built in) — prevents malicious sites from using the cookie without your knowledge

```
localStorage   → Easy to use, vulnerable to XSS (JS can steal it)
httpOnly Cookie → JS cannot read it, immune to XSS, needs CSRF protection added
```

> For production: always httpOnly cookie + CSRF token. For a dev/university project: localStorage is acceptable.

---

## Part 4 — Authentication vs Authorization (never confuse these)

| | Authentication (AuthN) | Authorization (AuthZ) |
|---|---|---|
| **Question** | Who are you? | What are you allowed to do? |
| **When** | At login | On every protected action |
| **Example** | Email + password check | Can you delete this project? Is it yours? |
| **Passport analogy** | Passport check at the border | Customs deciding what you can bring in |

---

## Part 5 — How the Activation Email Fits In

This is separate from login auth — it's a one-time identity verification ceremony.

```
Registration  → Create user with is_activated = False
              → Generate signed token using Django's signing module (contains user PK + timestamp)
              → Email user: "yourapp.com/auth/activate/<token>/"
              → Record last_activation_sent = now()

Link clicked  → Server receives GET /auth/activate/<token>/
              → Verify token: is signature valid? is it within 24 hours?
              → If yes: set is_activated = True, joined_at = now()
              → If expired: return error, allow re-send (check last_activation_sent for cooldown)

Login attempt → Verify credentials → then check is_activated
before activation → If False: return 403 "Account not activated. Check your email."
```

---

## The Big Picture — Three Separate Concerns

```
1. Who are you?          → Registration + email activation (one-time ceremony)
2. Prove it every time   → JWT access token on every request (stateless, signature-verified)
3. What can you do?      → Authorization checks inside each endpoint (uses user_id from token)
```

Your role as Dev 1 covers concerns 1 and 2 entirely. Every other module in the project feeds from your User model and your token system.

---

These notes are complete. Whenever you're ready, we'll move to the implementation decisions.