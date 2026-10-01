// ==========================================================================
// Isomorphic — Enterprise Conversational AI Platform
// Interactive Master Controller, HUD Engine & Router (v16.0)
// ==========================================================================

(function() {
    "use strict";

    // --------------------------------------------------------------------------
    // 1. Chatbot Widget Controller (HOMEPAGE ONLY)
    // --------------------------------------------------------------------------
    function isHomepage(path) {
        const clean = (path || window.location.pathname).split("/").pop().toLowerCase();
        return clean === "" || clean === "index.html" || clean === "index";
    }

    function syncChatbotVisibility(currentPath) {
        const onHome = isHomepage(currentPath);
        const existingScript = document.getElementById("isomorphic-chatbot-script");

        if (onHome) {
            // Inject chatbot script only on homepage if not present
            if (!existingScript) {
                const chatScript = document.createElement("script");
                chatScript.id = "isomorphic-chatbot-script";
                chatScript.src = "https://iso-chat.onrender.com/chatbot.js";
                chatScript.setAttribute("data-tenant-id", "onestop");
                chatScript.setAttribute("data-bot-id", "isobot");
                chatScript.async = true;
                document.body.appendChild(chatScript);
            }
            // Show any generated chatbot elements
            const widgets = document.querySelectorAll("[id*='chat'], [class*='chat-widget'], [class*='isobot'], [class*='isomorphic-chat']");
            widgets.forEach(el => {
                if (el.id !== "isomorphic-chatbot-script" && !el.classList.contains("highlight-card")) {
                    el.style.display = "";
                }
            });
        } else {
            // Remove / hide chatbot on all other pages
            if (existingScript) {
                existingScript.remove();
            }
            const widgets = document.querySelectorAll("[id*='chat'], [class*='chat-widget'], [class*='isobot'], [class*='isomorphic-chat']");
            widgets.forEach(el => {
                if (el.id !== "isomorphic-chatbot-script" && !el.classList.contains("highlight-card")) {
                    el.style.display = "none";
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // 2. Interactive Hero HUD AI Sandbox Controller
    // --------------------------------------------------------------------------
    const hudDemoData = {
        rag: {
            prompt: "What is your enterprise SLA and vector isolation guarantee?",
            output: "Isomorphic isolates 100% of client embeddings in dedicated tenant vector partitions. All answers are grounded deterministically in your proprietary documentation with verified URL & page citations. Zero data is shared or used for foundation model training.",
            citation: "📄 Verified Source: Security_Whitepaper_v4.pdf • Page 14 §2.1",
            latency: "⚡ Latency: 320ms • Confidence: 99.8%"
        },
        voice: {
            prompt: "Demonstrate voice STT dictation and real-time audio playback.",
            output: "Voice synthesis operational. Converting streaming audio frames into text via Whisper STT pipeline and returning natural neural voice responses with sub-second turnaround.",
            citation: "🎙️ Audio Engine: Neural TTS v2 • 24kHz Ultra-Low Latency",
            latency: "⚡ Latency: 410ms • STT Word Accuracy: 99.4%"
        },
        security: {
            prompt: "Audit PII redaction and deterministic hallucination guardrails.",
            output: "Automated Regex & NER PII filters detected 0 sensitive credentials. Model outputs bounded strictly to indexed corpus. Speculative answers blocked; user offered 1-click human advisor escalation.",
            citation: "🔒 Compliance: SOC2 Type II & HIPAA Boundary Guardrails Active",
            latency: "⚡ Latency: 290ms • Hallucination Risk: 0.00%"
        }
    };

    function initHeroHud() {
        const hudChips = document.querySelectorAll(".hud-chip");
        const promptEl = document.getElementById("hud-prompt-text");
        const outputEl = document.getElementById("hud-output-text");
        const citationEl = document.getElementById("hud-citation-text");
        const latencyEl = document.getElementById("hud-latency-text");
        const hudBody = document.querySelector(".hud-body");

        if (!hudChips.length || !outputEl) return;

        hudChips.forEach(chip => {
            chip.onclick = function() {
                const type = chip.getAttribute("data-hud");
                const data = hudDemoData[type];
                if (!data) return;

                hudChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");

                if (hudBody) {
                    hudBody.style.opacity = "0.35";
                    hudBody.style.transform = "translateY(4px)";
                }

                setTimeout(() => {
                    if (promptEl) promptEl.textContent = `"${data.prompt}"`;
                    if (outputEl) outputEl.textContent = data.output;
                    if (citationEl) citationEl.textContent = data.citation;
                    if (latencyEl) latencyEl.textContent = data.latency;

                    if (hudBody) {
                        hudBody.style.opacity = "1";
                        hudBody.style.transform = "translateY(0)";
                        hudBody.style.transition = "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
                    }
                }, 130);
            };
        });
    }

    // --------------------------------------------------------------------------
    // 3. Interactive Platform Tab Switcher
    // --------------------------------------------------------------------------
    window.switchShowcaseTab = function(targetTabId) {
        if (!targetTabId) return;

        const tabButtons = document.querySelectorAll(".showcase-tab-btn");
        const tabPanels = document.querySelectorAll(".showcase-tab-panel");

        tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute("data-tab") === targetTabId;
            btn.classList.toggle("active", isMatch);
            btn.setAttribute("aria-selected", isMatch ? "true" : "false");
        });

        tabPanels.forEach(panel => {
            const isMatch = panel.getAttribute("id") === targetTabId;
            panel.classList.toggle("active", isMatch);
            if (isMatch) {
                panel.style.setProperty("display", "block", "important");
            } else {
                panel.style.setProperty("display", "none", "important");
            }
        });
    };

    // --------------------------------------------------------------------------
    // 4. Scroll-Driven Reveal Engine (AOS) & Card Spotlights
    // --------------------------------------------------------------------------
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            "[data-reveal], .highlight-card, .solution-card, .service-card, .service-box, .security-card, .sec-item, .step-card, .founder-card, .preview-banner-card, .cta-banner-box, .faq-item, .contact-card, .screen-card, .feature-pill-card, .cb-feature-box"
        );

        revealElements.forEach(el => {
            if (!el.hasAttribute("data-reveal")) {
                el.setAttribute("data-reveal", "fade-up");
            }
            if (!el.classList.contains("stagger-set")) {
                const parent = el.parentElement;
                if (parent) {
                    const siblingIdx = Array.from(parent.children).indexOf(el);
                    if (siblingIdx >= 0) {
                        el.classList.add(`stagger-${(siblingIdx % 6) + 1}`);
                    }
                }
                el.classList.add("stagger-set");
            }
        });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-revealed");
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: "0px 0px -40px 0px",
                threshold: 0.06
            });

            revealElements.forEach(el => observer.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add("is-revealed"));
        }
    }

    function initSpotlightCards() {
        const cards = document.querySelectorAll(".spotlight-card, .highlight-card, .solution-card, .service-card, .security-card, .step-card, .founder-card, .preview-banner-card, .feature-pill-card, .screen-card, .contact-card");
        cards.forEach(card => {
            card.classList.add("spotlight-card");
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5. FAQ Accordion & Interactive Lightbox
    // --------------------------------------------------------------------------
    function initInteractiveComponents() {
        const faqQuestions = document.querySelectorAll(".faq-question");
        faqQuestions.forEach(btn => {
            btn.onclick = function() {
                const item = btn.closest(".faq-item");
                if (!item) return;
                const wasActive = item.classList.contains("active");
                document.querySelectorAll(".faq-item").forEach(other => other.classList.remove("active"));
                if (!wasActive) item.classList.add("active");
            };
        });

        const lightbox = document.getElementById("screenshot-lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxClose = document.getElementById("lightbox-close");
        const lightboxTitle = document.getElementById("lightbox-title");

        const zoomTargets = document.querySelectorAll(".zoomable-screenshot, .preview-banner-img, .showcase-panel-img-wrap img");
        zoomTargets.forEach(img => {
            img.style.cursor = "zoom-in";
            img.onclick = function(e) {
                e.stopPropagation();
                if (lightbox && lightboxImg) {
                    lightboxImg.src = img.src;
                    if (lightboxTitle) lightboxTitle.textContent = img.alt || "Isomorphic Platform Screenshot";
                    lightbox.classList.add("active");
                    lightbox.setAttribute("aria-hidden", "false");
                    document.body.style.overflow = "hidden";
                }
            };
        });

        // Contact Form Submission Handler
        const contactForm = document.getElementById("contact-form");
        const contactSuccess = document.getElementById("contact-success");
        if (contactForm) {
            contactForm.onsubmit = function(e) {
                e.preventDefault();
                contactForm.style.display = "none";
                if (contactSuccess) {
                    contactSuccess.style.display = "block";
                }
            };
        }

        // Zoom Hint Buttons (in Platform Showcase)
        const zoomBtns = document.querySelectorAll(".zoom-hint-btn");
        zoomBtns.forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const imgSrc = btn.getAttribute("data-img");
                const imgTitle = btn.getAttribute("data-title");
                if (lightbox && lightboxImg && imgSrc) {
                    lightboxImg.src = imgSrc;
                    if (lightboxTitle) lightboxTitle.textContent = imgTitle || "Platform Screenshot";
                    lightbox.classList.add("active");
                    lightbox.setAttribute("aria-hidden", "false");
                    document.body.style.overflow = "hidden";
                }
            };
        });

        if (lightboxClose && lightbox) {
            lightboxClose.onclick = function() {
                lightbox.classList.remove("active");
                lightbox.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
            };
            lightbox.onclick = function(e) {
                if (e.target === lightbox) {
                    lightbox.classList.remove("active");
                    lightbox.setAttribute("aria-hidden", "true");
                    document.body.style.overflow = "";
                }
            };
        }
    }

    // --------------------------------------------------------------------------
    // 6. SPA Router & Smooth Page Transitions
    // --------------------------------------------------------------------------
    function initRouter() {
        const pageContentEl = document.getElementById("page-content");
        const pulseLoader = document.createElement("div");
        pulseLoader.className = "page-transition-pulse";
        document.body.appendChild(pulseLoader);

        const pageCache = new Map();

        function updateActiveNav(path) {
            const cleanPath = path.split("/").pop() || "index.html";
            const navLinks = document.querySelectorAll(".nav-links a");
            navLinks.forEach(a => {
                const href = a.getAttribute("href") || "";
                const aClean = href.split("#")[0].split("/").pop() || "index.html";
                if (aClean === cleanPath || (cleanPath === "" && aClean === "index.html")) {
                    a.classList.add("nav-active");
                } else {
                    a.classList.remove("nav-active");
                }
            });
        }

        async function navigateTo(url, push = true) {
            if (!pageContentEl) {
                window.location.href = url;
                return;
            }

            const cleanUrl = url.split("#")[0];
            const hash = url.includes("#") ? "#" + url.split("#")[1] : "";

            try {
                pulseLoader.classList.remove("active");
                void pulseLoader.offsetWidth;
                pulseLoader.classList.add("active");

                pageContentEl.classList.remove("page-fade-in");
                pageContentEl.classList.add("page-fade-out");

                let htmlText = pageCache.get(cleanUrl);
                if (!htmlText) {
                    const response = await fetch(cleanUrl);
                    if (!response.ok) throw new Error("HTTP error " + response.status);
                    htmlText = await response.text();
                    pageCache.set(cleanUrl, htmlText);
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");
                const newMain = doc.getElementById("page-content") || doc.querySelector("main");

                if (!newMain) throw new Error("No main container found");

                await new Promise(r => setTimeout(r, 180));

                pageContentEl.innerHTML = newMain.innerHTML;
                if (doc.title) document.title = doc.title;

                if (push) {
                    history.pushState({ url: url }, "", url);
                }

                updateActiveNav(cleanUrl);
                syncChatbotVisibility(cleanUrl);

                if (hash) {
                    const targetEl = document.querySelector(hash);
                    if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
                    else window.scrollTo({ top: 0, behavior: "instant" });
                } else {
                    window.scrollTo({ top: 0, behavior: "instant" });
                }

                // Force reflow and trigger entrance
                pageContentEl.classList.remove("page-fade-out");
                void pageContentEl.offsetWidth;
                pageContentEl.classList.add("page-fade-in");

                initHeroHud();
                initScrollReveal();
                initSpotlightCards();
                initInteractiveComponents();

                const navLinksMenu = document.querySelector(".nav-links");
                if (navLinksMenu) navLinksMenu.classList.remove("active");

            } catch (err) {
                console.warn("Router fallback:", err);
                window.location.href = url;
            }
        }

        document.addEventListener("click", e => {
            const link = e.target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:") || link.target === "_blank") {
                return;
            }

            if (href.startsWith("#")) {
                e.preventDefault();
                const el = document.querySelector(href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
                return;
            }

            const isInternal = !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("//");
            if (isInternal) {
                e.preventDefault();
                navigateTo(href, true);
            }
        });

        window.addEventListener("popstate", e => {
            const url = (e.state && e.state.url) || window.location.pathname || "index.html";
            navigateTo(url, false);
        });
    }

    // --------------------------------------------------------------------------
    // 7. Global Scroll & Lifecycle Startup
    // --------------------------------------------------------------------------
    function initGlobalScroll() {
        const scrollBar = document.getElementById("scroll-progress");
        const navbar = document.getElementById("navbar");
        const backToTop = document.getElementById("back-to-top");
        const mobileToggle = document.querySelector(".mobile-menu-toggle");
        const navMenu = document.querySelector(".nav-links");

        window.addEventListener("scroll", () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

            if (scrollBar) scrollBar.style.width = `${scrolled}%`;
            if (navbar) navbar.classList.toggle("scrolled", winScroll > 25);
            if (backToTop) backToTop.classList.toggle("visible", winScroll > 380);
        }, { passive: true });

        if (backToTop) {
            backToTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (mobileToggle && navMenu) {
            mobileToggle.onclick = (e) => {
                e.stopPropagation();
                const isActive = navMenu.classList.toggle("active");
                mobileToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
            };

            // Close mobile menu when clicking any nav link
            navMenu.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", () => {
                    navMenu.classList.remove("active");
                    mobileToggle.setAttribute("aria-expanded", "false");
                });
            });

            // Close mobile menu when tapping anywhere outside
            document.addEventListener("click", (e) => {
                if (navMenu.classList.contains("active") && !navbar.contains(e.target)) {
                    navMenu.classList.remove("active");
                    mobileToggle.setAttribute("aria-expanded", "false");
                }
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        syncChatbotVisibility(window.location.pathname);
        initRouter();
        initGlobalScroll();
        initHeroHud();
        initScrollReveal();
        initSpotlightCards();
        initInteractiveComponents();
    });

})();
