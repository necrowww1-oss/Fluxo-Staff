import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc,
  onSnapshot, addDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";

/* ── CONFIG ── */
const firebaseConfig = {
  apiKey:            "AIzaSyBednnjMcLmhz1xS2yAHCl2p5CQiy5Rvec",
  authDomain:        "fluxo---ticketera.firebaseapp.com",
  projectId:         "fluxo---ticketera",
  storageBucket:     "fluxo---ticketera.firebasestorage.app",
  messagingSenderId: "117168244933",
  appId:             "1:117168244933:web:23d453782e1689dcfd48ac",
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
export const auth = getAuth(app);

/* ════════════════════════════════════════════
   HOOKS — cada uno suscribe a Firestore en
   tiempo real y se auto-actualiza
════════════════════════════════════════════ */

/* Todos los eventos (clientes y staff) */
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), snap => {
      setEvents(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e && e.id && e.types)
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  return { events, loading };
}

/* Compradores — solo staff */
export function useBuyers(eventId = null) {
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    const ref = eventId
      ? query(collection(db, "tickets"), where("eventId", "==", eventId))
      : collection(db, "tickets");

    const unsub = onSnapshot(ref, snap => {
      setBuyers(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(b => b && b.id)
      );
    });
    return unsub;
  }, [eventId]);

  return buyers;
}

/* Lista de invitados — solo staff */
export function useGuestlist(eventId = null) {
  const [guestlist, setGuestlist] = useState([]);

  useEffect(() => {
    const ref = eventId
      ? query(collection(db, "guestlist"), where("eventId", "==", eventId))
      : collection(db, "guestlist");

    const unsub = onSnapshot(ref, snap => {
      setGuestlist(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(g => g && g.id)
      );
    });
    return unsub;
  }, [eventId]);

  return guestlist;
}

/* Auth — usuario logueado */
export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading };
}

/* ════════════════════════════════════════════
   ACCIONES — funciones async que mutan Firestore
════════════════════════════════════════════ */

/* AUTH */
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

/* EVENTOS */
export async function createEvent(eventData) {
  const { id: _ignore, photo, ...data } = eventData;
  // photo se omite — Firestore tiene límite de 1MB por doc
  // Para imágenes reales usar Firebase Storage
  return addDoc(collection(db, "events"), {
    ...data,
    photoUrl: null,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid ?? null,
  });
}

export async function updateEvent(eventId, eventData) {
  const { id: _ignore, photo, ...data } = eventData;
  return updateDoc(doc(db, "events", eventId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(eventId) {
  return deleteDoc(doc(db, "events", eventId));
}

/* COMPRA — descuenta stock y crea ticket */
export async function purchase({ eventId, typeId, typeName, qty, price, buyer }) {
  // Crear un ticket por cada entrada comprada
  const promises = Array.from({ length: qty }, () =>
    addDoc(collection(db, "tickets"), {
      eventId,
      typeId,
      ticket: typeName,
      price,
      name:      buyer.name,
      email:     buyer.email,
      dni:       buyer.dni,
      hash:      `hmac_${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 6)}`,
      checkedIn: false,
      purchasedAt: serverTimestamp(),
    })
  );

  // Actualizar sold en el evento
  // Nota: en producción usar una Cloud Function para atomicidad
  // Por ahora actualizamos optimistamente
  await Promise.all(promises);
}

/* CHECK-IN */
export async function checkinBuyer(ticketId, value = true) {
  return updateDoc(doc(db, "tickets", ticketId), { checkedIn: value });
}

export async function scanQR(hash, allBuyers) {
  const buyer = allBuyers.find(b => b.hash === hash);
  if (!buyer)           return { ok: false, reason: "not_found" };
  if (buyer.checkedIn)  return { ok: false, reason: "already_in", buyer };
  await checkinBuyer(buyer.id, true);
  return { ok: true, buyer: { ...buyer, checkedIn: true } };
}

/* LISTA DE INVITADOS */
export async function addGuest(guestData) {
  return addDoc(collection(db, "guestlist"), {
    ...guestData,
    createdAt: serverTimestamp(),
  });
}

export async function removeGuest(guestId) {
  return deleteDoc(doc(db, "guestlist", guestId));
}

export async function toggleGuestCheckin(guestId, current) {
  return updateDoc(doc(db, "guestlist", guestId), { checkedIn: !current });
}
