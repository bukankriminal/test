export function scrollToSection(id: string, reduced = false) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}
