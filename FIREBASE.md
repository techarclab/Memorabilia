# Firebase setup

Fifteen minutes, once. Until you do it the site runs exactly as before —
the forms say plainly that nothing was sent, `/admin` explains what is
missing, and no Firebase code is downloaded at all.

---

## 1. Create the project

Firebase console → **Add project**. Analytics is optional and off by
default here.

Then **Build → Firestore Database → Create database**. Pick
**production mode** (locked down; the rules in this repo open exactly what
needs opening) and a region close to your buyers — `asia-south1` is
Mumbai.

## 2. Register the web app and copy the config

Project settings → **Your apps → Web (`</>`)**. Register it, and copy the
`firebaseConfig` values.

```bash
cp .env.example .env
```

Fill in `.env` with those six values, then restart `npm run dev`. The
console will stop saying Firebase is not configured.

`.env` is gitignored. That is tidiness, not secrecy — a Firebase web
config is public in every client bundle by design. **The rules are what
protect the data**, which is why step 3 is not optional.

## 3. Deploy the rules — do this before the site is public

`firestore.rules` in this repo is the whole security model.

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pick the project, alias it "default"
firebase deploy --only firestore:rules
```

What the rules do:

- **enquiries, orders** — anyone may create one and do nothing else. No
  reading, no editing, no deleting. Without this, anyone who found the
  project id could list every enquiry: who is buying, how many, at what
  budget. That is the most commercially sensitive data this business has.
- Every submitted field is checked for type and length, so the collection
  cannot be used as free file storage, and `status` and `createdAt` are
  pinned server-side so nobody can mark their own enquiry "won" or
  backdate it.
- Everything else is closed. Note there is nothing world-*readable* at
  all: the site publishes no prices and ships its whole catalogue in the
  bundle, so Firestore is write-only from the public side.

## 4. Make yourself an admin

Authentication → **Sign-in method** → enable **Email/Password**. Then
**Users → Add user** with your own email and a strong password.

Copy the **User UID** from that row. In Firestore, create a collection
`admins` with a document whose **ID is that UID**. The contents do not
matter; put `{ note: "Deepak" }` in it. The rules only check that the
document exists.

Now open `/admin` and sign in.

There is deliberately no sign-up anywhere in the app. Customers never
need an account, and revoking a colleague is deleting one row.

---

## What is deliberately not built yet

**Email notification.** Nothing emails the team when an enquiry lands —
someone has to open `/admin`. Sending mail needs a Cloud Function, and
Cloud Functions need the **Blaze** plan, because the free Spark plan
blocks outbound network calls. Blaze has a large free allowance and you
can set a budget cap, so this is a small step when you want it: the
"Trigger Email from Firestore" extension pointed at the `enquiries`
collection is the shortest path.

**Payments.** There is nothing to pay for. Memorabilia takes bulk orders
only, every one of them quoted against a brief, so the site collects the
brief and the team invoices against the agreed quote. There is no cart,
no checkout and no price on any page — adding a payment step would mean
first inventing a published price, which is exactly the thing that would
mislead a buyer.

**App Check.** The rules stop bad data, but they do not stop volume. If
the forms start attracting spam, App Check with reCAPTCHA v3 is the
answer, and it does not need code changes here.

---

## Cost

At this size, effectively nothing. Free tier is 50,000 document reads and
20,000 writes a day. The catalogue ships in the bundle and there is no
price document to fetch, so an ordinary visit costs **zero reads** and a
submitted enquiry costs **one write**. Only `/admin` reads, and only your
own team opens it.
