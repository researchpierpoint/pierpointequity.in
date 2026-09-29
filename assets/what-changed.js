async function loadWhatChanged() {
  const root = document.querySelector("[data-what-changed]");
  if (!root) return;
  try {
    const res = await fetch("/data/public/what-changed.json", {cache:"no-store"});
    if (!res.ok) throw new Error("feed unavailable");
    const data = await res.json();
    root.innerHTML = data.items.map(item => `
      <article class="card">
        <p class="eyebrow">WHAT CHANGED</p>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <p class="muted">Evidence-backed research update · publication review required</p>
      </article>`).join("");
  } catch {
    root.innerHTML = '<article class="card"><p class="muted">What Changed is temporarily unavailable.</p></article>';
  }
}
document.addEventListener("DOMContentLoaded", loadWhatChanged);
