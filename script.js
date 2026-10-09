/**
 * ISOMORPHIC AI — Interactive Scripts & Animations
 * Powers Playground tabs, Audio simulators, Prompt runners, Code sandbox & Marquees
 * Implemented with Sarvam AI's fluid physics, cubic-bezier curves, and state machines
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
     1. SPECULAR CURSOR-FOLLOW ON BLUR BUTTONS
     ------------------------------------------------------------------------- */
  const blurButtons = document.querySelectorAll('.blur-btn');
  blurButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--gx', `${x}px`);
      btn.style.setProperty('--gy', `${y}px`);
    });
  });

  /* -------------------------------------------------------------------------
     1B. HERO MASCOT EYE TRACKING & 5-SECOND IDLE SACCADES
     ------------------------------------------------------------------------- */
  const heroMascot = document.getElementById('heroMascot');
  const pupilLeft = document.getElementById('mascotPupilLeft');
  const pupilRight = document.getElementById('mascotPupilRight');

  if (heroMascot && pupilLeft && pupilRight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isIdle = false;
    let idleTimer = null;
    let saccadeTimeout = null;
    let ticking = false;

    // Natural random gaze positions (normalized from -1 to 1)
    const naturalGlances = [
      { x: -0.85, y: -0.15 }, // Glance left
      { x: 0.90,  y: -0.10 }, // Glance right
      { x: 0.0,   y: 0.0   }, // Look straight ahead
      { x: -0.60, y: -0.55 }, // Look up-left
      { x: 0.65,  y: -0.50 }, // Look up-right
      { x: 0.0,   y: 0.0   }, // Rest center
      { x: 0.35,  y: 0.45  }, // Glance down-right
      { x: -0.40, y: 0.40  }, // Glance down-left
      { x: 0.0,   y: 0.0   }  // Rest center
    ];

    const applyEyeTo = (pupilEl, eyeX, eyeY, targetX, targetY, maxTravelX, maxTravelY) => {
      const dx = targetX - eyeX;
      const dy = targetY - eyeY;
      const dist = Math.hypot(dx, dy);

      if (dist < 1) {
        pupilEl.style.transform = 'translate(0px, 0px)';
        return;
      }

      const normX = dx / dist;
      const normY = dy / dist;
      const strength = Math.min(dist / 380, 1);

      const tx = normX * maxTravelX * strength;
      const ty = normY * maxTravelY * strength;
      pupilEl.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    };

    const updateHeroPupils = (targetX, targetY, isRandomGlance = false) => {
      const rect = heroMascot.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const maxTravelX = rect.width * 0.032;
      const maxTravelY = rect.height * 0.068;

      if (isRandomGlance) {
        const tx = targetX * maxTravelX;
        const ty = targetY * maxTravelY;
        pupilLeft.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        pupilRight.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        return;
      }

      const eye1X = rect.left + rect.width * 0.174;
      const eye1Y = rect.top + rect.height * 0.513;
      const eye2X = rect.left + rect.width * 0.839;
      const eye2Y = rect.top + rect.height * 0.515;

      applyEyeTo(pupilLeft, eye1X, eye1Y, targetX, targetY, maxTravelX, maxTravelY);
      applyEyeTo(pupilRight, eye2X, eye2Y, targetX, targetY, maxTravelX, maxTravelY);
    };

    const setPupilTransition = (transitionCss) => {
      pupilLeft.style.transition = transitionCss;
      pupilRight.style.transition = transitionCss;
    };

    const stopIdleMode = () => {
      if (isIdle) {
        isIdle = false;
        clearTimeout(saccadeTimeout);
        saccadeTimeout = null;
        setPupilTransition('transform 0.08s ease-out');
      }
    };

    const performRandomGlance = () => {
      if (!isIdle) return;
      const glance = naturalGlances[Math.floor(Math.random() * naturalGlances.length)];
      setPupilTransition('transform 0.28s cubic-bezier(0.2, 0.9, 0.4, 1.1)');
      updateHeroPupils(glance.x, glance.y, true);

      // Schedule next autonomous glance in 1.6s - 3.2s
      const nextDelay = Math.floor(Math.random() * 1600) + 1600;
      saccadeTimeout = setTimeout(performRandomGlance, nextDelay);
    };

    const startIdleMode = () => {
      isIdle = true;
      performRandomGlance();
    };

    const resetIdleTimer = () => {
      stopIdleMode();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(startIdleMode, 5000); // 5 seconds of inactivity
    };

    // Arm idle timer
    idleTimer = setTimeout(startIdleMode, 5000);

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      resetIdleTimer();

      if (!ticking) {
        requestAnimationFrame(() => {
          if (!isIdle) {
            updateHeroPupils(mouseX, mouseY, false);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Track touch movement on mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        resetIdleTimer();
        updateHeroPupils(mouseX, mouseY, false);
      }
    }, { passive: true });

    // Scroll updates pupils towards current mouse position
    window.addEventListener('scroll', () => {
      if (!isIdle) {
        updateHeroPupils(mouseX, mouseY, false);
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------------------------
     2. STICKY HEADER SCROLL EFFECT
     ------------------------------------------------------------------------- */
  const header = document.querySelector('.sarvam-header');
  const handleScroll = () => {
    if (window.scrollY > 24) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* -------------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------------- */
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileMenuBtn.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileMenuBtn.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------------------------------------------------------------------------
     4. INTERSECTION OBSERVER SCROLL REVEALS
     ------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-section-reveal], [data-scale-reveal], [data-blog-grid] > *');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* -------------------------------------------------------------------------
     5. MAIN PLAYGROUND SHOWCASE TABS
     ------------------------------------------------------------------------- */
  const playgroundTabBtns = document.querySelectorAll('.playground-tab-btn');
  const playgroundPanes = document.querySelectorAll('.playground-viewport .tab-pane');

  playgroundTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      playgroundTabBtns.forEach(b => b.classList.remove('is-active'));
      playgroundPanes.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('is-active');
      }
    });
  });

  /* -------------------------------------------------------------------------
     6. PRODUCTION CHATBOT RAG RUNNER (TAB 1)
     ------------------------------------------------------------------------- */
  const coworkInput = document.getElementById('coworkInput');
  const coworkRunBtn = document.getElementById('coworkRunBtn');
  const coworkChips = document.querySelectorAll('.cowork-prompt-chip');
  const stepContainer = document.getElementById('coworkSteps');

  const ragScenarios = {
    rbi: [
      { source: 'Vector Isolation', title: 'Embedding Query & Scoping Tenant Namespace', detail: 'Filter set strictly to tenant_id = \'acme-corp\'. Query embedded via hybrid dense-sparse vector index.' },
      { source: 'Security-Manual-v4.pdf', title: 'Retrieving Top-3 Grounded Document Chunks', detail: 'Extracted Section 4.2: Logical collection isolation with individual cryptographic keys per tenant.' },
      { source: 'Grounded LLM', title: 'Synthesizing Verified Response with Exact Citations', detail: 'Cross-checked against proprietary knowledge base. Confidence score: 0.994. Hallucination check passed.' },
      { source: 'Resolved (142ms)', title: 'Delivered Answer with In-Chat Ticketing Fallback Option', detail: 'Response streamed to widget. End-user given single-click option to escalate to human agent if needed.' }
    ],
    deck: [
      { source: 'In-Chat Trigger', title: 'User requested issue escalation to supervisor', detail: 'Detected grievance intent: "Payment deducted twice for Order #88210".' },
      { source: 'Grievance Form', title: 'Captured user phone number, transaction ID & screenshot', detail: 'Validated mandatory fields and categorized as Tier-1 Billing Discrepancy.' },
      { source: 'Zendesk / Jira', title: 'Dispatched Ticket #ISO-8821 via Webhook', detail: 'Logged to Zendesk queue and dispatched urgent alert to Slack #support-billing.' },
      { source: 'Status Sync', title: 'Confirmed ticket creation with SLA countdown timer', detail: 'Ticket acknowledged by customer support agent in 4 minutes.' }
    ],
    reconcile: [
      { source: 'Admin Telemetry', title: 'Fetching telemetry data for Tenant ID #904', detail: 'Scanned 14,280 conversational sessions across last 7 days.' },
      { source: 'Analytics Engine', title: 'Computing deflection and resolution rates', detail: '89.4% autonomous resolution rate. P95 latency: 138ms. 0 hallucination incidents.' },
      { source: 'Token Audit', title: 'Verifying token budget and billing allocations', detail: 'Consumed 4.2M input tokens, 1.1M completion tokens within contractual tier.' }
    ]
  };

  const runRagExecution = (steps) => {
    if (!stepContainer) return;
    stepContainer.innerHTML = '';

    steps.forEach((step, index) => {
      setTimeout(() => {
        const stepRow = document.createElement('div');
        stepRow.className = 'execution-step-row';
        stepRow.style.opacity = '0';
        stepRow.style.transform = 'translateY(10px)';
        stepRow.style.transition = 'all 0.4s var(--cw-ease)';

        stepRow.innerHTML = `
          <div class="step-icon-badge">${index + 1}</div>
          <div class="step-content">
            <div class="step-header">
              <span class="step-title">${step.title}</span>
              <span class="step-source-pill">${step.source}</span>
            </div>
            <p class="step-detail">${step.detail}</p>
          </div>
        `;

        stepContainer.appendChild(stepRow);
        requestAnimationFrame(() => {
          stepRow.style.opacity = '1';
          stepRow.style.transform = 'translateY(0)';
        });
      }, index * 400);
    });
  };

  coworkChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
      if (coworkInput) coworkInput.value = text;
      const key = chip.getAttribute('data-key') || 'rbi';
      runRagExecution(ragScenarios[key] || ragScenarios.rbi);
    });
  });

  if (coworkRunBtn && coworkInput) {
    coworkRunBtn.addEventListener('click', () => {
      runRagExecution(ragScenarios.rbi);
    });
  }

  /* -------------------------------------------------------------------------
     7. VOICE SUPPORT AGENTS PLAYGROUND (TAB 2)
     ------------------------------------------------------------------------- */
  const vaCards = document.querySelectorAll('.va-select-card');
  const vaCallBtn = document.getElementById('vaCallToggle');
  const vaStatusPill = document.getElementById('vaStatusPill');
  const vaWaveform = document.getElementById('vaWaveform');
  const vaTranscriptBox = document.getElementById('vaTranscriptFlow');

  const voiceConversations = {
    cart: [
      { role: 'Voice Agent', text: 'Hello! Thank you for calling Isomorphic Support. I can look up your account details or resolve your inquiry instantly. How may I assist you today?' },
      { role: 'Customer', text: 'Hi, I need to check why our webhook didn\'t receive the subscription renewal event.' },
      { role: 'Voice Agent', text: 'Checking your tenant webhook logs right now... I see the endpoint returned an HTTP 504 gateway timeout from your origin server at 10:14 AM. Our system has scheduled an automatic retry with exponential backoff.' },
      { role: 'Customer', text: 'Can you trigger an immediate retry right now?' },
      { role: 'Voice Agent', text: 'Done! The event payload was just redelivered and your server returned HTTP 200 OK. Is there anything else I can assist with?' },
      { role: 'Customer', text: 'That resolved it, thank you!' }
    ],
    booking: [
      { role: 'Voice Agent', text: 'Hello! You have reached Technical Diagnostic Support. What component is reporting an error?' },
      { role: 'Customer', text: 'Our custom vector ingestion pipeline is throwing an authorization mismatch.' },
      { role: 'Voice Agent', text: 'Please verify that your API key carries the write:vectors scope in the Tenant Admin Portal. I can regenerate your secret key or email the admin if you wish.' },
      { role: 'Customer', text: 'Yes, please email our admin with the key rotation link.' },
      { role: 'Voice Agent', text: 'Email dispatched to the registered workspace administrator. Ticket #ISO-7721 closed as resolved.' }
    ],
    payment: [
      { role: 'Voice Agent', text: 'Namaste! Isomorphic AI support desk mein aapka swagat hai. Main aapki kya madad kar sakta hoon?' },
      { role: 'Customer', text: 'Hamaari monthly invoice mein extra API credits ka charge verify karna hai.' },
      { role: 'Voice Agent', text: 'Main aapka billing ledger check kar raha hoon... Pichle hafte automated high-volume document ingestion run hua tha jisme 50,000 pages parse hue the. Complete detailed invoice maine aapke email par bhej di hai.' },
      { role: 'Customer', text: 'Haan theek hai, mujhe mil gayi. Shukriya!' }
    ]
  };

  let activeVaType = 'cart';
  let isCallActive = false;
  let callInterval = null;

  vaCards.forEach(card => {
    card.addEventListener('click', () => {
      vaCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      activeVaType = card.getAttribute('data-type') || 'cart';
      if (isCallActive) {
        stopCall();
        startCall();
      }
    });
  });

  const startCall = () => {
    isCallActive = true;
    if (vaCallBtn) vaCallBtn.textContent = 'End Call Simulation';
    if (vaStatusPill) {
      vaStatusPill.innerHTML = '<span class="va-status-dot"></span> Live Call in Progress';
      vaStatusPill.style.color = '#15803d';
      vaStatusPill.style.background = '#dcfce7';
    }
    if (vaWaveform) vaWaveform.style.opacity = '1';

    const convo = voiceConversations[activeVaType] || voiceConversations.cart;
    if (vaTranscriptBox) vaTranscriptBox.innerHTML = '';

    let i = 0;
    callInterval = setInterval(() => {
      if (i < convo.length && vaTranscriptBox) {
        const msg = convo[i];
        const msgEl = document.createElement('div');
        msgEl.className = 'va-message';
        msgEl.innerHTML = `<span class="va-msg-role">${msg.role}:</span> <span class="va-msg-body">${msg.text}</span>`;
        vaTranscriptBox.appendChild(msgEl);
        vaTranscriptBox.scrollTop = vaTranscriptBox.scrollHeight;
        i++;
      } else {
        clearInterval(callInterval);
      }
    }, 1900);
  };

  const stopCall = () => {
    isCallActive = false;
    clearInterval(callInterval);
    if (vaCallBtn) vaCallBtn.textContent = 'Start Call Simulation';
    if (vaStatusPill) {
      vaStatusPill.innerHTML = '● Ready to Call';
      vaStatusPill.style.color = '#64748b';
      vaStatusPill.style.background = '#f1f5f9';
    }
    if (vaWaveform) vaWaveform.style.opacity = '0.4';
  };

  if (vaCallBtn) {
    vaCallBtn.addEventListener('click', () => {
      if (!isCallActive) startCall();
      else stopCall();
    });
  }

  /* -------------------------------------------------------------------------
     8. SECTION 2: 5 INTERACTIVE SUITE TABS
     ------------------------------------------------------------------------- */
  const cwNavBtns = document.querySelectorAll('.cw-nav-btn');
  const cwPanes = document.querySelectorAll('.cw-pane');

  cwNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-cw');
      cwNavBtns.forEach(b => b.classList.remove('is-active'));
      cwPanes.forEach(p => p.style.display = 'none');

      btn.classList.add('is-active');
      const target = document.getElementById(targetId);
      if (target) {
        target.style.display = 'block';
      }
    });
  });

  /* -------------------------------------------------------------------------
     8B. TENANT ADMIN PORTAL 3D FAN DECK & IN-PLACE HOVER ZOOM
     ------------------------------------------------------------------------- */
  const prDeck = document.getElementById('cwPrDeck');
  const prSlots = document.querySelectorAll('.cw-pr-slot');
  const deckPills = document.querySelectorAll('.cw-deck-pill');

  if (prDeck && prSlots.length > 0) {
    let leaveTimeout = null;

    const zoomSlot = (slot) => {
      clearTimeout(leaveTimeout);
      prSlots.forEach(s => {
        if (s === slot) {
          s.classList.add('is-zoomed');
        } else {
          s.classList.remove('is-zoomed');
        }
      });
      prDeck.classList.add('has-zoomed');

      const slotIdx = slot.getAttribute('data-index');
      deckPills.forEach(p => {
        p.classList.toggle('is-active', p.getAttribute('data-index') === slotIdx);
      });
    };

    const resetDeck = () => {
      prSlots.forEach(s => s.classList.remove('is-zoomed'));
      prDeck.classList.remove('has-zoomed');
      deckPills.forEach(p => p.classList.remove('is-active'));
    };

    prSlots.forEach((slot, index) => {
      slot.setAttribute('data-index', index.toString());

      slot.addEventListener('mouseenter', () => {
        zoomSlot(slot);
      });

      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (slot.classList.contains('is-zoomed')) {
          resetDeck();
        } else {
          zoomSlot(slot);
        }
      });

      slot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (slot.classList.contains('is-zoomed')) {
            resetDeck();
          } else {
            zoomSlot(slot);
          }
        }
      });
    });

    prDeck.addEventListener('mouseleave', () => {
      leaveTimeout = setTimeout(resetDeck, 140);
    });

    deckPills.forEach((pill) => {
      pill.addEventListener('mouseenter', () => {
        const idx = pill.getAttribute('data-index');
        const targetSlot = prDeck.querySelector(`.cw-pr-slot[data-index="${idx}"]`);
        if (targetSlot) zoomSlot(targetSlot);
      });

      pill.addEventListener('click', () => {
        const idx = pill.getAttribute('data-index');
        const targetSlot = prDeck.querySelector(`.cw-pr-slot[data-index="${idx}"]`);
        if (targetSlot) zoomSlot(targetSlot);
      });
    });
  }

  /* -------------------------------------------------------------------------
     9. DEVELOPER APIs SECTION (TABS, CODE & RUNNER)
     ------------------------------------------------------------------------- */
  const apiEndpointCards = document.querySelectorAll('.api-endpoint-card');
  const codeLangBtns = document.querySelectorAll('.code-lang-btn');
  const codeDisplay = document.getElementById('apiCodeDisplay');
  const copyBtn = document.getElementById('copyCodeBtn');
  const runApiBtn = document.getElementById('runApiBtn');
  const apiResultBox = document.getElementById('apiResultBox');

  const apiSnippets = {
    tts: {
      python: `from isomorphic import IsomorphicAI

client = IsomorphicAI(api_key="iso_live_sec_key_902")

# Grounded completion strictly bounded to tenant vector database
response = client.chat.create(
    tenant_id="tenant_acme_corp",
    messages=[
        {"role": "user", "content": "How do I update our organization billing details?"}
    ],
    mode="strict_grounding",
    return_citations=True
)

print("Answer:", response.message.content)
for source in response.citations:
    print(f"Verified Source: {source.document_name} (Page {source.page})")`,
      javascript: `import { IsomorphicAI } from '@isomorphic/sdk';

const client = new IsomorphicAI({
  apiKey: process.env.ISOMORPHIC_API_KEY
});

async function main() {
  const result = await client.chat.create({
    tenantId: 'tenant_acme_corp',
    messages: [
      { role: 'user', content: 'How do I update our organization billing details?' }
    ],
    mode: 'strict_grounding',
    returnCitations: true
  });

  console.log(result.message.content);
  console.log('Citations:', result.citations);
}

main();`,
      curl: `curl -X POST "https://api.isomorphic.in/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer iso_live_sec_key_902" \\
  -d '{
    "tenant_id": "tenant_acme_corp",
    "messages": [
      {"role": "user", "content": "How do I update our organization billing details?"}
    ],
    "mode": "strict_grounding",
    "return_citations": true
  }'`
    },
    stt: {
      python: `from isomorphic import IsomorphicAI

client = IsomorphicAI(api_key="iso_live_sec_key_902")

# Upload and chunk document into isolated tenant vector space
with open("Product-Manual-2026.pdf", "rb") as doc:
    ingest = client.documents.ingest(
        tenant_id="tenant_acme_corp",
        file=doc,
        chunk_strategy="semantic_hierarchical",
        auto_index=True
    )

print(f"Successfully vectorized {ingest.chunks_created} chunks into collection.")`,
      javascript: `import { IsomorphicAI } from '@isomorphic/sdk';
import fs from 'fs';

const client = new IsomorphicAI({ apiKey: process.env.ISOMORPHIC_API_KEY });

async function ingestDocument() {
  const stream = fs.createReadStream('Product-Manual-2026.pdf');
  const res = await client.documents.ingest({
    tenantId: 'tenant_acme_corp',
    file: stream,
    chunkStrategy: 'semantic_hierarchical'
  });
  console.log('Indexed Chunks:', res.chunksCreated);
}

ingestDocument();`,
      curl: `curl -X POST "https://api.isomorphic.in/v1/documents/ingest" \\
  -H "Authorization: Bearer iso_live_sec_key_902" \\
  -F "tenant_id=tenant_acme_corp" \\
  -F "file=@Product-Manual-2026.pdf" \\
  -F "chunk_strategy=semantic_hierarchical"`
    },
    translation: {
      python: `from isomorphic import IsomorphicAI

client = IsomorphicAI(api_key="iso_live_sec_key_902")

# Dispatch autonomous sub-300ms voice support call
call = client.voice.create_call(
    to_phone_number="+919876543210",
    tenant_id="tenant_acme_corp",
    agent_persona="customer_support_tier1",
    language="en-IN",
    system_prompt="Assist customer with invoice verification."
)

print(f"Call dispatched! Call ID: {call.id}")`,
      javascript: `import { IsomorphicAI } from '@isomorphic/sdk';

const client = new IsomorphicAI({ apiKey: process.env.ISOMORPHIC_API_KEY });

const call = await client.voice.createCall({
  toPhoneNumber: '+919876543210',
  tenantId: 'tenant_acme_corp',
  agentPersona: 'customer_support_tier1',
  language: 'en-IN'
});

console.log('Call Session:', call.id);`,
      curl: `curl -X POST "https://api.isomorphic.in/v1/voice/calls" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer iso_live_sec_key_902" \\
  -d '{
    "to_phone_number": "+919876543210",
    "tenant_id": "tenant_acme_corp",
    "agent_persona": "customer_support_tier1"
  }'`
    },
    doc: {
      python: `from isomorphic import IsomorphicAI

client = IsomorphicAI(api_key="iso_live_sec_key_902")

# Log grievance ticket directly from conversation session
ticket = client.tickets.create(
    tenant_id="tenant_acme_corp",
    conversation_id="conv_88921",
    user_email="client@example.com",
    subject="Webhook SSL Certificate Mismatch",
    priority="P1_HIGH",
    auto_sync_to_zendesk=True
)

print(f"Ticket Created: {ticket.ticket_id} | Status: {ticket.status}")`,
      javascript: `import { IsomorphicAI } from '@isomorphic/sdk';

const client = new IsomorphicAI({ apiKey: process.env.ISOMORPHIC_API_KEY });

const ticket = await client.tickets.create({
  tenantId: 'tenant_acme_corp',
  conversationId: 'conv_88921',
  userEmail: 'client@example.com',
  subject: 'Webhook SSL Certificate Mismatch',
  priority: 'P1_HIGH'
});

console.log('Ticket ID:', ticket.ticketId);`,
      curl: `curl -X POST "https://api.isomorphic.in/v1/tickets" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer iso_live_sec_key_902" \\
  -d '{
    "tenant_id": "tenant_acme_corp",
    "conversation_id": "conv_88921",
    "user_email": "client@example.com",
    "subject": "Webhook SSL Certificate Mismatch",
    "priority": "P1_HIGH"
  }'`
    }
  };

  let currentApi = 'tts';
  let currentLang = 'python';

  const updateCodeDisplay = () => {
    if (codeDisplay && apiSnippets[currentApi]?.[currentLang]) {
      codeDisplay.textContent = apiSnippets[currentApi][currentLang];
    }
  };

  apiEndpointCards.forEach(card => {
    card.addEventListener('click', () => {
      apiEndpointCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      currentApi = card.getAttribute('data-api') || 'tts';
      updateCodeDisplay();
    });
  });

  codeLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      codeLangBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentLang = btn.getAttribute('data-lang') || 'python';
      updateCodeDisplay();
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (codeDisplay) {
        navigator.clipboard.writeText(codeDisplay.textContent || '').then(() => {
          const original = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓ Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = original;
          }, 2000);
        });
      }
    });
  }

  if (runApiBtn && apiResultBox) {
    runApiBtn.addEventListener('click', () => {
      apiResultBox.style.display = 'block';
      apiResultBox.innerHTML = '<span style="color:#a5b4fc">Querying api.isomorphic.in/v1/chat/completions...</span>';
      setTimeout(() => {
        apiResultBox.innerHTML = `<span style="color:#86efac">✓ Status: 200 OK (118ms)</span>
{
  "id": "iso_cmpl_98a72b",
  "object": "chat.completion",
  "created": 1728469800,
  "tenant_id": "tenant_acme_corp",
  "model": "isomorphic-rag-v2",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "To update your organization billing details, navigate to Settings > Billing within the Tenant Portal. Admin permissions are required."
      },
      "finish_reason": "stop"
    }
  ],
  "citations": [
    {
      "document": "Org-Admin-Manual-2026.pdf",
      "chunk_id": "chk_9011a",
      "confidence": 0.994
    }
  ],
  "verified_grounding": true
}`;
      }, 650);
    });
  }

  /* -------------------------------------------------------------------------
     10. TESTIMONIALS SLIDER
     ------------------------------------------------------------------------- */
  const testimonials = [
    {
      quote: "Deploying Isomorphic AI transformed our customer support operations. The chatbot deflected 72% of Tier-1 repetitive tickets within the first 14 days, and the native in-chatbot grievance escalation ensures complex queries reach the right engineer with full conversation context.",
      author: "Shubhang Sharma",
      role: "Chief Executive Officer",
      avatar: "assets/shubhang.jpeg"
    },
    {
      quote: "The vector isolation guarantee was non-negotiable for our compliance board. Isomorphic gave us dedicated tenant boundaries with zero data commingling, while reducing our first-response time from 42 minutes to instant sub-second resolution.",
      author: "Kaushal K.",
      role: "VP of Enterprise Architecture",
      avatar: "assets/kaushal.png"
    },
    {
      quote: "Our customers love the conversational voice support. The latency is genuinely imperceptible, and when a call requires human intervention, the automated ticket log already includes the full transcript and diagnostic tags.",
      author: "Ankit M.",
      role: "Lead Systems Architect",
      avatar: "assets/ankit.png"
    }
  ];

  let testIndex = 0;
  const quoteEl = document.getElementById('testQuote');
  const authorEl = document.getElementById('testAuthor');
  const roleEl = document.getElementById('testRole');
  const avatarEl = document.getElementById('testAvatar');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');

  const updateTestimonial = (idx) => {
    const item = testimonials[idx];
    if (!item) return;

    if (quoteEl) {
      quoteEl.style.opacity = '0';
      quoteEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        quoteEl.textContent = `“${item.quote}”`;
        if (authorEl) authorEl.textContent = item.author;
        if (roleEl) roleEl.textContent = item.role;
        if (avatarEl) avatarEl.src = item.avatar;
        quoteEl.style.opacity = '1';
        quoteEl.style.transform = 'translateY(0)';
      }, 200);
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      testIndex = (testIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(testIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      testIndex = (testIndex + 1) % testimonials.length;
      updateTestimonial(testIndex);
    });
  }

  /* -------------------------------------------------------------------------
     11. COOKIE CONSENT BANNER
     ------------------------------------------------------------------------- */
  const cookieBar = document.getElementById('cookieConsentBar');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');

  if (cookieBar && cookieAcceptBtn) {
    if (localStorage.getItem('isomorphic_cookies_accepted') === 'true') {
      cookieBar.style.display = 'none';
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('isomorphic_cookies_accepted', 'true');
      cookieBar.style.display = 'none';
    });
  }

});
