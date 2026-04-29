// @ts-nocheck
window.storage = {
  _data: JSON.parse(localStorage.getItem('qz_storage') || '{}'),
  _save() {
    localStorage.setItem('qz_storage', JSON.stringify(this._data));
  },
  async get(key, shared) {
    const k = (shared ? 'shared_' : '') + key;
    const v = this._data[k];
    return v !== undefined ? { key, value: v, shared: !!shared } : null;
  },
  async set(key, value, shared) {
    const k = (shared ? 'shared_' : '') + key;
    this._data[k] = value;
    this._save();
    return { key, value, shared: !!shared };
  },
  async delete(key, shared) {
    const k = (shared ? 'shared_' : '') + key;
    delete this._data[k];
    this._save();
    return { key, deleted: true };
  },
  async list(prefix, shared) {
    const p = (shared ? 'shared_' : '') + (prefix || '');
    const keys = Object.keys(this._data)
      .filter((k) => k.startsWith(p))
      .map((k) => (shared ? k.replace('shared_', '') : k));
    return { keys };
  },
};
import { useState, useEffect, useRef } from 'react';

const C = {
  bg: '#f4f4f8',
  surface: '#ffffff',
  border: '#e2e2ec',
  accent: '#6c63ff',
  accentLight: '#5046e5',
  gold: '#d97706',
  silver: '#6b7280',
  bronze: '#92400e',
  text: '#1a1827',
  muted: '#8b8aa8',
  success: '#16a34a',
  danger: '#dc2626',
  warn: '#d97706',
  cardShadow: '0 1px 4px rgba(100,100,160,0.08)',
};

const COUNTRIES = [
  'France',
  'Belgique',
  'Suisse',
  'Canada',
  'Maroc',
  'Algerie',
  'Tunisie',
  'Senegal',
  'autre',
];
const FLAGS = {
  France: '🇫🇷',
  Belgique: '🇧🇪',
  Suisse: '🇨🇭',
  Canada: '🇨🇦',
  Maroc: '🇲🇦',
  Algerie: '🇩🇿',
  Tunisie: '🇹🇳',
  Senegal: '🇸🇳',
  autre: '🌍',
};
const BOTS = [
  'NovaMind',
  'ByteWiz',
  'Aria',
  'Zephyr',
  'Orion',
  'Luna',
  'Atlas',
  'Pixel',
];
const BAVS = ['N', 'B', 'A', 'Z', 'O', 'L', 'T', 'P'];

const DOMAINS = [
  {
    id: 'med',
    label: 'Medecine',
    icon: '🩺',
    sub: ['Anatomie', 'Pharmacologie', 'Cardiologie', 'Neurologie'],
  },
  {
    id: 'droit',
    label: 'Droit',
    icon: '⚖️',
    sub: ['Droit civil', 'Droit penal', 'Droit des affaires'],
  },
  {
    id: 'hist',
    label: 'Histoire',
    icon: '🏛️',
    sub: ['Histoire moderne', 'Histoire antique', 'Geopolitique'],
  },
  {
    id: 'info',
    label: 'Informatique',
    icon: '💻',
    sub: ['Algorithmique', 'React', 'IA'],
  },
  {
    id: 'eco',
    label: 'Economie',
    icon: '📊',
    sub: ['Macroeconomie', 'Finance', 'Marketing'],
  },
  {
    id: 'culture',
    label: 'Culture generale',
    icon: '🌍',
    sub: ['Geographie', 'Sciences', 'Arts'],
  },
];

const GMODES = [
  {
    id: 'bots',
    label: 'Contre des bots',
    desc: 'Commence instantanement',
    icon: '🤖',
  },
  {
    id: 'real',
    label: 'Vrais joueurs',
    desc: 'Beta - bientot disponible',
    icon: '👥',
    disabled: true,
  },
  {
    id: 'mixed',
    label: 'Bots + Joueurs',
    desc: 'Bientot disponible',
    icon: '⚡',
    disabled: true,
  },
];

const THEMES = [
  {
    id: 'classic',
    label: 'Classique',
    desc: 'Interface standard',
    icon: '📱',
    price: 0,
  },
  {
    id: 'classroom',
    label: 'Salle de cours',
    desc: 'Tableau blanc et bureaux',
    icon: '🏫',
    price: 0,
  },
  {
    id: 'arena',
    label: 'Arena',
    desc: 'Combat de cerveaux',
    icon: '⚔️',
    price: 120,
  },
  {
    id: 'space',
    label: 'Espace',
    desc: 'Quiz intergalactique',
    icon: '🚀',
    price: 150,
  },
  {
    id: 'library',
    label: 'Bibliotheque',
    desc: 'Ambiance studieuse',
    icon: '📚',
    price: 100,
  },
];

const COIN_PACKS = [
  { id: 's', label: 'Starter', coins: 120, price: '0,99 EUR', bonus: null },
  {
    id: 'p',
    label: 'Populaire',
    coins: 350,
    price: '1,99 EUR',
    bonus: '+50',
    highlight: true,
  },
  { id: 'm', label: 'Mega', coins: 1000, price: '4,99 EUR', bonus: '+200' },
];

const BADGES = [
  {
    id: 'b_first',
    icon: '🥇',
    label: 'Vainqueur',
    desc: "1er d'une partie",
    color: '#f59e0b',
  },
  {
    id: 'b_perfect',
    icon: '💯',
    label: 'Sans-faute',
    desc: 'Score parfait en une partie',
    color: '#6c63ff',
  },
  {
    id: 'b_streak3',
    icon: '🔥',
    label: 'Flamme x3',
    desc: 'Connecte 3 jours de suite',
    color: '#ef4444',
  },
  {
    id: 'b_streak7',
    icon: '⚡',
    label: 'Flamme x7',
    desc: 'Connecte 7 jours de suite',
    color: '#f59e0b',
  },
  {
    id: 'b_scholar',
    icon: '🎓',
    label: 'Erudit',
    desc: '10 parties terminees',
    color: '#10b981',
  },
  {
    id: 'b_explorer',
    icon: '🧭',
    label: 'Explorateur',
    desc: 'Quiz dans 3 domaines differents',
    color: '#3b82f6',
  },
  {
    id: 'b_teacher',
    icon: '📋',
    label: 'Enseignant',
    desc: 'Quiz depuis un cours',
    color: '#8b5cf6',
  },
  {
    id: 'b_social',
    icon: '👥',
    label: 'Social',
    desc: 'Premier ami ajoute',
    color: '#ec4899',
  },
  {
    id: 'b_daily',
    icon: '📅',
    label: 'Assidu',
    desc: 'Connexion du jour',
    color: '#22c55e',
  },
];

const AVATARS = [
  '🧑',
  '👦',
  '👧',
  '🧔',
  '👱',
  '🧕',
  '👩',
  '🧓',
  '🦊',
  '🐺',
  '🐯',
  '🦁',
  '🐻',
  '🐼',
  '🐨',
  '🐸',
  '🦄',
  '🐲',
  '👾',
  '🤖',
  '👻',
  '🎃',
  '🧙',
  '🧛',
  '🚀',
  '⚡',
  '🔥',
  '💎',
  '🌟',
  '🎯',
  '🏆',
  '🎮',
];

function genFriendCode(name) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var hash = 0;
  for (var i = 0; i < name.length; i++)
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffff;
  var code = '';
  for (var j = 0; j < 6; j++) {
    code += chars[hash % chars.length];
    hash = Math.floor(hash / chars.length) + j * 7;
  }
  return code.slice(0, 6);
}

function ClassroomScene({
  question,
  players,
  timer,
  score,
  onAnswer,
  answered,
  selected,
  currentQ,
  totalQ,
  roomCode,
}) {
  var opts = question && question.options ? question.options : [];
  var correct = question ? question.correct : -1;
  var optColors = ['#6c63ff', '#f59e0b', '#10b981', '#ef4444'];
  var letters = ['A', 'B', 'C', 'D'];
  var rows = [];
  for (var ri = 0; ri < players.length; ri += 3)
    rows.push(players.slice(ri, ri + 3));
  var PI = Math.PI;
  var hAngle = -60 * (PI / 180);
  var mAngle = 60 * (PI / 180);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit','Segoe UI',sans-serif",
        background: '#f0e8d8',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.88)',
          borderBottom: '1px solid #ddd5c8',
        }}
      >
        <span style={{ fontSize: 12, color: '#888' }}>
          Room <b style={{ color: C.accent }}>{roomCode}</b> | Q{currentQ + 1}/
          {totalQ}
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: '#b45309', fontSize: 13, fontWeight: 700 }}>
            {'star ' + score}
          </span>
          <div
            style={{
              background: timer <= 5 ? '#fee2e2' : '#ede9ff',
              border: '1px solid ' + (timer <= 5 ? '#dc2626' : C.accent),
              borderRadius: 14,
              padding: '3px 11px',
              fontSize: 15,
              fontWeight: 800,
              color: timer <= 5 ? '#dc2626' : C.accent,
            }}
          >
            {timer + 's'}
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 400 270"
        width="100%"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <defs>
          {rows.map(function (rp, ri) {
            return rp.map(function (p, pi) {
              var baseY = 180 + ri * 28;
              var dW = 50 - ri * 4;
              var lH = 20 - ri * 3;
              var cx =
                200 -
                (rp.length * (dW + (14 + ri * 6)) - (14 + ri * 6)) / 2 +
                pi * (dW + (14 + ri * 6)) +
                dW / 2;
              return (
                <clipPath key={ri + '-' + pi} id={'cp' + ri + '-' + pi}>
                  <circle cx={cx} cy={baseY - lH - 20} r={9} />
                </clipPath>
              );
            });
          })}
        </defs>
        <rect x="0" y="0" width="400" height="210" fill="#f5ece0" />
        <rect x="0" y="210" width="400" height="60" fill="#d4a96a" />
        <rect
          x="0"
          y="208"
          width="400"
          height="5"
          fill="#b8863a"
          opacity="0.6"
        />
        <rect x="0" y="0" width="10" height="210" fill="#e8ddd0" />
        <rect x="390" y="0" width="10" height="210" fill="#e8ddd0" />
        <rect x="0" y="0" width="400" height="5" fill="#ded3c3" />

        <circle
          cx="24"
          cy="24"
          r="20"
          fill="#fff"
          stroke="#c0a070"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r="17"
          fill="#fff"
          stroke="#e8d8c0"
          strokeWidth="0.5"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (t) {
          var a = (t / 12) * 2 * PI - PI / 2;
          var r1 = t % 3 === 0 ? 12 : 13;
          var r2 = 17;
          return (
            <line
              key={t}
              x1={24 + Math.cos(a) * r1}
              y1={24 + Math.sin(a) * r1}
              x2={24 + Math.cos(a) * r2}
              y2={24 + Math.sin(a) * r2}
              stroke="#888"
              strokeWidth={t % 3 === 0 ? 1.5 : 0.8}
            />
          );
        })}
        <line
          x1="24"
          y1="24"
          x2={24 + Math.cos(hAngle) * 10}
          y2={24 + Math.sin(hAngle) * 10}
          stroke="#333"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="24"
          x2={24 + Math.cos(mAngle) * 14}
          y2={24 + Math.sin(mAngle) * 14}
          stroke="#333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="2.5" fill="#e74c3c" />

        <g transform="rotate(-4,26,76)">
          <rect
            x="10"
            y="56"
            width="36"
            height="36"
            rx="2"
            fill="#f9c6d0"
            stroke="#e8a0b0"
            strokeWidth="0.5"
          />
          <text x="14" y="82" fontSize="22">
            {'🦁'}
          </text>
        </g>
        <g transform="rotate(3,24,42)">
          <rect
            x="8"
            y="28"
            width="32"
            height="32"
            rx="2"
            fill="#fde68a"
            stroke="#f0c040"
            strokeWidth="0.5"
          />
          <text x="11" y="54" fontSize="20">
            {'🐘'}
          </text>
        </g>

        <rect
          x="78"
          y="15"
          width="244"
          height="128"
          rx="4"
          fill="#5a3e1b"
          stroke="#4a2e0b"
          strokeWidth="2"
        />
        <rect x="84" y="21" width="232" height="116" rx="2" fill="#2d5a3d" />
        <rect
          x="84"
          y="21"
          width="232"
          height="7"
          fill="rgba(255,255,255,0.05)"
        />
        <rect x="84" y="137" width="232" height="5" rx="1" fill="#6b4a1a" />
        <rect
          x="90"
          y="138"
          width="20"
          height="3"
          rx="1"
          fill="#f0ece8"
          opacity="0.8"
        />
        <rect
          x="114"
          y="138"
          width="14"
          height="3"
          rx="1"
          fill="#f8d8d8"
          opacity="0.8"
        />
        <rect
          x="132"
          y="138"
          width="10"
          height="3"
          rx="1"
          fill="#f0ece8"
          opacity="0.6"
        />
        <text
          x="200"
          y="72"
          textAnchor="middle"
          fontSize="11"
          fill="#c8e8c8"
          opacity="0.6"
          fontStyle="italic"
        >
          Question ci-dessous
        </text>
        <line
          x1="100"
          y1="90"
          x2="300"
          y2="90"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
        <line
          x1="100"
          y1="108"
          x2="300"
          y2="108"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
        <line
          x1="100"
          y1="126"
          x2="300"
          y2="126"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />

        <rect
          x="334"
          y="18"
          width="58"
          height="68"
          rx="3"
          fill="#c8903a"
          stroke="#a07020"
          strokeWidth="1.5"
        />
        <rect x="338" y="22" width="50" height="60" rx="2" fill="#d4a050" />
        <rect x="340" y="24" width="30" height="22" rx="1" fill="#7ab8d4" />
        <path
          d="M340,38 L355,31 L370,36 L370,46 L340,46z"
          fill="#6ba85a"
          opacity="0.7"
        />
        <rect x="348" y="52" width="16" height="14" rx="1" fill="#fde047" />
        <circle cx="356" cy="49" r="3.5" fill="#f59e0b" />
        <circle cx="371" cy="25" r="3" fill="#ef4444" />
        <circle cx="340" cy="25" r="3" fill="#22c55e" />

        {rows.map(function (rp, ri) {
          var baseY = 180 + ri * 28;
          var dW = 50 - ri * 4;
          var dH = 13 - ri;
          var lH = 20 - ri * 3;
          var gap = 14 + ri * 6;
          var total = rp.length * (dW + gap) - gap;
          var sx = 200 - total / 2;
          var op = 0.7 + ri * 0.2;
          return rp.map(function (p, pi) {
            var x = sx + pi * (dW + gap);
            return (
              <g key={ri + '-' + pi} opacity={op}>
                <rect
                  x={x + dW * 0.18}
                  y={baseY - lH - 12}
                  width={dW * 0.64}
                  height={9}
                  rx="2"
                  fill="#8b6520"
                  stroke="#6b4510"
                  strokeWidth="0.5"
                />
                <rect
                  x={x + dW * 0.08}
                  y={baseY - lH - 4}
                  width={dW * 0.84}
                  height={6}
                  rx="2"
                  fill="#a07830"
                  stroke="#6b4510"
                  strokeWidth="0.5"
                />
                <line
                  x1={x + dW * 0.2}
                  y1={baseY - lH + 2}
                  x2={x + dW * 0.12}
                  y2={baseY + 2}
                  stroke="#6b4510"
                  strokeWidth="1.5"
                />
                <line
                  x1={x + dW * 0.8}
                  y1={baseY - lH + 2}
                  x2={x + dW * 0.88}
                  y2={baseY + 2}
                  stroke="#6b4510"
                  strokeWidth="1.5"
                />
                <rect
                  x={x}
                  y={baseY - lH}
                  width={dW}
                  height={dH}
                  rx="2"
                  fill="#c8a46e"
                  stroke="#a07840"
                  strokeWidth="1"
                />
                <rect
                  x={x + 2}
                  y={baseY - lH + dH}
                  width={dW - 4}
                  height={2}
                  rx="1"
                  fill="rgba(0,0,0,0.15)"
                />
                <line
                  x1={x + 7}
                  y1={baseY - lH + dH}
                  x2={x + 5}
                  y2={baseY}
                  stroke="#8b6520"
                  strokeWidth="1.5"
                />
                <line
                  x1={x + dW - 7}
                  y1={baseY - lH + dH}
                  x2={x + dW - 5}
                  y2={baseY}
                  stroke="#8b6520"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x + dW / 2}
                  cy={baseY - lH - 20}
                  r={10}
                  fill={p.isUser ? 'rgba(108,99,255,0.22)' : '#f0ece6'}
                  stroke={p.isUser ? C.accent : '#c8a46e'}
                  strokeWidth={p.isUser ? 2 : 1}
                />
                {p.photo ? (
                  <image
                    href={p.photo}
                    x={x + dW / 2 - 9}
                    y={baseY - lH - 29}
                    width="18"
                    height="18"
                    clipPath={'url(#cp' + ri + '-' + pi + ')'}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <text
                    x={x + dW / 2}
                    y={baseY - lH - 13}
                    textAnchor="middle"
                    fontSize={p.emoji ? '11' : '10'}
                    fontWeight="700"
                    fill={p.isUser ? C.accent : '#8b6a3e'}
                  >
                    {p.emoji || p.avatar}
                  </text>
                )}
                <text
                  x={x + dW / 2}
                  y={baseY - lH + 9}
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="700"
                  fill="#6b4510"
                >
                  {p.score}
                </text>
                <text
                  x={x + dW / 2}
                  y={baseY + 10}
                  textAnchor="middle"
                  fontSize="7"
                  fill="#8b6a3e"
                >
                  {(p.name || '').slice(0, 7)}
                </text>
              </g>
            );
          });
        })}
      </svg>

      <div
        style={{
          background: '#2d5a3d',
          margin: '0 10px 8px',
          borderRadius: 8,
          padding: '10px 14px',
          border: '3px solid #5a3e1b',
          boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: '#e8f5e8',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          {question ? question.question : ''}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          padding: '0 10px 10px',
        }}
      >
        {opts.map(function (opt, i) {
          var bg = optColors[i] || '#888';
          var op = 1;
          if (answered) {
            if (i === correct) {
              bg = '#16a34a';
            } else if (i === selected) {
              bg = '#dc2626';
            } else {
              op = 0.35;
            }
          }
          return (
            <div
              key={i}
              onClick={function () {
                if (!answered) onAnswer(i);
              }}
              style={{
                background: bg,
                borderRadius: 10,
                padding: '10px 12px',
                cursor: answered ? 'default' : 'pointer',
                opacity: op,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {letters[i]}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.3,
                }}
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Ad = function () {
  return (
    <div
      style={{
        background: '#f0f0f8',
        border: '1px dashed ' + C.border,
        borderRadius: 8,
        padding: '10px 16px',
        textAlign: 'center',
        margin: '16px 0 0',
      }}
    >
      <div
        style={{
          color: C.muted,
          fontSize: 10,
          letterSpacing: '0.1em',
          marginBottom: 6,
        }}
      >
        PUBLICITE
      </div>
      <div
        style={{
          background: C.bg,
          borderRadius: 6,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.muted,
          fontSize: 12,
        }}
      >
        Espace publicitaire - Google AdSense
      </div>
    </div>
  );
};

const Logo = function (props) {
  var size = props.size || 28;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          background:
            'linear-gradient(135deg,' + C.accent + ',' + C.accentLight + ')',
          borderRadius: size * 0.28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.52,
          fontWeight: 700,
          color: '#fff',
        }}
      >
        Q
      </div>
      <span
        style={{
          fontSize: size * 0.75,
          fontWeight: 800,
          color: C.text,
          letterSpacing: '-0.03em',
        }}
      >
        Quiz<span style={{ color: C.accent }}>ora</span>
      </span>
    </div>
  );
};

var cardStyle = {
  background: C.surface,
  borderRadius: 16,
  border: '1.5px solid ' + C.border,
  padding: 24,
  boxShadow: C.cardShadow,
};

function Btn(props) {
  var v = props.variant || 'primary',
    d = props.disabled,
    s = props.style || {};
  var base = {
    padding: '12px 24px',
    borderRadius: 10,
    border: 'none',
    cursor: d ? 'not-allowed' : 'pointer',
    fontSize: 15,
    fontWeight: 600,
    transition: 'all 0.15s',
    opacity: d ? 0.4 : 1,
  };
  var extra = {};
  if (v === 'primary')
    extra = {
      background:
        'linear-gradient(135deg,' + C.accent + ',' + C.accentLight + ')',
      color: '#fff',
      boxShadow: '0 2px 12px rgba(108,99,255,0.3)',
    };
  else if (v === 'ghost')
    extra = {
      background: 'transparent',
      color: C.muted,
      border: '1.5px solid ' + C.border,
    };
  else if (v === 'gold')
    extra = {
      background: 'transparent',
      color: C.gold,
      border: '1.5px solid rgba(217,119,6,0.5)',
    };
  else if (v === 'success')
    extra = {
      background: 'rgba(22,163,74,0.12)',
      color: C.success,
      border: '1.5px solid rgba(22,163,74,0.5)',
    };
  else if (v === 'danger')
    extra = {
      background: 'rgba(220,38,38,0.08)',
      color: C.danger,
      border: '1.5px solid rgba(220,38,38,0.3)',
    };
  else if (v === 'tab')
    extra = {
      padding: '8px 16px',
      fontSize: 13,
      background: d ? 'rgba(108,99,255,0.12)' : 'transparent',
      color: d ? C.accent : C.muted,
      border: '1.5px solid ' + (d ? 'rgba(108,99,255,0.5)' : C.border),
      borderRadius: 20,
    };
  return (
    <button
      onClick={props.onClick}
      disabled={d}
      style={Object.assign({}, base, extra, s)}
    >
      {props.children}
    </button>
  );
}

function Inp(props) {
  return (
    <input
      type={props.type || 'text'}
      value={props.value}
      onChange={function (e) {
        props.onChange(e.target.value);
      }}
      placeholder={props.placeholder}
      style={Object.assign(
        {},
        {
          background: C.surface,
          border: '1.5px solid ' + C.border,
          borderRadius: 10,
          padding: '12px 16px',
          color: C.text,
          fontSize: 15,
          width: '100%',
          outline: 'none',
          boxSizing: 'border-box',
        },
        props.style || {}
      )}
    />
  );
}

function Av(props) {
  var size = props.size || 32,
    isUser = props.isUser,
    country = props.country;
  var photo = props.photo,
    emoji = props.emoji;
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {photo ? (
        <img
          src={photo}
          alt="av"
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid ' + (isUser ? C.accent : C.border),
            display: 'block',
          }}
        />
      ) : emoji ? (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: isUser ? 'rgba(108,99,255,0.1)' : '#f5f3ff',
            border: '2px solid ' + (isUser ? C.accent : C.border),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.5,
          }}
        >
          {emoji}
        </div>
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: isUser ? 'rgba(108,99,255,0.12)' : '#f0f0f8',
            border: '1.5px solid ' + (isUser ? C.accent : C.border),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.42,
            fontWeight: 700,
            color: isUser ? C.accent : C.muted,
          }}
        >
          {props.letter}
        </div>
      )}
      {country && (
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            fontSize: size * 0.32,
          }}
        >
          {FLAGS[country] || '🌍'}
        </span>
      )}
    </div>
  );
}

function Tag(props) {
  return (
    <div
      onClick={props.onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 13,
        cursor: 'pointer',
        background: props.active ? 'rgba(108,99,255,0.1)' : C.bg,
        border: '1.5px solid ' + (props.active ? C.accent : C.border),
        color: props.active ? C.accent : C.muted,
        fontWeight: props.active ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >
      {props.children}
    </div>
  );
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Quizora() {
  var [screen, setScreen] = useState('splash');
  var [user, setUser] = useState(null);
  var [authMode, setAuthMode] = useState('login');
  var [authEmail, setAuthEmail] = useState('');
  var [authName, setAuthName] = useState('');
  var [authPass, setAuthPass] = useState('');
  var [authCountry, setAuthCountry] = useState('France');
  var [authError, setAuthError] = useState('');
  var [domain, setDomain] = useState(null);
  var [sub, setSub] = useState('');
  var [pCount, setPCount] = useState(4);
  var [qCount, setQCount] = useState(10);
  var [gMode, setGMode] = useState('bots');
  var [theme, setTheme] = useState('classroom');
  var [purchased, setPurchased] = useState(['classic', 'classroom']);
  var [coins, setCoins] = useState(50);
  var [roomCode, setRoomCode] = useState('');
  var [lobby, setLobby] = useState([]);
  var [lobbyOk, setLobbyOk] = useState(false);
  var [questions, setQuestions] = useState([]);
  var [qIdx, setQIdx] = useState(0);
  var [score, setScore] = useState(0);
  var [sel, setSel] = useState(null);
  var [loading, setLoading] = useState(false);
  var [playersState, setPlayersState] = useState([]);
  var [timer, setTimer] = useState(20);
  var [answered, setAnswered] = useState(false);
  var [lb, setLb] = useState([]);
  var [lbFilter, setLbFilter] = useState('mondial');
  var [lbDom, setLbDom] = useState('tous');
  var [friends, setFriends] = useState([]);
  var [friendIn, setFriendIn] = useState('');
  var [friendMsg, setFriendMsg] = useState('');
  var [copied, setCopied] = useState(false);
  var [courseMode, setCourseMode] = useState(false);
  var [courseFile, setCourseFile] = useState(null);
  var [courseContent, setCourseContent] = useState(null);
  var [upErr, setUpErr] = useState('');
  var [upLoading, setUpLoading] = useState(false);
  var [ideaTitle, setIdeaTitle] = useState('');
  var [ideaDesc, setIdeaDesc] = useState('');
  var [ideaCat, setIdeaCat] = useState('fonctionnalite');
  var [ideaOk, setIdeaOk] = useState(false);
  var [ideaLoading, setIdeaLoading] = useState(false);
  var [adminPass, setAdminPass] = useState('');
  var [adminOk, setAdminOk] = useState(false);
  var [adminIdeas, setAdminIdeas] = useState([]);
  var [adminLoading, setAdminLoading] = useState(false);
  var [badges, setBadges] = useState([]);
  var [gamesPlayed, setGamesPlayed] = useState(0);
  var [domainsPlayed, setDomainsPlayed] = useState([]);
  var [loginStreak, setLoginStreak] = useState(0);
  var [newBadges, setNewBadges] = useState([]);
  var [avatarEmoji, setAvatarEmoji] = useState('🧑');
  var [avatarPhoto, setAvatarPhoto] = useState(null);
  var [showAvatarPicker, setShowAvatarPicker] = useState(false);
  var [teacherCourse, setTeacherCourse] = useState(null);
  var [teacherFile, setTeacherFile] = useState(null);
  var [teacherUpLoading, setTeacherUpLoading] = useState(false);
  var [teacherUpErr, setTeacherUpErr] = useState('');
  var [examParams, setExamParams] = useState({
    title: 'Interrogation',
    classe: '',
    duree: '1h',
    barème: 20,
    nbQcm: 5,
    nbOpen: 3,
    nbFill: 2,
    nbTrue: 2,
    niveau: 'college',
  });
  var [examData, setExamData] = useState(null);
  var [examLoading, setExamLoading] = useState(false);
  var [examCopied, setExamCopied] = useState(false);
  var qRef = useRef([]);
  var timerRef = useRef(null);

  useEffect(function () {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      var r = await window.storage.get('qz_user');
      if (r) {
        var u = JSON.parse(r.value);
        setUser(u);
        setFriends(u.friends || []);
        setPurchased(u.purchased || ['classic', 'classroom']);
        setCoins(u.coins != null ? u.coins : 50);
        setTheme(u.theme || 'classroom');
        setBadges(u.badges || []);
        setGamesPlayed(u.gamesPlayed || 0);
        setDomainsPlayed(u.domainsPlayed || []);
        setLoginStreak(u.loginStreak || 0);
        setAvatarEmoji(u.avatarEmoji || '🧑');
        setAvatarPhoto(u.avatarPhoto || null);
        // Daily login check
        var today = todayKey();
        var newB = [];
        var nb = u.badges || [];
        if (u.lastLogin !== today) {
          var streak =
            u.lastLogin ===
            new Date(Date.now() - 86400000).toISOString().slice(0, 10)
              ? (u.loginStreak || 0) + 1
              : 1;
          setLoginStreak(streak);
          if (nb.indexOf('b_daily') < 0) {
            nb = nb.concat(['b_daily']);
            newB.push('b_daily');
          }
          if (streak >= 3 && nb.indexOf('b_streak3') < 0) {
            nb = nb.concat(['b_streak3']);
            newB.push('b_streak3');
          }
          if (streak >= 7 && nb.indexOf('b_streak7') < 0) {
            nb = nb.concat(['b_streak7']);
            newB.push('b_streak7');
          }
          setBadges(nb);
          setNewBadges(newB);
          var nu = Object.assign({}, u, {
            lastLogin: today,
            loginStreak: streak,
            badges: nb,
          });
          await window.storage.set('qz_user', JSON.stringify(nu));
          setUser(nu);
        }
        setScreen('home');
      } else setScreen('auth');
    } catch (e) {
      setScreen('auth');
    }
  }

  async function saveUser(u) {
    await window.storage.set('qz_user', JSON.stringify(u));
    setUser(u);
    setFriends(u.friends || []);
  }

  function isEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleAuth() {
    setAuthError('');
    if (authMode === 'register') {
      if (!isEmail(authEmail)) {
        setAuthError('Email invalide');
        return;
      }
      if (!authName || authName.length < 2) {
        setAuthError('Pseudo trop court');
        return;
      }
    }
    if (!authPass || authPass.length < 4) {
      setAuthError('Mot de passe trop court (min 4)');
      return;
    }
    var idx = {};
    try {
      var r = await window.storage.get('qz_users', true);
      if (r) idx = JSON.parse(r.value);
    } catch (e) {}
    if (authMode === 'register') {
      var key = authEmail.toLowerCase();
      if (idx[key]) {
        setAuthError('Email deja utilise');
        return;
      }
      var fc = genFriendCode(authName.trim() + key);
      var nu = {
        name: authName.trim(),
        email: key,
        country: authCountry,
        friends: [],
        purchased: ['classic', 'classroom'],
        coins: 50,
        theme: 'classroom',
        friendCode: fc,
        badges: [],
        gamesPlayed: 0,
        domainsPlayed: [],
        loginStreak: 1,
        lastLogin: todayKey(),
      };
      idx[key] = {
        name: authName.trim(),
        email: key,
        country: authCountry,
        pass: btoa(authPass),
        friendCode: fc,
      };
      await window.storage.set('qz_users', JSON.stringify(idx), true);
      await saveUser(nu);
      setScreen('home');
    } else {
      var k = authEmail.toLowerCase();
      var found = idx[k];
      if (!found) {
        setAuthError('Aucun compte avec cet email');
        return;
      }
      if (found.pass !== btoa(authPass)) {
        setAuthError('Mot de passe incorrect');
        return;
      }
      var eu = {
        name: found.name,
        email: found.email,
        country: found.country,
        friends: [],
        purchased: found.purchased || ['classic', 'classroom'],
        coins: found.coins != null ? found.coins : 50,
        theme: found.theme || 'classroom',
        friendCode: found.friendCode || genFriendCode(found.name + found.email),
        badges: [],
        gamesPlayed: 0,
        domainsPlayed: [],
        loginStreak: 0,
      };
      await saveUser(eu);
      setScreen('home');
    }
  }

  async function logout() {
    await window.storage.delete('qz_user');
    setUser(null);
    setScreen('auth');
  }

  async function saveScore(finalScore) {
    if (!user || courseMode) return;
    var entry = {
      name: user.name,
      country: user.country,
      score: finalScore,
      domain: sub || (domain ? domain.label : '?'),
      date: todayKey(),
      ts: Date.now(),
    };
    await window.storage.set(
      'qz_score_' + todayKey() + '_' + user.name + '_' + Date.now(),
      JSON.stringify(entry),
      true
    );
  }

  async function loadLb() {
    setLoading(true);
    try {
      var keys = await window.storage.list('qz_score_' + todayKey(), true);
      var items = [];
      for (var k of keys && keys.keys ? keys.keys : []) {
        try {
          var r = await window.storage.get(k, true);
          if (r) items.push(JSON.parse(r.value));
        } catch (e) {}
      }
      items.sort(function (a, b) {
        return b.score - a.score;
      });
      setLb(items);
    } catch (e) {}
    setLoading(false);
  }

  function filteredLb() {
    var list = lb;
    if (lbFilter === 'france')
      list = list.filter(function (e) {
        return e.country === 'France';
      });
    else if (lbFilter === 'pays' && user)
      list = list.filter(function (e) {
        return e.country === user.country;
      });
    else if (lbFilter === 'amis')
      list = list.filter(function (e) {
        return friends.indexOf(e.name) >= 0 || e.name === (user && user.name);
      });
    if (lbDom !== 'tous') {
      return list
        .filter(function (e) {
          return e.domain === lbDom;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        });
    }
    var map = {};
    list.forEach(function (e) {
      var k = e.name.toLowerCase();
      if (!map[k])
        map[k] = { name: e.name, country: e.country, score: 0, domains: [] };
      map[k].score += e.score;
      if (map[k].domains.indexOf(e.domain) < 0) map[k].domains.push(e.domain);
    });
    return Object.values(map).sort(function (a, b) {
      return b.score - a.score;
    });
  }

  async function addFriend() {
    if (!friendIn.trim()) return;
    var code = friendIn.trim().toUpperCase();
    // Find user by friendCode
    var idx = {};
    try {
      var r = await window.storage.get('qz_users', true);
      if (r) idx = JSON.parse(r.value);
    } catch (e) {}
    var found = Object.values(idx).find(function (u) {
      return u.friendCode === code;
    });
    if (!found) {
      setFriendMsg('Code introuvable');
      setTimeout(function () {
        setFriendMsg('');
      }, 2500);
      return;
    }
    if (found.name === user.name) {
      setFriendMsg("C'est toi !");
      setTimeout(function () {
        setFriendMsg('');
      }, 2000);
      return;
    }
    if (friends.indexOf(found.name) >= 0) {
      setFriendMsg('Deja ami !');
      setTimeout(function () {
        setFriendMsg('');
      }, 2000);
      return;
    }
    var nf = friends.concat([found.name]);
    setFriends(nf);
    var newB = badges.slice();
    var nb2 = [];
    if (newB.indexOf('b_social') < 0) {
      newB.push('b_social');
      nb2.push('b_social');
    }
    setBadges(newB);
    if (nb2.length) setNewBadges(nb2);
    var nu = Object.assign({}, user, { friends: nf, badges: newB });
    await saveUser(nu);
    setFriendMsg(found.name + ' ajoute !');
    setFriendIn('');
    setTimeout(function () {
      setFriendMsg('');
    }, 2500);
  }

  async function buyTheme(tid, price) {
    if (coins < price) return;
    var nc = coins - price;
    var np = purchased.concat([tid]);
    setCoins(nc);
    setPurchased(np);
    var nu = Object.assign({}, user, { coins: nc, purchased: np });
    await saveUser(nu);
  }

  async function addCoins(amount) {
    var nc = coins + amount;
    setCoins(nc);
    var nu = Object.assign({}, user, { coins: nc });
    await saveUser(nu);
  }

  function genCode() {
    return Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  function startLobby(courseM) {
    var code = genCode();
    setRoomCode(code);
    var uname = user ? user.name : 'Toi';
    var slots = [
      {
        name: uname,
        avatar: uname[0].toUpperCase(),
        isUser: true,
        isBot: false,
        joined: true,
        country: user ? user.country : null,
        emoji: avatarEmoji,
        photo: avatarPhoto,
      },
    ];
    for (var i = 0; i < pCount - 1; i++)
      slots.push({
        name: BOTS[i % BOTS.length],
        avatar: BAVS[i % BAVS.length],
        isUser: false,
        isBot: true,
        joined: false,
      });
    setLobby(slots);
    setLobbyOk(false);
    setScreen('lobby');
    var delay = 600;
    slots.forEach(function (slot, idx) {
      if (slot.isUser) return;
      setTimeout(function () {
        setLobby(function (prev) {
          var upd = prev.map(function (p, i) {
            return i === idx ? Object.assign({}, p, { joined: true }) : p;
          });
          if (
            upd.every(function (p) {
              return p.joined;
            })
          )
            setLobbyOk(true);
          return upd;
        });
      }, delay);
      delay += 350;
    });
  }

  function fisherYates(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function shuffleOpts(qs) {
    return qs.map(function (q) {
      var correct = q.options[q.correct];
      var shuffled = fisherYates(q.options);
      return Object.assign({}, q, {
        options: shuffled,
        correct: shuffled.indexOf(correct),
      });
    });
  }

  // Normalize a question string for dedup comparison
  function normQ(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9À-ɏ]/g, '')
      .slice(0, 60);
  }

  // Remove duplicates within a batch and against history
  function dedupQs(qs, asked) {
    var seen = new Set();
    // Add history fingerprints
    asked.forEach(function (q) {
      seen.add(normQ(q));
    });
    return qs.filter(function (q) {
      if (!q || !q.question) return false;
      var fp = normQ(q.question);
      if (seen.has(fp)) return false;
      seen.add(fp);
      return true;
    });
  }

  async function generateQs(dlabel,slabel,count,course){
    var extra=Math.ceil(count*1.5);
    var n=Math.max(5000,extra*350);
    var GEMINI_KEY=import.meta.env.VITE_GEMINI_KEY||"";
    var GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+GEMINI_KEY;
  
    async function callGemini(prompt){
      var resp=await fetch(GEMINI_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:n,temperature:0.9}})});
      var data=await resp.json();
      var text=data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]?data.candidates[0].content.parts[0].text:"{}";
      var m=text.match(/\{[\s\S]*\}/);
      if(!m)throw new Error("no json");
      var parsed=JSON.parse(m[0]);
      var qs=Array.isArray(parsed.questions)?parsed.questions:[];
      if(qs.length===0)throw new Error("empty");
      return qs;
    }
  
    if(course){
      try{
        var coursePrompt="Voici le contenu d'un cours:\n\n"+(course.type==="pdf"?"[Document PDF fourni]":course.data)+"\n\nGenere exactement "+extra+" questions QCM variees basees sur ce contenu. Reponds UNIQUEMENT en JSON valide sans backticks: {\"questions\":[{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correct\":0,\"explanation\":\"...\"}]}";
        var qs=await callGemini(coursePrompt);
        return shuffleOpts(dedupQs(qs,[]).slice(0,count));
      }catch(e){return shuffleOpts([{question:"Erreur de generation.",options:["Ok","Annuler","Retour","Quitter"],correct:0,explanation:""}]);}
    }
  
    var topic=slabel||dlabel;
    var histKey="qz_hist_"+topic.toLowerCase().replace(/\s/g,"_");
    var asked=[];
    try{var hr=await window.storage.get(histKey);if(hr)asked=JSON.parse(hr.value);}catch(e){}
    var avoidHint=asked.length>0?"\n\nIMPORTANT - Ces questions ont DEJA ete posees, ne les repete PAS:\n"+asked.slice(-40).map(function(q,ix){return (ix+1)+". "+q;}).join("\n"):"";
  
    var prompt="Tu es un generateur de quiz educatifs expert. Reponds UNIQUEMENT avec du JSON valide sans backticks. Format: {\"questions\":[{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correct\":0,\"explanation\":\"...\"}]} REGLES: chaque question aborde un aspect DIFFERENT, pas de doublons, types varies (definition/application/cas pratique), difficulte progressive. Genere exactement "+extra+" questions sur: "+topic+avoidHint;
  
    try{
      var qs=await callGemini(prompt);
      var deduped=dedupQs(qs,asked).slice(0,count);
      if(deduped.length<count)deduped=dedupQs(qs,[]).slice(0,count);
      var newAsked=asked.concat(qs.map(function(q){return q.question;})).slice(-120);
      try{await window.storage.set(histKey,JSON.stringify(newAsked));}catch(e){}
      return shuffleOpts(deduped);
    }catch(e){
      return shuffleOpts([{question:"Quelle est la capitale de la France ?",options:["Lyon","Paris","Marseille","Bordeaux"],correct:1,explanation:"Paris."}]);
    }
  }

  async function launchQuiz() {
    setScreen('loading');
    var qs = await generateQs(
      domain ? domain.label : '',
      sub,
      qCount,
      courseMode ? courseContent : null
    );
    qRef.current = qs;
    setQuestions(qs);
    setPlayersState(
      lobby.map(function (p) {
        return Object.assign({}, p, { score: 0 });
      })
    );
    setQIdx(0);
    setScore(0);
    setScreen('quiz');
  }

  useEffect(
    function () {
      if (screen !== 'quiz' || answered || qRef.current.length === 0) return;
      setTimer(20);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(function () {
        setTimer(function (t) {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleAnswer(null);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return function () {
        clearInterval(timerRef.current);
      };
    },
    [qIdx, screen]
  );

  function handleAnswer(idx) {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setSel(idx);
    var q = qRef.current[qIdx];
    var ok = idx === (q ? q.correct : -1);
    var pts = ok ? Math.max(100, timer * 10) : 0;
    setScore(function (s) {
      return s + pts;
    });
    setPlayersState(function (prev) {
      return prev.map(function (p, i) {
        return Object.assign({}, p, {
          score:
            i === 0
              ? p.score + pts
              : p.score + Math.floor(Math.random() * 180 + 20),
        });
      });
    });
    setTimeout(async function () {
      setAnswered(false);
      setSel(null);
      var total = qRef.current.length;
      if (qIdx + 1 >= total) {
        var fs = score + pts;
        await saveScore(fs);
        setScore(fs);
        // Award badges
        var nb3 = badges.slice();
        var newB3 = [];
        var gp = (gamesPlayed || 0) + 1;
        setGamesPlayed(gp);
        var dp = domainsPlayed.slice();
        var dl = sub || (domain ? domain.label : '?');
        if (dp.indexOf(dl) < 0) dp.push(dl);
        setDomainsPlayed(dp);
        if (nb3.indexOf('b_scholar') < 0 && gp >= 10) {
          nb3.push('b_scholar');
          newB3.push('b_scholar');
        }
        if (nb3.indexOf('b_explorer') < 0 && dp.length >= 3) {
          nb3.push('b_explorer');
          newB3.push('b_explorer');
        }
        if (courseMode && nb3.indexOf('b_teacher') < 0) {
          nb3.push('b_teacher');
          newB3.push('b_teacher');
        }
        // Check if first place (score > all bots)
        var sortedFinal = playersState
          .map(function (p, i) {
            return Object.assign({}, p, {
              score: i === 0 ? p.score + pts : p.score,
            });
          })
          .sort(function (a, b) {
            return b.score - a.score;
          });
        if (
          sortedFinal[0] &&
          sortedFinal[0].isUser &&
          nb3.indexOf('b_first') < 0
        ) {
          nb3.push('b_first');
          newB3.push('b_first');
        }
        if (fs >= qRef.current.length * 200 && nb3.indexOf('b_perfect') < 0) {
          nb3.push('b_perfect');
          newB3.push('b_perfect');
        }
        if (newB3.length) setNewBadges(newB3);
        setBadges(nb3);
        var nu2 = Object.assign({}, user, {
          badges: nb3,
          gamesPlayed: gp,
          domainsPlayed: dp,
        });
        await saveUser(nu2);
        setScreen('results');
      } else {
        setQIdx(function (q) {
          return q + 1;
        });
      }
    }, 1800);
  }

  async function submitIdea() {
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;
    setIdeaLoading(true);
    var idea = {
      title: ideaTitle.trim(),
      desc: ideaDesc.trim(),
      category: ideaCat,
      author: user ? user.name : 'Anonyme',
      country: user ? user.country : '',
      date: todayKey(),
      ts: Date.now(),
    };
    try {
      await window.storage.set(
        'qz_idea_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        JSON.stringify(idea),
        true
      );
      setIdeaOk(true);
      setIdeaTitle('');
      setIdeaDesc('');
    } catch (e) {}
    setIdeaLoading(false);
  }

  async function loadAdminIdeas() {
    setAdminLoading(true);
    try {
      var keys = await window.storage.list('qz_idea_', true);
      var items = [];
      for (var k of keys && keys.keys ? keys.keys : []) {
        try {
          var r = await window.storage.get(k, true);
          if (r) items.push(Object.assign({}, JSON.parse(r.value), { key: k }));
        } catch (e) {}
      }
      items.sort(function (a, b) {
        return b.ts - a.ts;
      });
      setAdminIdeas(items);
    } catch (e) {}
    setAdminLoading(false);
  }

  async function handleFile(file) {
    setUpErr('');
    setUpLoading(true);
    setCourseFile(null);
    setCourseContent(null);
    var ext = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'pptx'].indexOf(ext) < 0) {
      setUpErr('Format non supporte. PDF ou PPTX uniquement.');
      setUpLoading(false);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUpErr('Fichier trop lourd (max 15 Mo)');
      setUpLoading(false);
      return;
    }
    try {
      if (ext === 'pdf') {
        var b64 = await new Promise(function (res, rej) {
          var r = new FileReader();
          r.onload = function () {
            res(r.result.split(',')[1]);
          };
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        setCourseContent({ type: 'pdf', data: b64, name: file.name });
      } else {
        var loadJSZip = function () {
          return new Promise(function (res, rej) {
            if (window.JSZip) {
              res(window.JSZip);
              return;
            }
            var s = document.createElement('script');
            s.src =
              'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            s.onload = function () {
              res(window.JSZip);
            };
            s.onerror = rej;
            document.head.appendChild(s);
          });
        };
        var JSZip = await loadJSZip();
        var ab = await file.arrayBuffer();
        var zip = await JSZip.loadAsync(ab);
        var slideFiles = Object.keys(zip.files)
          .filter(function (n) {
            return n.match(/ppt\/slides\/slide\d+\.xml/);
          })
          .sort();
        var text = '';
        for (var sf of slideFiles) {
          var xml = await zip.files[sf].async('string');
          var matches = xml.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
          text +=
            matches
              .map(function (m) {
                return m.replace(/<[^>]+>/g, '');
              })
              .join(' ') + '\n';
        }
        text = text.trim().slice(0, 12000);
        if (!text || text.length < 50) {
          setUpErr("Impossible d'extraire le texte. Essaie un PDF.");
          setUpLoading(false);
          return;
        }
        setCourseContent({ type: 'text', data: text, name: file.name });
      }
      setCourseFile(file);
    } catch (e) {
      setUpErr('Erreur lors de la lecture du fichier.');
    }
    setUpLoading(false);
  }

  var sorted = playersState.slice().sort(function (a, b) {
    return b.score - a.score;
  });
  var rankColor = function (i) {
    return [C.gold, C.silver, C.bronze][i] || C.muted;
  };
  var wrap = { maxWidth: 520, margin: '0 auto', padding: '24px 20px' };
  var card = cardStyle;
  var root = {
    background: C.bg,
    minHeight: '100vh',
    color: C.text,
    fontFamily: "'Outfit','Segoe UI',sans-serif",
  };

  if (screen === 'splash')
    return (
      <div
        style={Object.assign({}, root, {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Logo size={40} />
      </div>
    );

  if (screen === 'auth')
    return (
      <div style={root}>
        <div style={Object.assign({}, wrap, { paddingTop: 60 })}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size={38} />
          </div>
          <div style={card}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <Btn
                variant="tab"
                disabled={authMode === 'login'}
                onClick={function () {
                  setAuthMode('login');
                  setAuthError('');
                }}
                style={{ flex: 1 }}
              >
                Connexion
              </Btn>
              <Btn
                variant="tab"
                disabled={authMode === 'register'}
                onClick={function () {
                  setAuthMode('register');
                  setAuthError('');
                }}
                style={{ flex: 1 }}
              >
                Creer un compte
              </Btn>
            </div>
            <Inp
              value={authEmail}
              onChange={setAuthEmail}
              placeholder="Adresse email"
              type="email"
              style={{ marginBottom: 12 }}
            />
            {authMode === 'register' && (
              <Inp
                value={authName}
                onChange={setAuthName}
                placeholder="Pseudo (visible en jeu)"
                style={{ marginBottom: 12 }}
              />
            )}
            <Inp
              value={authPass}
              onChange={setAuthPass}
              placeholder="Mot de passe"
              type="password"
              style={{ marginBottom: authMode === 'register' ? 12 : 20 }}
            />
            {authMode === 'register' && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    color: C.muted,
                    fontSize: 12,
                    margin: '0 0 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Pays
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COUNTRIES.map(function (c) {
                    return (
                      <div
                        key={c}
                        onClick={function () {
                          setAuthCountry(c);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          cursor: 'pointer',
                          background:
                            authCountry === c ? 'rgba(108,99,255,0.12)' : C.bg,
                          border:
                            '1.5px solid ' +
                            (authCountry === c ? C.accent : C.border),
                          color: authCountry === c ? C.accent : C.muted,
                        }}
                      >
                        {(FLAGS[c] || '🌍') + ' ' + c}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {authError && (
              <p style={{ color: C.danger, fontSize: 13, margin: '0 0 12px' }}>
                {'⚠ ' + authError}
              </p>
            )}
            <Btn
              onClick={handleAuth}
              disabled={
                !authEmail ||
                !authPass ||
                (authMode === 'register' && !authName)
              }
              style={{ width: '100%' }}
            >
              {authMode === 'login' ? 'Se connecter →' : 'Creer mon compte →'}
            </Btn>
          </div>
          <Ad />
        </div>
      </div>
    );

  if (screen === 'home')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <Logo size={30} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                onClick={function () {
                  setScreen('shop');
                }}
                style={{
                  background: '#fef3c7',
                  border: '1.5px solid #fbbf24',
                  borderRadius: 20,
                  padding: '4px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>🪙</span>
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}
                >
                  {coins}
                </span>
              </div>
              <div
                onClick={function () {
                  setScreen('profile');
                }}
                style={{ cursor: 'pointer' }}
              >
                <Av
                  letter={user ? user.name[0].toUpperCase() : '?'}
                  isUser
                  size={34}
                  country={user ? user.country : null}
                  photo={avatarPhoto}
                  emoji={!avatarPhoto ? avatarEmoji : null}
                />
              </div>
            </div>
          </div>
          <Ad />
          {newBadges.length > 0 && (
            <div
              style={{
                background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
                border: '2px solid #f59e0b',
                borderRadius: 12,
                padding: '12px 16px',
                marginTop: 16,
                cursor: 'pointer',
              }}
              onClick={function () {
                setNewBadges([]);
                setScreen('profile');
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#92400e',
                }}
              >
                🎉 Nouveau badge{newBadges.length > 1 ? 's' : ''} debloque
                {newBadges.length > 1 ? 's' : ''}!
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 6,
                  flexWrap: 'wrap',
                }}
              >
                {newBadges.map(function (bid) {
                  var b = BADGES.find(function (x) {
                    return x.id === bid;
                  });
                  return b ? (
                    <span key={bid} style={{ fontSize: 20 }}>
                      {b.icon}
                    </span>
                  ) : null;
                })}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#b45309' }}>
                Voir mon profil →
              </p>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 20,
            }}
          >
            <Btn
              onClick={function () {
                setCourseMode(false);
                setScreen('setup');
              }}
              style={{ width: '100%' }}
            >
              ✦ Creer une room
            </Btn>
            <Btn
              variant="ghost"
              onClick={function () {
                setCourseMode(true);
                setCourseFile(null);
                setCourseContent(null);
                setUpErr('');
                setScreen('upload');
              }}
              style={{
                width: '100%',
                color: C.accent,
                borderColor: 'rgba(108,99,255,0.3)',
              }}
            >
              📚 Quiz depuis mon cours
            </Btn>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn
                variant="ghost"
                onClick={function () {
                  loadLb();
                  setScreen('leaderboard');
                }}
                style={{ flex: 1 }}
              >
                🏆 Classement
              </Btn>
              <Btn
                variant="ghost"
                onClick={function () {
                  setScreen('friends');
                }}
                style={{ flex: 1 }}
              >
                👥 Amis
              </Btn>
            </div>
            <Btn
              variant="ghost"
              onClick={function () {
                setIdeaOk(false);
                setScreen('ideas');
              }}
              style={{
                width: '100%',
                color: C.gold,
                borderColor: 'rgba(217,119,6,0.3)',
              }}
            >
              💡 Boite a idees
            </Btn>
            <div
              style={{
                background:
                  'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.12))',
                border: '1.5px solid rgba(16,185,129,0.4)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
              }}
              onClick={function () {
                setTeacherCourse(null);
                setTeacherFile(null);
                setExamData(null);
                setTeacherUpErr('');
                setScreen('teacher');
              }}
            >
              <span style={{ fontSize: 28 }}>🧑‍🏫</span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#065f46',
                  }}
                >
                  Espace Enseignant
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#047857' }}>
                  Generez des sujets d'interro depuis vos cours
                </p>
              </div>
              <span
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  borderRadius: 20,
                  padding: '2px 10px',
                  fontSize: 11,
                  color: '#065f46',
                  fontWeight: 600,
                }}
              >
                PRO
              </span>
            </div>
            <Btn
              variant="ghost"
              onClick={logout}
              style={{ width: '100%', fontSize: 13, padding: '10px' }}
            >
              Deconnexion
            </Btn>
          </div>
          <div style={Object.assign({}, card, { marginTop: 24 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 14px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Comment ca marche
            </p>
            {[
              ['🎯', 'Choisis ton domaine et ta specialite'],
              ['🤖', "L'IA genere les questions sur mesure"],
              ['🏆', 'Scores enregistres dans le classement mondial'],
              ['🏫', 'Joue dans une salle de cours immersive'],
            ].map(function (row) {
              return (
                <div
                  key={row[1]}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 18, width: 24 }}>{row[0]}</span>
                  <span style={{ fontSize: 14 }}>{row[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

  if (screen === 'profile')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <button
              onClick={function () {
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Mon profil</span>
          </div>

          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ position: 'relative' }}>
                <Av
                  letter={user ? user.name[0].toUpperCase() : '?'}
                  isUser
                  size={68}
                  photo={avatarPhoto}
                  emoji={!avatarPhoto ? avatarEmoji : null}
                />
                <button
                  onClick={function () {
                    setShowAvatarPicker(function (v) {
                      return !v;
                    });
                  }}
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: C.accent,
                    border: '2px solid #fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  ✏️
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 18,
                    color: C.text,
                  }}
                >
                  {user ? user.name : ''}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                  {user ? user.email : ''}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>
                  {FLAGS[user && user.country] || '🌍'}{' '}
                  {user ? user.country : ''}
                </p>
              </div>
            </div>
            {showAvatarPicker && (
              <div
                style={{
                  background: C.bg,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  border: '1.5px solid ' + C.border,
                }}
              >
                <p
                  style={{
                    color: C.muted,
                    fontSize: 12,
                    margin: '0 0 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Choisis un avatar
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {AVATARS.map(function (em) {
                    return (
                      <div
                        key={em}
                        onClick={async function () {
                          setAvatarEmoji(em);
                          setAvatarPhoto(null);
                          var nu = Object.assign({}, user, {
                            avatarEmoji: em,
                            avatarPhoto: null,
                          });
                          await saveUser(nu);
                          setShowAvatarPicker(false);
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background:
                            avatarEmoji === em && !avatarPhoto
                              ? 'rgba(108,99,255,0.15)'
                              : C.surface,
                          border:
                            '2px solid ' +
                            (avatarEmoji === em && !avatarPhoto
                              ? C.accent
                              : C.border),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {em}
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{ borderTop: '1px solid ' + C.border, paddingTop: 12 }}
                >
                  <p
                    style={{
                      color: C.muted,
                      fontSize: 12,
                      margin: '0 0 8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Ou uploade une photo
                  </p>
                  <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async function (e) {
                        var file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Image trop lourde (max 2 Mo)');
                          return;
                        }
                        var b64 = await new Promise(function (res) {
                          var r = new FileReader();
                          r.onload = function () {
                            res(r.result);
                          };
                          r.readAsDataURL(file);
                        });
                        setAvatarPhoto(b64);
                        setAvatarEmoji('🧑');
                        var nu = Object.assign({}, user, {
                          avatarPhoto: b64,
                          avatarEmoji: '🧑',
                        });
                        await saveUser(nu);
                        setShowAvatarPicker(false);
                      }}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: C.surface,
                        border: '1.5px dashed ' + C.accent,
                        borderRadius: 10,
                        padding: '10px 16px',
                        color: C.accent,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      📷 Choisir une photo
                      {avatarPhoto && (
                        <span
                          style={{
                            fontSize: 12,
                            color: C.success,
                            fontWeight: 400,
                          }}
                        >
                          ✓ Photo active
                        </span>
                      )}
                    </div>
                  </label>
                  {avatarPhoto && (
                    <button
                      onClick={async function () {
                        setAvatarPhoto(null);
                        setAvatarEmoji('🧑');
                        var nu = Object.assign({}, user, {
                          avatarPhoto: null,
                          avatarEmoji: '🧑',
                        });
                        await saveUser(nu);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: C.danger,
                        cursor: 'pointer',
                        fontSize: 12,
                        marginTop: 6,
                        display: 'block',
                      }}
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>
              </div>
            )}
            <div
              style={{
                background: C.bg,
                borderRadius: 10,
                padding: '10px 14px',
                border: '1.5px solid ' + C.border,
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: 12,
                  color: C.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Ton code ami
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    color: C.accent,
                  }}
                >
                  {user
                    ? user.friendCode || genFriendCode(user.name + user.email)
                    : ''}
                </span>
                <button
                  onClick={function () {
                    var fc = user
                      ? user.friendCode || genFriendCode(user.name + user.email)
                      : '';
                    if (navigator.clipboard)
                      navigator.clipboard.writeText(fc).catch(function () {});
                  }}
                  style={{
                    background: C.surface,
                    border: '1.5px solid ' + C.border,
                    borderRadius: 8,
                    padding: '6px 14px',
                    color: C.muted,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Copier
                </button>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: C.muted }}>
                Partage ce code a tes amis pour qu'ils te retrouvent
              </p>
            </div>
          </div>

          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Statistiques
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
              }}
            >
              {[
                ['🎮', gamesPlayed || 0, 'Parties'],
                ['👥', (friends || []).length, 'Amis'],
                ['🌍', (domainsPlayed || []).length, 'Domaines'],
                ['🔥', loginStreak || 0, 'Jours streak'],
                ['🏅', (badges || []).length, 'Badges'],
                ['🪙', coins || 0, 'Pieces'],
              ].map(function (s) {
                return (
                  <div
                    key={s[2]}
                    style={{
                      background: C.bg,
                      borderRadius: 10,
                      padding: '10px 8px',
                      textAlign: 'center',
                      border: '1.5px solid ' + C.border,
                    }}
                  >
                    <div style={{ fontSize: 20 }}>{s[0]}</div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: C.text,
                        margin: '2px 0',
                      }}
                    >
                      {s[1]}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>{s[2]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Mes badges
            </p>
            {badges && badges.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {BADGES.map(function (b) {
                  var owned = badges.indexOf(b.id) >= 0;
                  return (
                    <div
                      key={b.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: owned ? C.bg : 'rgba(0,0,0,0.02)',
                        borderRadius: 10,
                        padding: '10px 12px',
                        border:
                          '1.5px solid ' + (owned ? b.color + '40' : C.border),
                        opacity: owned ? 1 : 0.35,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{b.icon}</span>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 700,
                            color: owned ? b.color : C.muted,
                          }}
                        >
                          {b.label}
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: C.muted }}>
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p
                style={{
                  color: C.muted,
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '16px 0',
                  margin: 0,
                }}
              >
                Joue ta premiere partie pour gagner des badges !
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <Btn
              onClick={function () {
                setScreen('shop');
              }}
              style={{ flex: 1 }}
            >
              🛍️ Boutique
            </Btn>
            <Btn
              variant="ghost"
              onClick={function () {
                setScreen('friends');
              }}
              style={{ flex: 1 }}
            >
              👥 Amis
            </Btn>
          </div>

          <div
            style={{
              background:
                'linear-gradient(135deg,rgba(108,99,255,0.08),rgba(80,70,229,0.12))',
              border: '1.5px solid rgba(108,99,255,0.3)',
              borderRadius: 14,
              padding: 18,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 4px',
                fontWeight: 800,
                color: C.accent,
                fontSize: 16,
              }}
            >
              ✦ Quizora Premium
            </p>
            <p style={{ margin: '0 0 6px', color: C.muted, fontSize: 13 }}>
              Sans pub - Stats avancees - Acces illimite
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 14,
              }}
            >
              {[
                ['Perso', '4,99 EUR/mois'],
                ['Etudiant', '8,99 EUR/mois'],
                ['B2B', '24,99 EUR/mois'],
              ].map(function (p) {
                return (
                  <div
                    key={p[0]}
                    style={{
                      background: C.surface,
                      borderRadius: 8,
                      padding: '8px 12px',
                      textAlign: 'center',
                      border: '1.5px solid ' + C.border,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.text,
                      }}
                    >
                      {p[0]}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                      {p[1]}
                    </p>
                  </div>
                );
              })}
            </div>
            <Btn style={{ width: '100%' }}>Passer Premium →</Btn>
          </div>
        </div>
      </div>
    );

  if (screen === 'shop')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <button
              onClick={function () {
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 800, fontSize: 18 }}>🛍️ Boutique</span>
            <div
              style={{
                marginLeft: 'auto',
                background: '#fef3c7',
                border: '1.5px solid #fbbf24',
                borderRadius: 20,
                padding: '4px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🪙</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#92400e' }}>
                {coins + ' pieces'}
              </span>
            </div>
          </div>
          <div style={card}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Recharger des pieces
            </p>
            {COIN_PACKS.map(function (pack) {
              return (
                <div
                  key={pack.id}
                  onClick={function () {
                    addCoins(pack.coins);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: pack.highlight ? 'rgba(108,99,255,0.05)' : C.bg,
                    border:
                      '1.5px solid ' + (pack.highlight ? C.accent : C.border),
                    borderRadius: 12,
                    padding: '12px 16px',
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 22 }}>🪙</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 15 }}>
                        {pack.coins + ' pieces'}
                      </span>
                      {pack.bonus && (
                        <span
                          style={{
                            background: 'rgba(22,163,74,0.1)',
                            border: '1px solid rgba(22,163,74,0.3)',
                            borderRadius: 10,
                            padding: '1px 8px',
                            fontSize: 11,
                            color: C.success,
                            fontWeight: 600,
                          }}
                        >
                          {pack.bonus}
                        </span>
                      )}
                      {pack.highlight && (
                        <span
                          style={{
                            background: 'rgba(108,99,255,0.1)',
                            border: '1px solid rgba(108,99,255,0.3)',
                            borderRadius: 10,
                            padding: '1px 8px',
                            fontSize: 11,
                            color: C.accent,
                            fontWeight: 600,
                          }}
                        >
                          Populaire
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      background: pack.highlight ? C.accent : C.surface,
                      border:
                        '1.5px solid ' + (pack.highlight ? C.accent : C.border),
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontWeight: 700,
                      fontSize: 14,
                      color: pack.highlight ? '#fff' : C.text,
                    }}
                  >
                    {pack.price}
                  </div>
                </div>
              );
            })}
            <p
              style={{
                color: C.muted,
                fontSize: 11,
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Prototype - clic pour crediter gratuitement
            </p>
          </div>
          <div style={Object.assign({}, card, { marginTop: 14 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Themes de salle
            </p>
            {THEMES.map(function (t) {
              var owned = purchased.indexOf(t.id) >= 0;
              var active = theme === t.id;
              var canBuy = coins >= t.price && !owned;
              return (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: active ? 'rgba(108,99,255,0.05)' : C.bg,
                    border: '1.5px solid ' + (active ? C.accent : C.border),
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                      {t.label}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                      {t.desc}
                    </p>
                  </div>
                  {owned ? (
                    <button
                      onClick={async function () {
                        setTheme(t.id);
                        var nu = Object.assign({}, user, { theme: t.id });
                        await saveUser(nu);
                      }}
                      style={{
                        background: active ? C.accent : C.surface,
                        border: '1.5px solid ' + (active ? C.accent : C.border),
                        borderRadius: 8,
                        padding: '6px 14px',
                        fontWeight: 700,
                        fontSize: 13,
                        color: active ? '#fff' : C.text,
                        cursor: 'pointer',
                      }}
                    >
                      {active ? '✓ Actif' : 'Choisir'}
                    </button>
                  ) : t.price === 0 ? (
                    <span
                      style={{
                        background: 'rgba(22,163,74,0.1)',
                        color: C.success,
                        border: '1px solid rgba(22,163,74,0.3)',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Gratuit
                    </span>
                  ) : (
                    <button
                      onClick={function () {
                        if (canBuy) buyTheme(t.id, t.price);
                      }}
                      disabled={!canBuy}
                      style={{
                        background: canBuy
                          ? 'rgba(217,119,6,0.1)'
                          : 'transparent',
                        border:
                          '1.5px solid ' +
                          (canBuy ? 'rgba(217,119,6,0.5)' : C.border),
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontWeight: 700,
                        fontSize: 13,
                        color: canBuy ? C.gold : C.muted,
                        cursor: canBuy ? 'pointer' : 'not-allowed',
                        opacity: canBuy ? 1 : 0.6,
                      }}
                    >
                      {'🪙 ' + t.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <Ad />
        </div>
      </div>
    );

  if (screen === 'leaderboard')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <button
              onClick={function () {
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <Logo size={22} />
            <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 12 }}>
              📅 Aujourd'hui
            </span>
          </div>
          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Filtrer par
            </p>
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                marginBottom: 14,
              }}
            >
              {[
                ['mondial', '🌍 Mondial'],
                ['france', '🇫🇷 France'],
                ['pays', 'Mon pays'],
                ['amis', '👥 Amis'],
              ].map(function (f) {
                return (
                  <Btn
                    key={f[0]}
                    variant="tab"
                    disabled={lbFilter === f[0]}
                    onClick={function () {
                      setLbFilter(f[0]);
                    }}
                  >
                    {f[1]}
                  </Btn>
                );
              })}
            </div>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Domaine
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag
                active={lbDom === 'tous'}
                onClick={function () {
                  setLbDom('tous');
                }}
              >
                Tous
              </Tag>
              {DOMAINS.map(function (d) {
                return (
                  <Tag
                    key={d.id}
                    active={lbDom === d.label}
                    onClick={function () {
                      setLbDom(d.label);
                    }}
                  >
                    {d.icon + ' ' + d.label}
                  </Tag>
                );
              })}
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
              Chargement...
            </div>
          ) : (
            <div style={card}>
              {filteredLb().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ color: C.muted, fontSize: 14 }}>
                    Aucun score pour aujourd'hui
                  </p>
                </div>
              ) : (
                filteredLb().map(function (entry, i) {
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 0',
                        borderBottom:
                          i < filteredLb().length - 1
                            ? '1px solid ' + C.border
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          color: rankColor(i),
                          fontWeight: 800,
                          fontSize: 14,
                          width: 28,
                          textAlign: 'center',
                        }}
                      >
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : '#' + (i + 1)}
                      </span>
                      <Av
                        letter={entry.name[0].toUpperCase()}
                        isUser={user && entry.name === user.name}
                        size={34}
                        country={entry.country}
                        photo={
                          user && entry.name === user.name ? avatarPhoto : null
                        }
                        emoji={
                          user && entry.name === user.name && !avatarPhoto
                            ? avatarEmoji
                            : null
                        }
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 600,
                            fontSize: 14,
                            color:
                              user && entry.name === user.name
                                ? C.accent
                                : C.text,
                          }}
                        >
                          {entry.name}
                          {user && entry.name === user.name && (
                            <span
                              style={{
                                fontSize: 11,
                                color: C.muted,
                                fontWeight: 400,
                              }}
                            >
                              {' '}
                              (toi)
                            </span>
                          )}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                          {entry.domains
                            ? entry.domains.join(' · ')
                            : entry.domain}
                        </p>
                      </div>
                      <span
                        style={{ color: C.gold, fontWeight: 800, fontSize: 16 }}
                      >
                        {entry.score}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button
              onClick={loadLb}
              style={{
                background: 'none',
                border: 'none',
                color: C.accent,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ↻ Actualiser
            </button>
          </div>
          <Ad />
        </div>
      </div>
    );

  if (screen === 'friends')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <button
              onClick={function () {
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 700, fontSize: 17 }}>Mes amis</span>
          </div>
          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Ajouter un ami
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Inp
                value={friendIn}
                onChange={function (v) {
                  setFriendIn(v.toUpperCase());
                }}
                placeholder="Code ami (ex: AB3XZ7)"
                style={{ flex: 1, letterSpacing: '0.1em', fontWeight: 600 }}
              />
              <Btn
                onClick={addFriend}
                disabled={!friendIn.trim()}
                style={{ padding: '12px 18px', flexShrink: 0 }}
              >
                +
              </Btn>
            </div>
            {friendMsg && (
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 13,
                  color:
                    friendMsg.indexOf('introuvable') >= 0
                      ? C.danger
                      : C.success,
                }}
              >
                {friendMsg}
              </p>
            )}
          </div>
          <div style={card}>
            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
                  Aucun ami pour l'instant
                </p>
              </div>
            ) : (
              friends.map(function (f, i) {
                return (
                  <div
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 0',
                      borderBottom:
                        i < friends.length - 1
                          ? '1px solid ' + C.border
                          : 'none',
                    }}
                  >
                    <Av letter={f[0].toUpperCase()} isUser={false} size={36} />
                    <span style={{ flex: 1, fontWeight: 600 }}>{f}</span>
                    <Btn
                      variant="danger"
                      onClick={async function () {
                        var nf = friends.filter(function (x) {
                          return x !== f;
                        });
                        setFriends(nf);
                        var nu = Object.assign({}, user, { friends: nf });
                        await saveUser(nu);
                      }}
                      style={{ padding: '6px 14px', fontSize: 12 }}
                    >
                      Retirer
                    </Btn>
                  </div>
                );
              })
            )}
          </div>
          <Ad />
        </div>
      </div>
    );

  if (screen === 'upload')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <button
              onClick={function () {
                setCourseMode(false);
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 700, fontSize: 17 }}>
              Quiz depuis mon cours
            </span>
            <span
              style={{
                marginLeft: 'auto',
                background: 'rgba(217,119,6,0.1)',
                border: '1px solid rgba(217,119,6,0.3)',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                color: C.warn,
              }}
            >
              Hors classement
            </span>
          </div>
          <div style={card}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Depose ton fichier
            </p>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="file"
                accept=".pdf,.pptx"
                onChange={function (e) {
                  if (e.target.files[0]) handleFile(e.target.files[0]);
                }}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  border: '2px dashed ' + (courseFile ? C.success : C.accent),
                  borderRadius: 12,
                  padding: '32px 20px',
                  textAlign: 'center',
                  background: courseFile
                    ? 'rgba(22,163,74,0.04)'
                    : 'rgba(108,99,255,0.04)',
                }}
              >
                {upLoading ? (
                  <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
                    Lecture du fichier...
                  </p>
                ) : courseFile ? (
                  <div>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>
                      {courseFile.name.endsWith('.pdf') ? '📄' : '📊'}
                    </div>
                    <p
                      style={{
                        color: C.success,
                        fontWeight: 600,
                        fontSize: 15,
                        margin: '0 0 4px',
                      }}
                    >
                      {courseFile.name}
                    </p>
                    <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                      Pret a generer les questions
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                    <p
                      style={{
                        color: C.text,
                        fontWeight: 600,
                        fontSize: 15,
                        margin: '0 0 6px',
                      }}
                    >
                      Clique pour uploader
                    </p>
                    <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
                      PDF ou PowerPoint (.pptx) - Max 15 Mo
                    </p>
                  </div>
                )}
              </div>
            </label>
            {upErr && (
              <p style={{ color: C.danger, fontSize: 13, margin: '10px 0 0' }}>
                {'⚠ ' + upErr}
              </p>
            )}
          </div>
          {courseContent && (
            <div style={Object.assign({}, card, { marginTop: 14 })}>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      color: C.muted,
                      fontSize: 12,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Nombre de questions
                  </p>
                  <span
                    style={{ color: C.accent, fontWeight: 800, fontSize: 20 }}
                  >
                    {qCount}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[5, 10, 15, 20, 30].map(function (n) {
                    return (
                      <div
                        key={n}
                        onClick={function () {
                          setQCount(n);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: 8,
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 14,
                          background:
                            qCount === n ? 'rgba(108,99,255,0.15)' : C.bg,
                          border:
                            '1.5px solid ' +
                            (qCount === n ? C.accent : C.border),
                          color: qCount === n ? C.accent : C.muted,
                        }}
                      >
                        {n}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      color: C.muted,
                      fontSize: 12,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Nombre de joueurs
                  </p>
                  <span
                    style={{ color: C.accent, fontWeight: 800, fontSize: 20 }}
                  >
                    {pCount}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5, 6].map(function (n) {
                    return (
                      <div
                        key={n}
                        onClick={function () {
                          setPCount(n);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: 8,
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 14,
                          background:
                            pCount === n ? 'rgba(108,99,255,0.15)' : C.bg,
                          border:
                            '1.5px solid ' +
                            (pCount === n ? C.accent : C.border),
                          color: pCount === n ? C.accent : C.muted,
                        }}
                      >
                        {n}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(217,119,6,0.08)',
                  border: '1px solid rgba(217,119,6,0.3)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 16,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 16 }}>ℹ️</span>
                <p style={{ margin: 0, color: C.warn, fontSize: 13 }}>
                  Les scores ne seront pas enregistres dans le classement.
                </p>
              </div>
              <Btn
                onClick={function () {
                  startLobby(true);
                }}
                style={{ width: '100%' }}
              >
                Lancer le quiz sur mon cours →
              </Btn>
            </div>
          )}
          <Ad />
        </div>
      </div>
    );

  async function generateExam() {
    if (!teacherCourse) return;
    setExamLoading(true);
    var p = examParams;
    var total = p.nbQcm + p.nbOpen + p.nbFill + p.nbTrue;
    var instr =
      "Tu es un professeur expert. Genere un sujet d'interrogation scolaire complet et rigoureux.\n" +
      'Parametres: ' +
      total +
      ' questions au total, niveau ' +
      p.niveau +
      ', duree ' +
      p.duree +
      ', note sur ' +
      p.bareme +
      '.\n' +
      'Distribution: ' +
      p.nbQcm +
      ' QCM, ' +
      p.nbOpen +
      ' questions ouvertes, ' +
      p.nbFill +
      ' textes a trous, ' +
      p.nbTrue +
      ' vrai/faux.\n' +
      'Reponds UNIQUEMENT en JSON valide sans backticks. Format:\n' +
      '{"titre":"...","consignes":"...","sections":[{"type":"qcm","titre":"Partie I - QCM","questions":[{"num":1,"enonce":"...","options":["A)...","B)...","C)...","D)..."],"points":X}]},{"type":"ouvertes","titre":"Partie II - Questions de cours","questions":[{"num":X,"enonce":"...","lignes":8,"points":X}]},{"type":"trous","titre":"Partie III - Texte a trous","questions":[{"num":X,"enonce":"Completez: ___ est ...","points":X}]},{"type":"vf","titre":"Partie IV - Vrai ou Faux","questions":[{"num":X,"enonce":"...","points":X}]}],"bareme_total":' +
      p.bareme +
      '}\n' +
      'Assure-toi que le total des points = ' +
      p.bareme +
      '.';
    try {
      var msgs;
      if (teacherCourse.type === 'pdf') {
        msgs = [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: teacherCourse.data,
                },
              },
              { type: 'text', text: instr },
            ],
          },
        ];
      } else {
        msgs = [
          {
            role: 'user',
            content:
              'Contenu du cours:\n\n' + teacherCourse.data + '\n\n' + instr,
          },
        ];
      }
      var resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 6000,
          messages: msgs,
        }),
      });
      var data = await resp.json();
      var raw = data.content.find(function (b) {
        return b.type === 'text';
      });
      var text = raw ? raw.text : '{}';
      var m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('no json');
      var parsed = JSON.parse(m[0]);
      setExamData(parsed);
      setScreen('exam_editor');
    } catch (e) {
      setExamData({
        titre: 'Erreur',
        consignes: 'Impossible de generer le sujet.',
        sections: [],
      });
    }
    setExamLoading(false);
  }

  async function loadJSZipTeacher(file) {
    setTeacherUpErr('');
    setTeacherUpLoading(true);
    setTeacherFile(null);
    setTeacherCourse(null);
    var ext = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'pptx'].indexOf(ext) < 0) {
      setTeacherUpErr('PDF ou PPTX uniquement.');
      setTeacherUpLoading(false);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setTeacherUpErr('Max 15 Mo');
      setTeacherUpLoading(false);
      return;
    }
    try {
      if (ext === 'pdf') {
        var b64 = await new Promise(function (res) {
          var r = new FileReader();
          r.onload = function () {
            res(r.result.split(',')[1]);
          };
          r.readAsDataURL(file);
        });
        setTeacherCourse({ type: 'pdf', data: b64, name: file.name });
      } else {
        var loadZ = function () {
          return new Promise(function (res, rej) {
            if (window.JSZip) {
              res(window.JSZip);
              return;
            }
            var s = document.createElement('script');
            s.src =
              'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            s.onload = function () {
              res(window.JSZip);
            };
            s.onerror = rej;
            document.head.appendChild(s);
          });
        };
        var JSZip = await loadZ();
        var ab = await file.arrayBuffer();
        var zip = await JSZip.loadAsync(ab);
        var sfs = Object.keys(zip.files)
          .filter(function (n) {
            return n.match(/ppt\/slides\/slide\d+\.xml/);
          })
          .sort();
        var txt = '';
        for (var sf of sfs) {
          var xml = await zip.files[sf].async('string');
          var mm = xml.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
          txt +=
            mm
              .map(function (x) {
                return x.replace(/<[^>]+>/g, '');
              })
              .join(' ') + '\n';
        }
        txt = txt.trim().slice(0, 12000);
        if (!txt || txt.length < 50) {
          setTeacherUpErr("Impossible d'extraire le texte.");
          setTeacherUpLoading(false);
          return;
        }
        setTeacherCourse({ type: 'text', data: txt, name: file.name });
      }
      setTeacherFile(file);
    } catch (e) {
      setTeacherUpErr('Erreur de lecture.');
    }
    setTeacherUpLoading(false);
  }

  function exportPDF() {
    var loadJsPDF = function () {
      return new Promise(function (res, rej) {
        if (window.jspdf) {
          res(window.jspdf.jsPDF);
          return;
        }
        var s = document.createElement('script');
        s.src =
          'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = function () {
          res(window.jspdf.jsPDF);
        };
        s.onerror = rej;
        document.head.appendChild(s);
      });
    };
    loadJsPDF().then(function (JsPDF) {
      var doc = new JsPDF();
      var p = examParams;
      var d = examData;
      var y = 20;
      var lw = 170;
      var addLine = function (txt, fs, bold, indent) {
        doc.setFontSize(fs || 11);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        var lines = doc.splitTextToSize(txt, lw - (indent || 0));
        lines.forEach(function (l) {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(l, (indent || 20) + 10, y);
          y += fs ? fs * 0.55 : 6;
        });
        y += 1;
      };
      // Header
      doc.setFillColor(108, 99, 255);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(d.titre || p.title, 105, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Classe: ' +
          p.classe +
          '   |   Duree: ' +
          p.duree +
          '   |   Note: /' +
          p.bareme,
        105,
        21,
        { align: 'center' }
      );
      doc.setTextColor(30, 24, 39);
      y = 38;
      if (d.consignes) {
        addLine('Consignes: ' + d.consignes, 9, false, 0);
        y += 3;
      }
      (d.sections || []).forEach(function (sec) {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFillColor(245, 244, 255);
        doc.rect(10, y - 4, 190, 8, 'F');
        addLine(sec.titre || '', 12, true, 0);
        y += 2;
        (sec.questions || []).forEach(function (q) {
          addLine('Q' + q.num + '. ' + q.enonce, 10, false, 0);
          if (sec.type === 'qcm' && q.options) {
            q.options.forEach(function (opt) {
              addLine(opt, 9, false, 8);
            });
          }
          if (sec.type === 'ouvertes' && q.lignes) {
            for (var li = 0; li < (q.lignes || 4); li++) {
              if (y > 272) {
                doc.addPage();
                y = 20;
              }
              doc.setDrawColor(200, 200, 210);
              doc.line(20, y, 190, y);
              y += 6;
            }
          }
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 168);
          doc.text(
            '(' + q.points + ' pt' + (q.points > 1 ? 's' : '') + ')',
            192,
            y - 2,
            { align: 'right' }
          );
          doc.setTextColor(30, 24, 39);
          y += 4;
        });
        y += 6;
      });
      doc.save((d.titre || 'sujet') + '.pdf');
    });
  }

  if (screen === 'teacher')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <button
              onClick={function () {
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 800, fontSize: 18 }}>
              🧑‍🏫 Espace Enseignant
            </span>
            <span
              style={{
                marginLeft: 'auto',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                color: '#047857',
                fontWeight: 600,
              }}
            >
              PRO
            </span>
          </div>

          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              1. Deposez votre cours
            </p>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="file"
                accept=".pdf,.pptx"
                onChange={function (e) {
                  if (e.target.files[0]) loadJSZipTeacher(e.target.files[0]);
                }}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  border: '2px dashed ' + (teacherFile ? '#10b981' : C.accent),
                  borderRadius: 12,
                  padding: '28px 20px',
                  textAlign: 'center',
                  background: teacherFile
                    ? 'rgba(16,185,129,0.04)'
                    : 'rgba(108,99,255,0.04)',
                }}
              >
                {teacherUpLoading ? (
                  <p style={{ color: C.muted, margin: 0 }}>
                    Lecture en cours...
                  </p>
                ) : teacherFile ? (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>
                      {teacherFile.name.endsWith('.pdf') ? '📄' : '📊'}
                    </div>
                    <p
                      style={{
                        color: '#065f46',
                        fontWeight: 600,
                        fontSize: 14,
                        margin: '0 0 2px',
                      }}
                    >
                      {teacherFile.name}
                    </p>
                    <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                      ✓ Cours charge avec succes
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        margin: '0 0 4px',
                      }}
                    >
                      Deposez votre cours ici
                    </p>
                    <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                      PDF ou PowerPoint (.pptx) — max 15 Mo
                    </p>
                  </div>
                )}
              </div>
            </label>
            {teacherUpErr && (
              <p style={{ color: C.danger, fontSize: 13, margin: '8px 0 0' }}>
                {'⚠ ' + teacherUpErr}
              </p>
            )}
          </div>

          {teacherCourse && (
            <div style={Object.assign({}, card, { marginBottom: 14 })}>
              <p
                style={{
                  color: C.muted,
                  fontSize: 12,
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                2. Parametres de l'interrogation
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                {[
                  ['Titre', 'title', 'text', examParams.title],
                  ['Classe', 'classe', 'text', examParams.classe],
                  ['Duree', 'duree', 'text', examParams.duree],
                  ['Note sur', 'bareme', 'number', examParams.bareme],
                ].map(function (f) {
                  return (
                    <div key={f[1]}>
                      <p
                        style={{
                          color: C.muted,
                          fontSize: 11,
                          margin: '0 0 4px',
                        }}
                      >
                        {f[0]}
                      </p>
                      <input
                        type={f[2]}
                        value={f[3]}
                        onChange={function (e) {
                          setExamParams(function (p) {
                            var n = Object.assign({}, p);
                            n[f[1]] =
                              f[2] === 'number'
                                ? Number(e.target.value)
                                : e.target.value;
                            return n;
                          });
                        }}
                        style={{
                          background: C.bg,
                          border: '1.5px solid ' + C.border,
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: C.text,
                          fontSize: 14,
                          width: '100%',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <p
                style={{
                  color: C.muted,
                  fontSize: 11,
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Niveau
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 14,
                }}
              >
                {[
                  'primaire',
                  'college',
                  'lycee',
                  'superieur',
                  'professionnel',
                ].map(function (nv) {
                  return (
                    <div
                      key={nv}
                      onClick={function () {
                        setExamParams(function (p) {
                          return Object.assign({}, p, { niveau: nv });
                        });
                      }}
                      style={{
                        padding: '5px 14px',
                        borderRadius: 20,
                        fontSize: 12,
                        cursor: 'pointer',
                        background:
                          examParams.niveau === nv
                            ? 'rgba(108,99,255,0.12)'
                            : C.bg,
                        border:
                          '1.5px solid ' +
                          (examParams.niveau === nv ? C.accent : C.border),
                        color: examParams.niveau === nv ? C.accent : C.muted,
                        fontWeight: examParams.niveau === nv ? 600 : 400,
                      }}
                    >
                      {nv}
                    </div>
                  );
                })}
              </div>

              <p
                style={{
                  color: C.muted,
                  fontSize: 11,
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Types de questions
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {[
                  ['QCM', 'nbQcm', '🔵'],
                  ['Questions ouvertes', 'nbOpen', '🟢'],
                  ['Textes a trous', 'nbFill', '🟡'],
                  ['Vrai / Faux', 'nbTrue', '🔴'],
                ].map(function (f) {
                  return (
                    <div
                      key={f[1]}
                      style={{
                        background: C.bg,
                        border: '1.5px solid ' + C.border,
                        borderRadius: 10,
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{f[2]}</span>
                      <span style={{ fontSize: 13, flex: 1, color: C.text }}>
                        {f[0]}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <button
                          onClick={function () {
                            setExamParams(function (p) {
                              var n = Object.assign({}, p);
                              n[f[1]] = Math.max(0, n[f[1]] - 1);
                              return n;
                            });
                          }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: C.surface,
                            border: '1px solid ' + C.border,
                            cursor: 'pointer',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: C.muted,
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            minWidth: 16,
                            textAlign: 'center',
                          }}
                        >
                          {examParams[f[1]]}
                        </span>
                        <button
                          onClick={function () {
                            setExamParams(function (p) {
                              var n = Object.assign({}, p);
                              n[f[1]] = n[f[1]] + 1;
                              return n;
                            });
                          }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: C.surface,
                            border: '1px solid ' + C.border,
                            cursor: 'pointer',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: C.accent,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Btn
                onClick={generateExam}
                disabled={
                  examLoading ||
                  examParams.nbQcm +
                    examParams.nbOpen +
                    examParams.nbFill +
                    examParams.nbTrue ===
                    0
                }
                style={{ width: '100%', fontSize: 16, padding: '14px' }}
              >
                {examLoading
                  ? 'Generation en cours...'
                  : "✦ Generer le sujet d'interrogation"}
              </Btn>
            </div>
          )}
          <Ad />
        </div>
      </div>
    );

  if (screen === 'exam_editor' && examData) {
    var totalPts = (examData.sections || []).reduce(function (s, sec) {
      return (
        s +
        (sec.questions || []).reduce(function (ss, q) {
          return ss + (q.points || 0);
        }, 0)
      );
    }, 0);
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <button
              onClick={function () {
                setScreen('teacher');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 800, fontSize: 17, flex: 1 }}>
              Apercu & Edition
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={function () {
                  var txt =
                    examData.titre + '\n\n' + examData.consignes + '\n\n';
                  (examData.sections || []).forEach(function (sec) {
                    txt +=
                      '\n' +
                      sec.titre +
                      '\n' +
                      (sec.questions || [])
                        .map(function (q) {
                          return (
                            'Q' +
                            q.num +
                            '. ' +
                            q.enonce +
                            (sec.type === 'qcm'
                              ? '\n' + (q.options || []).join('\n')
                              : '') +
                            ' (' +
                            q.points +
                            ' pt' +
                            (q.points > 1 ? 's' : '') +
                            ')'
                          );
                        })
                        .join('\n\n') +
                      '\n';
                  });
                  navigator.clipboard && navigator.clipboard.writeText(txt);
                  setExamCopied(true);
                  setTimeout(function () {
                    setExamCopied(false);
                  }, 2000);
                }}
                style={{
                  background: examCopied ? 'rgba(22,163,74,0.1)' : C.surface,
                  border: '1.5px solid ' + (examCopied ? C.success : C.border),
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: examCopied ? C.success : C.muted,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {examCopied ? '✓ Copie' : '📋 Copier'}
              </button>
              <Btn
                onClick={exportPDF}
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                📄 Export PDF
              </Btn>
            </div>
          </div>

          <div
            style={Object.assign({}, card, {
              marginBottom: 14,
              background: '#fff',
              borderColor: 'rgba(108,99,255,0.2)',
            })}
          >
            <div
              style={{
                textAlign: 'center',
                paddingBottom: 14,
                borderBottom: '2px solid ' + C.border,
                marginBottom: 14,
              }}
            >
              <input
                value={examData.titre || ''}
                onChange={function (e) {
                  setExamData(function (d) {
                    return Object.assign({}, d, { titre: e.target.value });
                  });
                }}
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  width: '100%',
                  color: C.text,
                  background: 'transparent',
                }}
              />
              <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>
                {'Classe: ' +
                  examParams.classe +
                  ' | Duree: ' +
                  examParams.duree +
                  ' | Note: /' +
                  examParams.bareme +
                  ' | Total: ' +
                  totalPts +
                  ' pts'}
              </p>
            </div>
            <div
              style={{
                background: C.bg,
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 12,
                border: '1px solid ' + C.border,
              }}
            >
              <p
                style={{
                  color: C.muted,
                  fontSize: 11,
                  margin: '0 0 4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Consignes
              </p>
              <textarea
                value={examData.consignes || ''}
                onChange={function (e) {
                  setExamData(function (d) {
                    return Object.assign({}, d, { consignes: e.target.value });
                  });
                }}
                rows={2}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  color: C.text,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {(examData.sections || []).map(function (sec, si) {
              var secColors = {
                qcm: '#6c63ff',
                ouvertes: '#10b981',
                trous: '#f59e0b',
                vf: '#ef4444',
              };
              var col = secColors[sec.type] || C.accent;
              return (
                <div key={si} style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      background: col + '18',
                      borderRadius: 8,
                      padding: '8px 14px',
                      marginBottom: 10,
                      border: '1px solid ' + col + '30',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <input
                      value={sec.titre || ''}
                      onChange={function (e) {
                        setExamData(function (d) {
                          var s = d.sections.slice();
                          s[si] = Object.assign({}, s[si], {
                            titre: e.target.value,
                          });
                          return Object.assign({}, d, { sections: s });
                        });
                      }}
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: col,
                        flex: 1,
                      }}
                    />
                    <span style={{ fontSize: 12, color: col, fontWeight: 600 }}>
                      {(sec.questions || []).reduce(function (s, q) {
                        return s + (q.points || 0);
                      }, 0) + ' pts'}
                    </span>
                  </div>
                  {(sec.questions || []).map(function (q, qi) {
                    return (
                      <div
                        key={qi}
                        style={{
                          background: C.bg,
                          borderRadius: 10,
                          padding: '12px 14px',
                          marginBottom: 8,
                          border: '1.5px solid ' + C.border,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'flex-start',
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: C.accent,
                              flexShrink: 0,
                            }}
                          >
                            Q{q.num}.
                          </span>
                          <textarea
                            value={q.enonce || ''}
                            onChange={function (e) {
                              setExamData(function (d) {
                                var s = d.sections.slice();
                                var qs = s[si].questions.slice();
                                qs[qi] = Object.assign({}, qs[qi], {
                                  enonce: e.target.value,
                                });
                                s[si] = Object.assign({}, s[si], {
                                  questions: qs,
                                });
                                return Object.assign({}, d, { sections: s });
                              });
                            }}
                            rows={2}
                            style={{
                              flex: 1,
                              border: '1px solid ' + C.border,
                              outline: 'none',
                              background: C.surface,
                              fontSize: 13,
                              color: C.text,
                              resize: 'vertical',
                              fontFamily: 'inherit',
                              borderRadius: 6,
                              padding: '6px 8px',
                            }}
                          />
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <input
                              type="number"
                              value={q.points || 0}
                              min={0}
                              max={20}
                              onChange={function (e) {
                                setExamData(function (d) {
                                  var s = d.sections.slice();
                                  var qs = s[si].questions.slice();
                                  qs[qi] = Object.assign({}, qs[qi], {
                                    points: Number(e.target.value),
                                  });
                                  s[si] = Object.assign({}, s[si], {
                                    questions: qs,
                                  });
                                  return Object.assign({}, d, { sections: s });
                                });
                              }}
                              style={{
                                width: 44,
                                textAlign: 'center',
                                border: '1.5px solid ' + C.border,
                                borderRadius: 6,
                                padding: '4px',
                                fontSize: 13,
                                color: C.text,
                                outline: 'none',
                                background: C.surface,
                              }}
                            />
                            <span style={{ fontSize: 10, color: C.muted }}>
                              pts
                            </span>
                          </div>
                        </div>
                        {sec.type === 'qcm' &&
                          (q.options || []).map(function (opt, oi) {
                            return (
                              <input
                                key={oi}
                                value={opt}
                                onChange={function (e) {
                                  setExamData(function (d) {
                                    var s = d.sections.slice();
                                    var qs = s[si].questions.slice();
                                    var opts = qs[qi].options.slice();
                                    opts[oi] = e.target.value;
                                    qs[qi] = Object.assign({}, qs[qi], {
                                      options: opts,
                                    });
                                    s[si] = Object.assign({}, s[si], {
                                      questions: qs,
                                    });
                                    return Object.assign({}, d, {
                                      sections: s,
                                    });
                                  });
                                }}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  boxSizing: 'border-box',
                                  marginTop: 4,
                                  border: '1px solid ' + C.border,
                                  borderRadius: 6,
                                  padding: '5px 10px',
                                  fontSize: 12,
                                  color: C.text,
                                  outline: 'none',
                                  background: C.surface,
                                }}
                              />
                            );
                          })}
                        {sec.type === 'ouvertes' && (
                          <div style={{ marginTop: 4 }}>
                            {Array(q.lignes || 4)
                              .fill(0)
                              .map(function (_, li) {
                                return (
                                  <div
                                    key={li}
                                    style={{
                                      borderBottom: '1px solid #d0cce8',
                                      height: 20,
                                      marginTop: 4,
                                    }}
                                  />
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <Ad />
        </div>
      </div>
    );
  }

  if (screen === 'ideas') {
    var cats = ['fonctionnalite', 'bug', 'design', 'contenu', 'autre'];
    var catCols = {
      fonctionnalite: C.accent,
      bug: C.danger,
      design: C.gold,
      contenu: C.success,
      autre: C.muted,
    };
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <button
              onClick={function () {
                setScreen('home');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 800, fontSize: 18 }}>
              💡 Boite a idees
            </span>
          </div>
          {ideaOk ? (
            <div
              style={Object.assign({}, card, {
                textAlign: 'center',
                padding: '40px 24px',
              })}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>
                Merci pour ta suggestion !
              </h2>
              <p style={{ color: C.muted, fontSize: 14, margin: '0 0 24px' }}>
                Ton idee a ete transmise a l'equipe Quizora.
              </p>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <Btn
                  onClick={function () {
                    setIdeaOk(false);
                  }}
                  style={{ width: '100%' }}
                >
                  Soumettre une autre idee
                </Btn>
                <Btn
                  variant="ghost"
                  onClick={function () {
                    setScreen('home');
                  }}
                  style={{ width: '100%' }}
                >
                  Retour a l'accueil
                </Btn>
              </div>
            </div>
          ) : (
            <div style={card}>
              <p
                style={{
                  color: C.muted,
                  fontSize: 13,
                  margin: '0 0 16px',
                  lineHeight: 1.5,
                }}
              >
                Une idee pour ameliorer Quizora ? On est a l'ecoute.
              </p>
              <p
                style={{
                  color: C.muted,
                  fontSize: 12,
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Categorie
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 16,
                }}
              >
                {cats.map(function (cat) {
                  var col = catCols[cat];
                  return (
                    <div
                      key={cat}
                      onClick={function () {
                        setIdeaCat(cat);
                      }}
                      style={{
                        padding: '5px 14px',
                        borderRadius: 20,
                        fontSize: 13,
                        cursor: 'pointer',
                        fontWeight: ideaCat === cat ? 600 : 400,
                        background:
                          ideaCat === cat ? 'rgba(108,99,255,0.1)' : C.bg,
                        border:
                          '1.5px solid ' + (ideaCat === cat ? col : C.border),
                        color: ideaCat === cat ? col : C.muted,
                      }}
                    >
                      {cat}
                    </div>
                  );
                })}
              </div>
              <Inp
                value={ideaTitle}
                onChange={setIdeaTitle}
                placeholder="Titre de ton idee"
                style={{ marginBottom: 12 }}
              />
              <textarea
                value={ideaDesc}
                onChange={function (e) {
                  setIdeaDesc(e.target.value);
                }}
                placeholder="Decris ton idee en detail..."
                rows={5}
                style={{
                  background: C.surface,
                  border: '1.5px solid ' + C.border,
                  borderRadius: 10,
                  padding: '12px 16px',
                  color: C.text,
                  fontSize: 15,
                  width: '100%',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              ></textarea>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                <span style={{ color: C.muted, fontSize: 12 }}>
                  Par {user ? user.name : '?'}
                </span>
                <span
                  style={{
                    color: ideaDesc.length > 500 ? C.danger : C.muted,
                    fontSize: 12,
                  }}
                >
                  {ideaDesc.length + '/500'}
                </span>
              </div>
              <Btn
                onClick={submitIdea}
                disabled={
                  !ideaTitle.trim() ||
                  !ideaDesc.trim() ||
                  ideaLoading ||
                  ideaDesc.length > 500
                }
                style={{ width: '100%' }}
              >
                {ideaLoading ? 'Envoi...' : 'Envoyer mon idee →'}
              </Btn>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={function () {
                setScreen('admin');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 12,
                textDecoration: 'underline',
              }}
            >
              Acces equipe
            </button>
          </div>
          <Ad />
        </div>
      </div>
    );
  }

  if (screen === 'admin') {
    var catCols2 = {
      fonctionnalite: C.accent,
      bug: C.danger,
      design: C.gold,
      contenu: C.success,
      autre: C.muted,
    };
    function renderIdeas() {
      if (adminLoading)
        return (
          <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
            Chargement...
          </div>
        );
      if (adminIdeas.length === 0)
        return (
          <div
            style={Object.assign({}, card, {
              textAlign: 'center',
              padding: 40,
            })}
          >
            <p style={{ color: C.muted, margin: 0 }}>Aucune idee soumise</p>
          </div>
        );
      return adminIdeas.map(function (idea, i) {
        var col = catCols2[idea.category] || C.muted;
        return (
          <div
            key={i}
            style={Object.assign({}, card, { marginBottom: 12, padding: 18 })}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: 20,
                  padding: '2px 10px',
                  fontSize: 11,
                  color: col,
                  fontWeight: 600,
                }}
              >
                {idea.category}
              </span>
              <span style={{ color: C.muted, fontSize: 12 }}>
                {idea.author + ' - ' + idea.date}
              </span>
            </div>
            <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15 }}>
              {idea.title}
            </p>
            <p
              style={{
                margin: 0,
                color: C.muted,
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {idea.desc}
            </p>
          </div>
        );
      });
    }
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <button
              onClick={function () {
                setScreen('ideas');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
            <span style={{ fontWeight: 800, fontSize: 18 }}>
              🔒 Espace equipe
            </span>
          </div>
          {!adminOk ? (
            <div style={card}>
              <p style={{ color: C.muted, fontSize: 13, margin: '0 0 16px' }}>
                Acces reserve a l'equipe Quizora
              </p>
              <Inp
                value={adminPass}
                onChange={setAdminPass}
                placeholder="Mot de passe admin"
                type="password"
                style={{ marginBottom: 12 }}
              />
              <Btn
                onClick={function () {
                  if (adminPass === 'quizora2024') {
                    setAdminOk(true);
                    loadAdminIdeas();
                  } else setAdminPass('');
                }}
                disabled={!adminPass}
                style={{ width: '100%' }}
              >
                Acceder →
              </Btn>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <span style={{ color: C.muted, fontSize: 13 }}>
                  {adminIdeas.length +
                    ' suggestion' +
                    (adminIdeas.length !== 1 ? 's' : '')}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={function () {
                      if (adminIdeas.length === 0) return;
                      var txt =
                        'RECAPITULATIF QUIZORA - ' +
                        new Date().toLocaleDateString('fr-FR') +
                        '\n\n' +
                        adminIdeas
                          .map(function (idea, i) {
                            return (
                              '[' +
                              (i + 1) +
                              '] ' +
                              idea.category.toUpperCase() +
                              ' - ' +
                              idea.title +
                              '\nPar: ' +
                              idea.author +
                              ' le ' +
                              idea.date +
                              '\n' +
                              idea.desc
                            );
                          })
                          .join('\n---\n\n');
                      navigator.clipboard && navigator.clipboard.writeText(txt);
                      alert('Recap copie !');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid ' + C.border,
                      borderRadius: 8,
                      padding: '6px 12px',
                      color: C.text,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    📋 Copier recap
                  </button>
                  <button
                    onClick={loadAdminIdeas}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: C.accent,
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    ↻ Actualiser
                  </button>
                </div>
              </div>
              {renderIdeas()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'setup')
    return (
      <div style={root}>
        <div style={wrap}>
          <button
            onClick={function () {
              setScreen('home');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: C.muted,
              cursor: 'pointer',
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            ← Retour
          </button>
          <div style={card}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Creer une room</h2>
            <p style={{ color: C.muted, fontSize: 13, margin: '0 0 20px' }}>
              Connecte en tant que{' '}
              <b style={{ color: C.accent }}>{user ? user.name : ''}</b>
            </p>
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Domaine
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginBottom: 16,
              }}
            >
              {DOMAINS.map(function (d) {
                return (
                  <div
                    key={d.id}
                    onClick={function () {
                      setDomain(d);
                      setSub('');
                    }}
                    style={{
                      background:
                        domain && domain.id === d.id
                          ? 'rgba(108,99,255,0.1)'
                          : C.bg,
                      border:
                        '1.5px solid ' +
                        (domain && domain.id === d.id ? C.accent : C.border),
                      borderRadius: 10,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{d.icon}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: domain && domain.id === d.id ? C.accent : C.text,
                      }}
                    >
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {domain && (
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    color: C.muted,
                    fontSize: 12,
                    margin: '0 0 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Specialite
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Tag
                    active={!sub}
                    onClick={function () {
                      setSub('');
                    }}
                  >
                    General
                  </Tag>
                  {domain.sub.map(function (s) {
                    return (
                      <Tag
                        key={s}
                        active={sub === s}
                        onClick={function () {
                          setSub(s);
                        }}
                      >
                        {s}
                      </Tag>
                    );
                  })}
                </div>
              </div>
            )}
            <p
              style={{
                color: C.muted,
                fontSize: 12,
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Mode de jeu
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 16,
              }}
            >
              {GMODES.map(function (m) {
                return (
                  <div
                    key={m.id}
                    onClick={function () {
                      if (!m.disabled) setGMode(m.id);
                    }}
                    style={{
                      background:
                        gMode === m.id ? 'rgba(108,99,255,0.08)' : C.bg,
                      border:
                        '1.5px solid ' + (gMode === m.id ? C.accent : C.border),
                      borderRadius: 10,
                      padding: '12px 16px',
                      cursor: m.disabled ? 'not-allowed' : 'pointer',
                      opacity: m.disabled ? 0.45 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: 14,
                          color: gMode === m.id ? C.accent : C.text,
                        }}
                      >
                        {m.label}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: m.disabled ? C.danger : C.muted,
                        }}
                      >
                        {m.desc}
                      </p>
                    </div>
                    {!m.disabled && (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border:
                            '2px solid ' +
                            (gMode === m.id ? C.accent : C.border),
                          background: gMode === m.id ? C.accent : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {gMode === m.id && (
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: '#fff',
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <p
                  style={{
                    color: C.muted,
                    fontSize: 12,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Questions
                </p>
                <span
                  style={{ color: C.accent, fontWeight: 800, fontSize: 20 }}
                >
                  {qCount}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[5, 10, 15, 20, 30].map(function (n) {
                  return (
                    <div
                      key={n}
                      onClick={function () {
                        setQCount(n);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: 8,
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 14,
                        background:
                          qCount === n ? 'rgba(108,99,255,0.15)' : C.bg,
                        border:
                          '1.5px solid ' + (qCount === n ? C.accent : C.border),
                        color: qCount === n ? C.accent : C.muted,
                      }}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <p
                  style={{
                    color: C.muted,
                    fontSize: 12,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Joueurs
                </p>
                <span
                  style={{ color: C.accent, fontWeight: 800, fontSize: 20 }}
                >
                  {pCount}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[2, 3, 4, 5, 6, 8].map(function (n) {
                  return (
                    <div
                      key={n}
                      onClick={function () {
                        setPCount(n);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: 8,
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 15,
                        background:
                          pCount === n ? 'rgba(108,99,255,0.15)' : C.bg,
                        border:
                          '1.5px solid ' + (pCount === n ? C.accent : C.border),
                        color: pCount === n ? C.accent : C.muted,
                      }}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
            <Btn
              onClick={function () {
                setCourseMode(false);
                startLobby(false);
              }}
              disabled={!domain}
              style={{ width: '100%' }}
            >
              Creer la room →
            </Btn>
          </div>
        </div>
      </div>
    );

  if (screen === 'lobby') {
    var joinedCount = lobby.filter(function (p) {
      return p.joined;
    }).length;
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 22,
            }}
          >
            <Logo size={24} />
            <button
              onClick={function () {
                setScreen(courseMode ? 'upload' : 'setup');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.muted,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Quitter
            </button>
          </div>
          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <div>
                <p
                  style={{
                    color: C.muted,
                    fontSize: 11,
                    margin: '0 0 4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Code de la room
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    color: C.accent,
                  }}
                >
                  {roomCode}
                </p>
              </div>
              <button
                onClick={function () {
                  if (navigator.clipboard)
                    navigator.clipboard
                      .writeText(roomCode)
                      .catch(function () {});
                  setCopied(true);
                  setTimeout(function () {
                    setCopied(false);
                  }, 2000);
                }}
                style={{
                  background: copied ? 'rgba(22,163,74,0.1)' : C.bg,
                  border: '1.5px solid ' + (copied ? C.success : C.border),
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: copied ? C.success : C.muted,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {copied ? '✓ Copie' : 'Copier'}
              </button>
            </div>
            <div
              style={{
                background: C.bg,
                borderRadius: 8,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>{domain ? domain.icon : '📚'}</span>
              <span style={{ fontSize: 13 }}>
                {sub || (domain ? domain.label : 'Mon cours')}
              </span>
              <span
                style={{ marginLeft: 'auto', fontSize: 12, color: C.muted }}
              >
                {THEMES.find(function (t) {
                  return t.id === theme;
                })
                  ? THEMES.find(function (t) {
                      return t.id === theme;
                    }).icon +
                    ' ' +
                    THEMES.find(function (t) {
                      return t.id === theme;
                    }).label
                  : ''}
              </span>
            </div>
          </div>
          <div style={card}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>Joueurs</p>
              <span
                style={{
                  color: joinedCount === lobby.length ? C.success : C.warn,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {joinedCount + '/' + lobby.length}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                marginBottom: 20,
              }}
            >
              {lobby.map(function (p, i) {
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: C.bg,
                      borderRadius: 10,
                      padding: '10px 14px',
                      border:
                        '1.5px solid ' +
                        (p.joined
                          ? p.isUser
                            ? 'rgba(108,99,255,0.5)'
                            : C.border
                          : C.border),
                      opacity: p.joined ? 1 : 0.4,
                      transition: 'all 0.4s',
                    }}
                  >
                    {p.joined ? (
                      <Av
                        letter={p.avatar}
                        isUser={p.isUser}
                        size={34}
                        country={p.isUser && user ? user.country : null}
                        photo={p.isUser ? avatarPhoto : null}
                        emoji={p.isUser && !avatarPhoto ? avatarEmoji : null}
                      />
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          border: '2px dashed ' + C.border,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: C.muted,
                            animation: 'blink 1.1s infinite',
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: p.isUser
                            ? C.accent
                            : p.joined
                            ? C.text
                            : C.muted,
                        }}
                      >
                        {p.joined ? p.name : 'En attente...'}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                        {p.isUser ? 'Toi - hote' : 'Bot IA'}
                      </p>
                    </div>
                    {p.joined && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: C.success,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {!lobbyOk ? (
              <div
                style={{
                  background: C.bg,
                  borderRadius: 10,
                  padding: '14px',
                  textAlign: 'center',
                  color: C.muted,
                  fontSize: 14,
                }}
              >
                Les bots rejoignent...
              </div>
            ) : (
              <div>
                <div
                  style={{
                    background: 'rgba(22,163,74,0.1)',
                    border: '1px solid rgba(22,163,74,0.3)',
                    borderRadius: 10,
                    padding: '12px',
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: C.success,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    ✓ Tout le monde est pret !
                  </p>
                </div>
                <Btn
                  variant="success"
                  onClick={launchQuiz}
                  style={{ width: '100%', fontSize: 16, padding: '14px' }}
                >
                  🚀 Demarrer le quiz
                </Btn>
              </div>
            )}
          </div>
          <Ad />
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      </div>
    );
  }

  if (screen === 'loading')
    return (
      <div
        style={Object.assign({}, root, {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Logo size={40} />
        <p style={{ color: C.muted, marginTop: 32, fontSize: 15 }}>
          L'IA genere tes questions...
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(function (i) {
            return (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: C.accent,
                  animation: 'dot 1.2s ' + i * 0.2 + 's infinite',
                }}
              />
            );
          })}
        </div>
        <style>{`@keyframes dot{0%,100%{opacity:0.2}50%{opacity:1}}`}</style>
      </div>
    );

  if (screen === 'quiz' && qRef.current.length > 0) {
    var q = qRef.current[qIdx];
    var totalQ = qRef.current.length;
    if (theme === 'classroom') {
      return (
        <ClassroomScene
          question={q}
          players={sorted}
          timer={timer}
          score={score}
          onAnswer={handleAnswer}
          answered={answered}
          selected={sel}
          currentQ={qIdx}
          totalQ={totalQ}
          roomCode={roomCode}
        />
      );
    }
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Logo size={20} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: C.muted, fontSize: 12 }}>
                Room <b style={{ color: C.accent }}>{roomCode}</b>
              </span>
              <div
                style={{
                  background:
                    timer <= 5 ? 'rgba(220,38,38,0.1)' : 'rgba(108,99,255,0.1)',
                  border: '1px solid ' + (timer <= 5 ? C.danger : C.accent),
                  borderRadius: 20,
                  padding: '4px 14px',
                  fontSize: 16,
                  fontWeight: 800,
                  color: timer <= 5 ? C.danger : C.accent,
                }}
              >
                {timer + 's'}
              </div>
            </div>
          </div>
          <div
            style={{
              background: C.border,
              borderRadius: 4,
              height: 4,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: C.accent,
                height: '100%',
                borderRadius: 4,
                width: (qIdx / totalQ) * 100 + '%',
                transition: 'width 0.4s',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span style={{ color: C.muted, fontSize: 13 }}>
              {'Q' + (qIdx + 1) + '/' + totalQ}
            </span>
            <span style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>
              {'⭐ ' + score}
            </span>
          </div>
          <div style={Object.assign({}, card, { marginBottom: 14 })}>
            <p
              style={{
                fontSize: 17,
                fontWeight: 500,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {q ? q.question : ''}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
              marginBottom: 14,
            }}
          >
            {q &&
              q.options &&
              q.options.map(function (opt, i) {
                var bg = C.surface,
                  border = C.border,
                  color = C.text;
                if (answered) {
                  if (i === q.correct) {
                    bg = 'rgba(22,163,74,0.1)';
                    border = C.success;
                    color = C.success;
                  } else if (i === sel) {
                    bg = 'rgba(220,38,38,0.1)';
                    border = C.danger;
                    color = C.danger;
                  }
                }
                return (
                  <div
                    key={i}
                    onClick={function () {
                      if (!answered) handleAnswer(i);
                    }}
                    style={{
                      background: bg,
                      border: '1px solid ' + border,
                      borderRadius: 12,
                      padding: '13px 16px',
                      cursor: answered ? 'default' : 'pointer',
                      color: color,
                      fontSize: 15,
                      transition: 'all 0.15s',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: C.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.muted,
                        flexShrink: 0,
                      }}
                    >
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    {opt}
                  </div>
                );
              })}
          </div>
          <div style={Object.assign({}, card, { padding: '10px 14px' })}>
            {sorted.map(function (p, i) {
              return (
                <div
                  key={p.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '5px 0',
                  }}
                >
                  <span
                    style={{
                      color: rankColor(i),
                      fontWeight: 700,
                      fontSize: 12,
                      width: 22,
                    }}
                  >
                    {'#' + (i + 1)}
                  </span>
                  <Av
                    letter={p.avatar}
                    isUser={p.isUser}
                    size={26}
                    photo={p.isUser ? avatarPhoto : null}
                    emoji={p.isUser && !avatarPhoto ? avatarEmoji : null}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      flex: 1,
                      color: p.isUser ? C.accent : C.text,
                    }}
                  >
                    {p.name}
                  </span>
                  <span
                    style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}
                  >
                    {p.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'results')
    return (
      <div style={root}>
        <div style={wrap}>
          <div
            style={{ textAlign: 'center', paddingTop: 40, marginBottom: 24 }}
          >
            <Logo size={28} />
            <div style={{ fontSize: 48, marginTop: 20 }}>
              {sorted[0] && sorted[0].isUser ? '🏆' : '😤'}
            </div>
            <h2 style={{ margin: '10px 0 4px', fontSize: 22 }}>
              {sorted[0] && sorted[0].isUser ? 'Victoire !' : 'Quiz termine !'}
            </h2>
            {newBadges.length > 0 && (
              <div
                style={{
                  background: '#fef3c7',
                  border: '1.5px solid #f59e0b',
                  borderRadius: 10,
                  padding: '8px 14px',
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                }}
                onClick={function () {
                  setNewBadges([]);
                  setScreen('profile');
                }}
              >
                <span style={{ fontSize: 20 }}>🏅</span>
                <div style={{ textAlign: 'left' }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: 13,
                      color: '#92400e',
                    }}
                  >
                    {newBadges.length +
                      ' badge' +
                      (newBadges.length > 1 ? 's' : '') +
                      ' debloque' +
                      (newBadges.length > 1 ? 's' : '') +
                      ' !'}
                  </p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                    {newBadges.map(function (bid) {
                      var b = BADGES.find(function (x) {
                        return x.id === bid;
                      });
                      return b ? <span key={bid}>{b.icon}</span> : null;
                    })}
                  </div>
                </div>
              </div>
            )}
            <p style={{ color: C.muted, margin: '0 0 4px', fontSize: 14 }}>
              {courseMode
                ? courseContent
                  ? courseContent.name
                  : ''
                : sub || (domain ? domain.label : '')}
            </p>
            {courseMode ? (
              <span
                style={{
                  background: 'rgba(217,119,6,0.1)',
                  border: '1px solid rgba(217,119,6,0.3)',
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: 12,
                  color: C.warn,
                }}
              >
                Hors classement
              </span>
            ) : (
              <p style={{ color: C.success, fontSize: 13, margin: 0 }}>
                Score enregistre dans le classement
              </p>
            )}
          </div>
          <div style={Object.assign({}, card, { marginBottom: 16 })}>
            {sorted.map(function (p, i) {
              return (
                <div
                  key={p.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom:
                      i < sorted.length - 1 ? '1px solid ' + C.border : 'none',
                  }}
                >
                  <span
                    style={{ fontSize: 22, width: 28, textAlign: 'center' }}
                  >
                    {['🥇', '🥈', '🥉'][i] || '#' + (i + 1)}
                  </span>
                  <Av
                    letter={p.avatar}
                    isUser={p.isUser}
                    size={36}
                    country={p.isUser && user ? user.country : null}
                    photo={p.isUser ? avatarPhoto : null}
                    emoji={p.isUser && !avatarPhoto ? avatarEmoji : null}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color: p.isUser ? C.accent : C.text,
                      }}
                    >
                      {p.name}
                      {p.isUser && (
                        <span
                          style={{
                            fontSize: 11,
                            color: C.muted,
                            fontWeight: 400,
                          }}
                        >
                          {' '}
                          (toi)
                        </span>
                      )}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                      {p.isBot ? 'Bot IA' : 'Joueur'}
                    </p>
                  </div>
                  <span
                    style={{ color: C.gold, fontWeight: 800, fontSize: 17 }}
                  >
                    {p.score}
                  </span>
                </div>
              );
            })}
          </div>
          <Ad />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 16,
            }}
          >
            <Btn
              onClick={function () {
                loadLb();
                setScreen('leaderboard');
              }}
              style={{ width: '100%' }}
            >
              🏆 Voir le classement
            </Btn>
            <Btn
              variant="ghost"
              onClick={function () {
                setDomain(null);
                setSub('');
                setScreen('setup');
              }}
              style={{ width: '100%' }}
            >
              Nouvelle partie
            </Btn>
            <Btn
              variant="ghost"
              onClick={function () {
                setScreen('home');
              }}
              style={{ width: '100%' }}
            >
              Accueil
            </Btn>
          </div>
          <div
            style={{
              marginTop: 20,
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.25)',
              borderRadius: 14,
              padding: 18,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 6px',
                fontWeight: 700,
                color: C.gold,
                fontSize: 15,
              }}
            >
              ✦ Quizora Premium
            </p>
            <p style={{ margin: '0 0 14px', color: C.muted, fontSize: 13 }}>
              Sans pub - Stats detaillees - Acces illimite
            </p>
            <Btn variant="gold" style={{ fontSize: 13, padding: '8px 20px' }}>
              Decouvrir les offres
            </Btn>
          </div>
        </div>
      </div>
    );

  return (
    <div
      style={Object.assign({}, root, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Logo size={36} />
    </div>
  );
}
