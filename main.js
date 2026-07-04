const CATEGORY_LABELS = {
  daily: "Daily",
  frontend: "Frontend",
  javascript: "JavaScript",
  react: "React",
  nextjs: "Next.js",
  troubleshooting: "Troubleshooting",
  algorithm: "Algorithm",
  cs: "Computer Science",
  projects: "Projects",
};

const CATEGORY_ORDER = [
  "daily",
  "frontend",
  "javascript",
  "react",
  "nextjs",
  "troubleshooting",
  "algorithm",
  "cs",
  "projects",
];

const state = {
  posts: [],
  filteredPosts: [],
  collapsedCategories: new Set(
    JSON.parse(localStorage.getItem("dev-journal-collapsed") || "[]"),
  ),
};

const elements = {
  sidebar: document.querySelector("#sidebar"),
  backdrop: document.querySelector("#backdrop"),
  menuToggle: document.querySelector("#menuToggle"),
  closeSidebar: document.querySelector("#closeSidebar"),
  categoryNav: document.querySelector("#categoryNav"),
  searchInput: document.querySelector("#searchInput"),
  themeToggle: document.querySelector("#themeToggle"),
  homeView: document.querySelector("#homeView"),
  postView: document.querySelector("#postView"),
  errorView: document.querySelector("#errorView"),
  recentPosts: document.querySelector("#recentPosts"),
  postCount: document.querySelector("#postCount"),
  stats: document.querySelector("#stats"),
  content: document.querySelector("#content"),
  breadcrumb: document.querySelector("#breadcrumb"),
  postCategory: document.querySelector("#postCategory"),
  postDate: document.querySelector("#postDate"),
  postTitle: document.querySelector("#postTitle"),
  postTags: document.querySelector("#postTags"),
  markdownBody: document.querySelector("#markdownBody"),
};

marked.setOptions({
  gfm: true,
  breaks: false,
  highlight(code, language) {
    const validLanguage = language && hljs.getLanguage(language);
    return validLanguage
      ? hljs.highlight(code, { language }).value
      : hljs.highlightAuto(code).value;
  },
});

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("hashchange", handleRoute);

async function init() {
  applySavedTheme();
  bindEvents();
  renderIcons();

  try {
    const response = await fetch("./posts.json");
    if (!response.ok) throw new Error("posts.json load failed.");

    state.posts = await response.json();
    state.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    state.filteredPosts = [...state.posts];

    renderSidebar();
    renderHome();
    handleRoute();
  } catch (error) {
    console.error(error);
    showError();
  }
}

function bindEvents() {
  elements.menuToggle.addEventListener("click", openSidebar);
  elements.closeSidebar.addEventListener("click", closeSidebar);
  elements.backdrop.addEventListener("click", closeSidebar);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.searchInput.addEventListener("input", handleSearch);
  elements.categoryNav.addEventListener("click", handleCategoryToggle);
}

function renderSidebar() {
  const grouped = groupPostsByCategory(state.filteredPosts);

  elements.categoryNav.innerHTML = CATEGORY_ORDER.map((category) => {
    const posts = grouped[category] || [];
    const label = CATEGORY_LABELS[category] || category;
    const isCollapsed = state.collapsedCategories.has(category);

    return `
      <section class="category-group" data-category="${category}">
        <button
          class="category-title"
          type="button"
          data-category="${category}"
          aria-expanded="${!isCollapsed}"
          aria-controls="category-${category}"
        >
          <span class="category-label">
            <i class="category-chevron" data-lucide="chevron-right"></i>
            <i class="category-folder" data-lucide="folder"></i>
            <span>${label}</span>
          </span>
          <span class="category-count">${posts.length}</span>
        </button>
        ${
          posts.length
            ? `<ul class="post-list" id="category-${category}" ${isCollapsed ? "hidden" : ""}>
          ${posts.map(renderSidebarPost).join("")}
        </ul>`
            : ""
        }
        
      </section>
    `;
  }).join("");

  renderIcons();
}

function renderSidebarPost(post) {
  return `
    <li>
      <a class="post-link" href="#${encodeHashPath(post.path)}" data-path="${post.path}">
        <span class="post-link-title">
         ${escapeHtml(post.title)}
        </span>
        <small>${formatDate(post.date)}</small>
      </a>
    </li>
  `;
}

function renderHome() {
  const recent = state.filteredPosts.slice(0, 6);
  const categoryCount = new Set(state.posts.map((post) => post.category)).size;
  const tagCount = new Set(state.posts.flatMap((post) => post.tags || [])).size;

  elements.stats.innerHTML = `
    <div class="stat"><strong>${state.posts.length}</strong><span>문서</span></div>
    <div class="stat"><strong>${categoryCount}</strong><span>카테고리</span></div>
    <div class="stat"><strong>${tagCount}</strong><span>태그</span></div>
  `;
  elements.postCount.textContent = `${state.filteredPosts.length} pages`;
  elements.recentPosts.innerHTML = recent.map(renderPostCard).join("");
  renderIcons();
}

function renderPostCard(post) {
  const tags = (post.tags || [])
    .slice(0, 3)
    .map((tag) => `#${tag}`)
    .join(" ");

  return `
    <a class="post-card" href="#${encodeHashPath(post.path)}">
      <div>
        <p>${CATEGORY_LABELS[post.category] || post.category}</p>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(tags)}</p>
      </div>
      <div class="card-meta">
        <span>${formatDate(post.date)}</span>
      </div>
    </a>
  `;
}

async function handleRoute() {
  const path = decodeHashPath(location.hash);

  if (!path) {
    setActiveLink("");
    showHome();
    return;
  }

  const post = state.posts.find((item) => item.path === path);
  if (!post) {
    showError();
    return;
  }

  if (state.collapsedCategories.has(post.category)) {
    state.collapsedCategories.delete(post.category);
    saveCollapsedCategories();
    renderSidebar();
  }

  await loadPost(post);
}

async function loadPost(post) {
  try {
    const response = await fetch(`./${post.path}`);
    if (!response.ok) throw new Error(`${post.path} load failed.`);

    const markdown = await response.text();
    elements.breadcrumb.innerHTML = `<a href="./">Home</a> / ${CATEGORY_LABELS[post.category] || post.category}`;
    elements.postCategory.textContent =
      CATEGORY_LABELS[post.category] || post.category;
    elements.postDate.textContent = formatDate(post.date);
    elements.postTitle.textContent = post.title;
    elements.postTags.innerHTML = (post.tags || [])
      .map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
      .join("");
    elements.markdownBody.innerHTML = marked.parse(markdown);
    removeDuplicateMarkdownTitle(post.title);
    elements.markdownBody
      .querySelectorAll("pre code")
      .forEach((block) => hljs.highlightElement(block));

    setActiveLink(post.path);
    showPost();
    closeSidebar();
    elements.content.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error(error);
    showError();
  }
}

function handleCategoryToggle(event) {
  const button = event.target.closest(".category-title");
  if (!button) return;

  const category = button.dataset.category;
  if (state.collapsedCategories.has(category)) {
    state.collapsedCategories.delete(category);
  } else {
    state.collapsedCategories.add(category);
  }

  saveCollapsedCategories();
  renderSidebar();
  setActiveLink(decodeHashPath(location.hash));
}

function handleSearch(event) {
  const keyword = event.target.value.trim().toLowerCase();

  state.filteredPosts = keyword
    ? state.posts.filter((post) => {
        const haystack = [
          post.title,
          post.category,
          post.date,
          ...(post.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(keyword);
      })
    : [...state.posts];

  renderSidebar();
  renderHome();
  setActiveLink(decodeHashPath(location.hash));
}

function groupPostsByCategory(posts) {
  return posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});
}

function showHome() {
  elements.homeView.classList.remove("hidden");
  elements.postView.classList.add("hidden");
  elements.errorView.classList.add("hidden");
}

function showPost() {
  elements.homeView.classList.add("hidden");
  elements.postView.classList.remove("hidden");
  elements.errorView.classList.add("hidden");
}

function showError() {
  elements.homeView.classList.add("hidden");
  elements.postView.classList.add("hidden");
  elements.errorView.classList.remove("hidden");
}

function setActiveLink(path) {
  document.querySelectorAll(".post-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.path === path);
  });
}

function openSidebar() {
  elements.sidebar.classList.add("open");
  elements.backdrop.hidden = false;
}

function closeSidebar() {
  elements.sidebar.classList.remove("open");
  elements.backdrop.hidden = true;
}

function toggleTheme() {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("dev-journal-theme", nextTheme);
  updateThemeButton(nextTheme);
}

function applySavedTheme() {
  const savedTheme =
    localStorage.getItem("dev-journal-theme") ||
    localStorage.getItem("til-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");

  document.documentElement.dataset.theme = theme;
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const isDark = theme === "dark";
  const icon = isDark ? "sun" : "moon";
  const label = isDark ? "라이트 모드" : "다크 모드";

  elements.themeToggle.setAttribute("aria-label", `${label}로 전환`);
  elements.themeToggle.innerHTML = `
    <i id="themeIcon" data-lucide="${icon}" aria-hidden="true"></i>
    <span>${label}</span>
  `;
  renderIcons();
}

function removeDuplicateMarkdownTitle(title) {
  const firstElement = elements.markdownBody.firstElementChild;
  if (!firstElement || firstElement.tagName !== "H1") return;

  if (normalizeTitle(firstElement.textContent) === normalizeTitle(title)) {
    firstElement.remove();
  }
}

function normalizeTitle(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function saveCollapsedCategories() {
  localStorage.setItem(
    "dev-journal-collapsed",
    JSON.stringify([...state.collapsedCategories]),
  );
}

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }
}

function encodeHashPath(path) {
  return encodeURIComponent(path);
}

function decodeHashPath(hash) {
  return decodeURIComponent(hash.replace(/^#/, ""));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
