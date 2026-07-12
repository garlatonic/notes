const CATEGORY_LABELS = {
  daily: "TIL",
  frontend: "Frontend",
  javascript: "JavaScript",
  react: "React",
  nextjs: "Next.js",
  troubleshooting: "트러블슈팅",
  algorithm: "알고리즘",
  cs: "Computer Science",
  projects: "프로젝트",
  "live-coding": "라이브 코딩",
  "coding-test": "코딩 테스트",
  shopify: "Shopify",
};

const CATEGORY_ORDER = [
  "daily",
  "frontend",
  "javascript",
  "react",
  "nextjs",
  "cs",
  "projects",
  "troubleshooting",
  "algorithm",
  "live-coding",
  "coding-test",
  "shopify",
];

const MIN_SKELETON_DURATION_MS = 150;

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
  const loadingStartedAt = Date.now();

  applySavedTheme();
  bindEvents();
  renderIcons();
  renderSidebarSkeleton();
  renderHomeSkeleton();
  setLoadingState(true);
  showHome();

  try {
    const response = await fetch("./posts.json");
    if (!response.ok) throw new Error("posts.json load failed.");

    state.posts = await response.json();
    state.filteredPosts = [...state.posts];

    await ensureMinimumSkeletonDuration(loadingStartedAt);

    renderSidebar();
    renderHome();
    setLoadingState(false);
    handleRoute();
  } catch (error) {
    console.error(error);
    await ensureMinimumSkeletonDuration(loadingStartedAt);
    setLoadingState(false);
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
  const recent = state.filteredPosts.slice(-12).reverse();
  const categoryCount = new Set(state.posts.map((post) => post.category)).size;
  const tagCount = new Set(state.posts.flatMap((post) => post.tags || [])).size;

  elements.stats.innerHTML = `
    <div class="stat"><strong>${state.posts.length}</strong><span>문서</span></div>
    <div class="stat"><strong>${categoryCount}</strong><span>카테고리</span></div>
    <div class="stat"><strong>${tagCount}</strong><span>태그</span></div>
  `;
  elements.postCount.textContent = `${state.filteredPosts.length} pages`;
  elements.recentPosts.innerHTML = recent.length
    ? recent.map(renderPostCard).join("")
    : `<p class="empty-card">검색 결과가 없습니다.</p>`;
  renderIcons();
}

function renderPostCard(post) {
  const tags = (post.tags || []).slice(0, 3);
  const category = CATEGORY_LABELS[post.category] || post.category;

  return `
    <a class="post-card" href="#${encodeHashPath(post.path)}">
      <div class="post-card-head">
        <span class="card-category">${escapeHtml(category)}</span>
        <span class="card-date">${formatDate(post.date)}</span>
      </div>
      <div class="post-card-body">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(tags.map((tag) => `#${tag}`).join(" ") || "#untagged")}</p>
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
  const loadingStartedAt = Date.now();

  try {
    renderPostSkeleton();
    showPost();

    const response = await fetch(`./${post.path}`);
    if (!response.ok) throw new Error(`${post.path} load failed.`);

    const markdown = await response.text();
    const renderedMarkdown = marked.parse(markdown);

    await ensureMinimumSkeletonDuration(loadingStartedAt);

    elements.breadcrumb.innerHTML = `<a href="./">Home</a> / ${CATEGORY_LABELS[post.category] || post.category}`;
    elements.postCategory.textContent =
      CATEGORY_LABELS[post.category] || post.category;
    elements.postDate.textContent = formatDate(post.date);
    elements.postTitle.textContent = post.title;
    elements.postTags.innerHTML = (post.tags || [])
      .map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
      .join("");
    elements.markdownBody.innerHTML = renderedMarkdown;
    removeDuplicateMarkdownTitle(post.title);
    transformMarkdownInternalLinks(post);
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
    await ensureMinimumSkeletonDuration(loadingStartedAt);
    showError();
  }
}

function renderHomeSkeleton() {
  elements.stats.innerHTML = `
    <div class="stat stat-skeleton"><span class="skeleton-line w-40 h-6"></span><span class="skeleton-line w-50 h-3 mt-4"></span></div>
    <div class="stat stat-skeleton"><span class="skeleton-line w-40 h-6"></span><span class="skeleton-line w-50 h-3 mt-4"></span></div>
    <div class="stat stat-skeleton"><span class="skeleton-line w-40 h-6"></span><span class="skeleton-line w-50 h-3 mt-4"></span></div>
  `;
  elements.postCount.textContent = "로딩 중...";
  elements.recentPosts.innerHTML = Array.from(
    { length: 6 },
    () => `
      <div class="post-card post-card-skeleton" aria-hidden="true">
        <div class="post-card-head">
          <span class="skeleton-line w-30 h-6 rounded-full"></span>
          <span class="skeleton-line w-30 h-4"></span>
        </div>
        <div class="post-card-body">
          <span class="skeleton-line w-90 h-6"></span>
          <span class="skeleton-line w-50 h-4 mt-10"></span>
        </div>
      </div>
    `,
  ).join("");
}

function renderSidebarSkeleton() {
  elements.categoryNav.innerHTML = Array.from(
    { length: 6 },
    () => `
    <section class="category-group sidebar-skeleton-group" aria-hidden="true">
      <div class="category-title-skeleton">
        <span class="skeleton-line w-55 h-4"></span>
        <span class="skeleton-line w-18 h-4"></span>
      </div>
      <div class="post-list-skeleton">
        <span class="skeleton-line w-82 h-4"></span>
        <span class="skeleton-line w-75 h-4"></span>
      </div>
    </section>
  `,
  ).join("");
}

function setLoadingState(isLoading) {
  elements.searchInput.disabled = isLoading;
  elements.searchInput.setAttribute("aria-busy", String(isLoading));
  elements.content.setAttribute("aria-busy", String(isLoading));
}

function renderPostSkeleton() {
  elements.breadcrumb.innerHTML =
    '<span class="skeleton-line w-30 h-4"></span>';
  elements.postCategory.innerHTML =
    '<span class="skeleton-line w-24 h-4"></span>';
  elements.postDate.innerHTML = '<span class="skeleton-line w-18 h-4"></span>';
  elements.postTitle.innerHTML = '<span class="skeleton-line w-70 h-6"></span>';
  elements.postTags.innerHTML = `
    <span class="tag tag-skeleton"></span>
    <span class="tag tag-skeleton"></span>
    <span class="tag tag-skeleton"></span>
  `;
  elements.markdownBody.innerHTML = `
    <div class="markdown-skeleton" aria-hidden="true">
      <span class="skeleton-line w-95 h-4"></span>
      <span class="skeleton-line w-90 h-4"></span>
      <span class="skeleton-line w-82 h-4"></span>
      <span class="skeleton-line w-88 h-4"></span>
      <span class="skeleton-line w-68 h-4"></span>
      <span class="skeleton-block"></span>
      <span class="skeleton-line w-92 h-4"></span>
      <span class="skeleton-line w-78 h-4"></span>
    </div>
  `;
}

function transformMarkdownInternalLinks(currentPost) {
  const anchors = elements.markdownBody.querySelectorAll("a[href]");

  anchors.forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    const resolvedPath = resolveMarkdownPath(href, currentPost.path);
    if (!resolvedPath) return;

    const linkedPost = state.posts.find((post) => post.path === resolvedPath);
    if (!linkedPost) {
      anchor.setAttribute("href", `#${encodeHashPath(resolvedPath)}`);
      return;
    }

    const card = createInlinePostCard(linkedPost);
    const parent = anchor.parentElement;
    const shouldReplaceParagraph =
      parent &&
      parent.tagName === "P" &&
      parent.childElementCount === 1 &&
      parent.textContent.trim() === anchor.textContent.trim();

    if (shouldReplaceParagraph) {
      parent.replaceWith(card);
      return;
    }

    anchor.replaceWith(card);
  });
}

function createInlinePostCard(post) {
  const card = document.createElement("a");
  const category = CATEGORY_LABELS[post.category] || post.category;
  const tags = (post.tags || []).map((tag) => `#${tag}`).join(" ");

  card.className = "inline-post-card";
  card.href = `#${encodeHashPath(post.path)}`;
  card.innerHTML = `
    <span class="inline-post-card-head">
      <span class="inline-post-card-category">${escapeHtml(category)}</span>
      <span class="inline-post-card-date">${formatDate(post.date)}</span>
    </span>
    <strong class="inline-post-card-title">${escapeHtml(post.title)}</strong>
    <span class="inline-post-card-tags">${escapeHtml(tags || "#untagged")}</span>
  `;

  return card;
}

function resolveMarkdownPath(href, currentPath) {
  if (!href) return "";

  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return "";

  const [target] = trimmed.split(/[?#]/);
  if (!target || !target.toLowerCase().endsWith(".md")) return "";

  const currentDir =
    currentPath.lastIndexOf("/") >= 0
      ? currentPath.slice(0, currentPath.lastIndexOf("/") + 1)
      : "";
  const resolved = new URL(target, `https://local/${currentDir}`).pathname;

  return decodeURIComponent(resolved).replace(/^\/+/, "");
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
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  elements.sidebar.classList.remove("open");
  elements.backdrop.hidden = true;
  document.body.style.overflow = "";
}

function toggleTheme() {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  updateThemeButton(nextTheme);
}

function applySavedTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = prefersDark ? "dark" : "light";

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

async function ensureMinimumSkeletonDuration(startedAt) {
  const elapsed = Date.now() - startedAt;
  const remaining = MIN_SKELETON_DURATION_MS - elapsed;
  if (remaining > 0) {
    await wait(remaining);
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
