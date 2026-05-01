/* ---------------- NAVBAR ---------------- */

nav {
  background: var(--primary);
  padding: 12px 20px;
  color: white;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgba(0,0,0,0.1);
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.05rem;
  transition: 0.2s ease;
}

nav a:hover {
  color: #dce9ff;
  text-decoration: underline;
}

/* Mobile */
@media (max-width: 600px) {
  nav {
    flex-direction: column;
    gap: 10px;
  }
}