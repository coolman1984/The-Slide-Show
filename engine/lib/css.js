'use strict';
/*
 * CSS GENERATOR — emits the complete stylesheet for a deck.
 * Everything brand-specific flows through CSS custom properties set from the
 * theme; accent-variant details (division colors, card edge colors, avatar
 * gradients) are emitted as inline styles by the renderers, so this file
 * stays theme-agnostic.
 */

function rootVars(theme) {
  const c = theme.colors, l = theme.light, s = theme.semantic, a = theme.accents;
  return `:root{
  --font-h:${theme.fonts.heading};
  --font-b:${theme.fonts.body};
  --r-card:${theme.radius.card}; --r-card-lg:${theme.radius.cardLg}; --r-card-xl:${theme.radius.cardXl};
  --text-hi:${c.textHi}; --text-mid:${c.textMid}; --text-low:${c.textLow};
  --card-bg:${c.cardBg}; --card-border:${c.cardBorder};
  --chip-bg:${c.chipBg}; --badge-bg:${c.badgeBg}; --badge-border:${c.badgeBorder};
  --rule:${c.rule}; --rule-soft:${c.ruleSoft}; --connector:${c.connector};
  --glow:${c.glow};
  --acc1:${a.a1.color}; --acc1-bright:${a.a1.bright}; --acc1-glow:${a.a1.glow};
  --acc2:${a.a2.color}; --acc2-glow:${a.a2.glow};
  --acc3:${a.a3.color}; --acc3-glow:${a.a3.glow};
  --acc4:${a.a4.color}; --acc4-glow:${a.a4.glow};
  --l-bg:${l.bg}; --l-panel:${l.panel}; --l-card:${l.card}; --l-card-brd:${l.cardBorder};
  --l-header:${l.header}; --l-title:${l.title}; --l-text:${l.text}; --l-text-soft:${l.textSoft};
  --l-foot:${l.footText}; --l-foot-rule:${l.footRule};
  --sem-green:${s.green.fg}; --sem-green-bg:${s.green.bg};
  --sem-blue:${s.blue.fg}; --sem-blue-bg:${s.blue.bg};
  --sem-orange:${s.orange.fg}; --sem-orange-bg:${s.orange.bg};
  --sem-prep:${s.prep}; --sem-mvp:${s.mvp}; --sem-augred:${s.augred};
  --ease:cubic-bezier(.22,.9,.3,1);
}`;
}

/* Scoped light-palette overrides for slides that use themeOverride */
function overrideVars(name, theme) {
  const l = theme.light;
  return `.ovr-${name}{
  --l-bg:${l.bg}; --l-panel:${l.panel}; --l-card:${l.card}; --l-card-brd:${l.cardBorder};
  --l-header:${l.header}; --l-title:${l.title}; --l-text:${l.text}; --l-text-soft:${l.textSoft};
  --l-foot:${l.footText}; --l-foot-rule:${l.footRule};
}`;
}

function baseCss(theme) {
  return `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:${theme.background.page}}
body{font-family:var(--font-b);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
h1,h2,h3,h4{font-family:var(--font-h)}

#stage{position:absolute;top:50%;left:50%;width:1920px;height:1080px;
  transform:translate(-50%,-50%) scale(1);
  background:${theme.background.stage};
  overflow:hidden}
#fx{position:absolute;inset:0;z-index:0}
.orb{position:absolute;border-radius:50%;filter:blur(90px);opacity:.32;z-index:0;animation:orbFloat 22s ease-in-out infinite}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-50px) scale(1.12)}66%{transform:translate(-50px,40px) scale(.94)}}

.slide{position:absolute;inset:0;z-index:1;opacity:0;visibility:hidden;
  transform:translateX(calc(44px * var(--dir,1)));
  transition:opacity .5s var(--ease),transform .5s var(--ease),visibility 0s linear .5s}
.slide.active{opacity:1;visibility:visible;transform:none;transition-delay:0s}
.slide.leaving{opacity:0;visibility:visible;transform:translateX(calc(-44px * var(--dir,1)));transition-delay:0s}
.trans-fade .slide{transform:none}
.trans-fade .slide.leaving{transform:none}
.trans-zoom .slide{transform:scale(.955)}
.trans-zoom .slide.leaving{transform:scale(1.035)}
.trans-zoom .slide.active{transform:none}

.a{opacity:0}
.play .a-up  {animation:kUp   .6s var(--ease) var(--d,0s) both}
.play .a-left{animation:kLeft .6s var(--ease) var(--d,0s) both}
.play .a-pop {animation:kPop  .55s var(--ease) var(--d,0s) both}
.play .a-fade{animation:kFade .6s ease var(--d,0s) both}
.play .a-drop{animation:kDrop .5s var(--ease) var(--d,0s) both}
.play .a-zoom{animation:kZoom .7s var(--ease) var(--d,0s) both}
.play .a-wipe{animation:kWipe .5s var(--ease) var(--d,0s) both;transform-origin:left center}
.play .a-wipe.from-center{transform-origin:center center}
@keyframes kUp  {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes kLeft{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:none}}
@keyframes kPop {0%{opacity:0;transform:scale(.5)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes kFade{from{opacity:0}to{opacity:1}}
@keyframes kDrop{from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:none}}
@keyframes kZoom{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes kWipe{from{opacity:1;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}
@keyframes kBreathe{0%,100%{filter:drop-shadow(0 0 5px rgba(var(--glow),.30))}50%{filter:drop-shadow(0 0 15px rgba(var(--glow),.65))}}
.breathe{animation:kBreathe 4s ease-in-out infinite}

.foot{position:absolute;left:65px;right:65px;bottom:32px;z-index:2}
.foot .rule{height:1px;background:var(--rule);position:relative;margin-bottom:15px}
.foot .rule::after{content:"";position:absolute;right:0;top:-1px;width:60px;height:3px;background:var(--acc1);box-shadow:0 0 10px rgba(var(--glow),.7);border-radius:2px}
.foot .flabel{display:flex;align-items:center;gap:10px;font-size:13px;letter-spacing:.25em;color:var(--text-low);font-weight:600}
.foot svg{width:14px;height:14px;color:var(--text-low)}

.shead{display:flex;align-items:center;gap:20px;padding:34px 0 0 42px}
.shead .idx{font-size:54px;font-weight:800;font-family:var(--font-h);color:var(--acc1);line-height:1;text-shadow:0 0 18px rgba(var(--glow),.5)}
.shead .sep{width:5px;height:48px;background:var(--text-hi);opacity:.92;border-radius:2px}
.shead h2{font-size:54px;font-weight:800;color:var(--text-hi);line-height:1;letter-spacing:.01em}
.dpill{display:inline-flex;align-items:center;border-radius:999px;border:1px solid;font-weight:700}
`;
}

const COMPONENT_CSS = `
/* ---- title / closing ---- */
.sl-title,.sl-closing{display:flex;align-items:center;justify-content:center}
.sl-title .stack,.sl-closing .stack{text-align:center;margin-top:-70px;max-width:1700px}
.sl-title h1,.sl-closing h1{font-size:92px;font-weight:700;color:var(--text-hi);letter-spacing:.005em}
.sl-title .divider,.sl-closing .divider{position:relative;width:280px;height:5px;margin:44px auto 0}
.sl-title .divider .line,.sl-closing .divider .line{position:absolute;left:0;right:0;top:2px;height:2px;background:linear-gradient(90deg,transparent,rgba(var(--glow),.55),transparent)}
.sl-title .divider .bar,.sl-closing .divider .bar{position:absolute;left:50%;top:0;width:72px;height:5px;transform:translateX(-50%);background:var(--acc1);border-radius:3px;box-shadow:0 0 14px rgba(var(--glow),.9)}
.sl-title .date,.sl-closing .date{margin-top:44px;font-size:30px;font-weight:500;color:var(--text-mid)}
.sl-closing .points{display:flex;gap:22px;justify-content:center;margin-top:56px;flex-wrap:wrap}
.sl-closing .pt{border:1px solid var(--card-border);background:var(--card-bg);border-radius:999px;padding:14px 34px;font-size:24px;font-weight:600;color:var(--text-mid)}

/* ---- agenda ---- */
.sl-agenda .h2head{display:flex;align-items:center;gap:24px;padding:58px 0 0 66px}
.sl-agenda .vbar{width:9px;height:62px;background:var(--acc1);border-radius:2px;box-shadow:0 0 16px rgba(var(--glow),.65)}
.sl-agenda h2{font-size:66px;font-weight:800;color:var(--text-hi);line-height:1}
.sl-agenda .agenda{margin:52px 0 0 142px}
.sl-agenda .arow{display:flex;align-items:center;gap:46px;min-height:66px}
.sl-agenda .num{flex:none;width:58px;height:58px;border-radius:50%;border:2px solid var(--acc1);display:flex;align-items:center;justify-content:center;font-size:29px;font-weight:600;color:var(--text-hi);box-shadow:0 0 16px rgba(var(--glow),.30),inset 0 0 10px rgba(var(--glow),.12)}
.sl-agenda .txt{font-size:32px;font-weight:600;color:var(--text-hi)}
.sl-agenda .agline{height:1px;background:var(--rule-soft);margin:14px 0 14px 102px;width:1245px}

/* ---- org chart ---- */
.sl-org .orgrow{display:flex;align-items:center;padding:0 232px;margin-top:4px}
.sl-org .conn{flex:1;height:2px;background:var(--connector);min-width:40px}
.sl-org .node{border-radius:var(--r-card-lg);background:var(--card-bg);padding:12px 26px;text-align:center}
.sl-org .node.leader{position:relative;border:2px solid var(--acc4);box-shadow:0 0 26px rgba(var(--acc4-glow),.35);min-width:340px;padding:14px 34px}
.sl-org .leader .ltitle{font-size:26px;font-weight:700;color:var(--acc4)}
.sl-org .leader .lname{font-size:31px;font-weight:800;font-family:var(--font-h);color:var(--text-hi);margin-top:2px}
.sl-org .leader .drop{position:absolute;left:50%;top:100%;width:2px;height:42px;background:var(--connector)}
.sl-org .node.side{border:1.5px solid rgba(var(--acc1-glow),.55);box-shadow:0 0 18px rgba(var(--acc1-glow),.12);min-width:300px}
.sl-org .node.side.right{border-color:rgba(var(--acc2-glow),.6);box-shadow:0 0 18px rgba(var(--acc4-glow),.15);text-align:left;padding:10px 26px}
.sl-org .side .ntitle{font-size:24px;font-weight:700;color:var(--acc1);margin-bottom:4px}
.sl-org .side.right .ntitle{background:linear-gradient(90deg,var(--acc1),var(--acc2));-webkit-background-clip:text;background-clip:text;color:transparent}
.sl-org .side .nm{font-size:23px;font-weight:600;color:var(--text-hi);line-height:1.42}
.sl-org .side.right .nm{font-size:21px;line-height:1.38}
.sl-org .divs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:46px;padding:0 64px;margin-top:26px}
.sl-org .dhead{display:flex;align-items:center;justify-content:space-between}
.sl-org .dhead h3{font-size:30px;font-weight:800;color:var(--text-hi);letter-spacing:.02em}
.sl-org .mpill{font-size:19px;padding:5px 18px}
.sl-org .dunder{height:2px;background:var(--rule);margin-top:12px;position:relative}
.sl-org .dunder i{position:absolute;left:0;top:-3px;width:8px;height:8px;border-radius:50%}
.sl-org .cards{display:flex;flex-direction:column;gap:11px;margin-top:16px}
.sl-org .cards.airy{gap:34px;margin-top:20px}
.sl-org .tcard{border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);padding:10px 16px;box-shadow:0 0 20px rgba(var(--glow),.05)}
.sl-org .cards.airy .tcard{padding:18px 18px}
.sl-org .thead{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
.sl-org .tname{font-size:24px;font-weight:700}
.sl-org .cnt{width:30px;height:30px;border-radius:8px;border:1px solid var(--badge-border);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--text-hi);background:var(--badge-bg)}
.sl-org .mem{display:flex;align-items:center;gap:12px;height:37px}
.sl-org .av{flex:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;letter-spacing:.02em}
.sl-org .mname{font-size:21.5px;font-weight:600;color:var(--text-hi);white-space:nowrap}
.sl-org .mrole{font-size:19px;color:var(--text-low);white-space:nowrap}

/* ---- card sections (roles etc.) ---- */
.sl-cards .bullet{display:flex;align-items:center;gap:24px;margin:34px 0 0 66px}
.sl-cards .chk{flex:none;width:30px;height:30px;border:3px solid var(--acc1);border-radius:7px;box-shadow:0 0 10px rgba(var(--glow),.35)}
.sl-cards .bullet h3{font-size:37px;font-weight:800;color:var(--text-hi)}
.sl-cards .subs{margin:12px 0 0 122px}
.sl-cards .subs div{font-size:26px;color:var(--text-mid);line-height:1.65}
.sl-cards .subs .dash{color:var(--acc1);font-weight:700;margin-right:14px}
.sl-cards .rolewrap{display:grid;gap:48px;padding:0 66px;margin-top:36px}
.sl-cards .seclab{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.sl-cards .seclab svg{width:30px;height:30px}
.sl-cards .seclab span{font-size:22px;font-weight:800;letter-spacing:.08em;white-space:nowrap}
.sl-cards .seclab .rline{flex:1;height:1px;background:var(--rule)}
.sl-cards .rgrid{display:grid;gap:20px}
.rcard{border-radius:var(--r-card-lg);background:var(--card-bg);border:1px solid var(--card-border);padding:24px 26px;min-height:246px;border-left:3px solid}
.rcard .rtop{display:flex;align-items:flex-start;justify-content:space-between}
.ichip{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--chip-bg);border:1.5px solid}
.ichip svg{width:27px;height:27px}
.rbadge{border:1px solid var(--badge-border);border-radius:8px;padding:6px 13px;font-size:16px;font-weight:700;letter-spacing:.12em;color:var(--text-hi);background:var(--badge-bg)}
.rcard h4{font-size:29px;font-weight:800;color:var(--text-hi);margin:16px 0 10px}
.rcard p{font-size:20.5px;line-height:1.5;color:var(--text-mid)}

/* ---- timeline matrix (light) ---- */
.sl-tl{display:flex;flex-direction:column;padding:30px 40px 22px;background:var(--l-bg)}
.sl-tl .ltop{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px}
.sl-tl .ltl{display:flex;align-items:center;gap:14px;font-size:22px;font-weight:600;color:var(--l-text);padding-top:8px}
.sl-tl .lbar{width:6px;height:34px;background:var(--l-title);border-radius:2px}
.sl-tl .ltr{font-size:40px;font-weight:800;color:var(--l-title);letter-spacing:.01em}
.sl-tl .tlgrid{flex:1;display:grid;gap:14px;min-height:0}
.sl-tl .tlh{background:var(--l-header);border-radius:8px;color:#fff;font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center}
.sl-tl .tlproj{background:var(--l-panel);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;color:var(--l-text)}
.pcard{background:var(--l-card);border:1px solid var(--l-card-brd);border-top:3px solid var(--sem-green);border-radius:10px;box-shadow:0 2px 6px rgba(27,42,65,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;padding:10px 14px;text-align:center}
.pcard .pname{font-size:23px;font-weight:600;color:var(--l-text);line-height:1.3}
.pcard .prow{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.spill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:5px 15px;font-size:17px;font-weight:700}
.spill i{width:8px;height:8px;border-radius:50%}
.spill.completed{background:var(--sem-green-bg);color:var(--sem-green)}   .spill.completed i{background:var(--sem-green)}
.spill.inprogress{background:var(--sem-blue-bg);color:var(--sem-blue)} .spill.inprogress i{background:var(--sem-blue)}
.spill.planning{background:var(--sem-orange-bg);color:var(--sem-orange)}  .spill.planning i{background:var(--sem-orange)}
.sbadge{display:inline-flex;align-items:center;border-radius:6px;padding:5px 12px;font-size:16px;font-weight:800;color:#fff;letter-spacing:.03em}
.sl-tl .legend{display:flex;align-items:center;gap:44px;margin:20px 0 0 12px}
.sl-tl .legend .li{display:flex;align-items:center;gap:12px;font-size:19px;color:var(--l-text-soft);font-weight:500}
.sl-tl .legend .sq{width:17px;height:17px;border-radius:4px}
.sl-tl .lfoot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--l-foot-rule);margin-top:18px;padding-top:14px;font-size:19px;color:var(--l-foot)}

/* ---- comparison ---- */
.sl-compare .sub{padding:10px 0 0 122px;font-size:28px;color:var(--text-mid)}
.sl-compare .seclab{display:flex;align-items:center;gap:14px;margin:38px 66px 0}
.sl-compare .seclab svg{width:27px;height:27px;color:var(--acc1)}
.sl-compare .seclab span{font-size:26px;font-weight:800;color:var(--acc1);white-space:nowrap}
.sl-compare .seclab .rline{flex:1;height:1px;background:linear-gradient(90deg,rgba(var(--glow),.5),rgba(var(--glow),0))}
.sl-compare .models{display:grid;gap:20px;padding:0 66px;margin-top:28px}
.mcard{border-radius:var(--r-card-xl);background:var(--card-bg);border:1px solid var(--card-border);padding:30px 32px;min-height:330px;border-left:2px solid}
.mcard .mtop{display:flex;align-items:center;gap:22px}
.mcard .ichip{width:68px;height:68px}
.mcard .ichip svg{width:34px;height:34px}
.mcard .mname{font-size:38px;font-weight:800;font-family:var(--font-h);color:var(--text-hi)}
.mcard .mline{display:block;height:3px;width:92px;border-radius:2px;margin-top:7px}
.mcard p{font-size:22.5px;line-height:1.55;color:var(--text-mid);margin-top:20px}
.sl-compare .banner{margin:22px 66px 0;border-radius:var(--r-card-xl);background:var(--card-bg);border:1px solid var(--card-border);border-left:3px solid var(--acc1);box-shadow:-6px 0 26px -8px rgba(var(--glow),.4);display:flex;gap:32px;align-items:flex-start;padding:34px 42px}
.sl-compare .banner .ichip{flex:none;width:84px;height:84px}
.sl-compare .banner .ichip svg{width:42px;height:42px}
.sl-compare .banner h4{font-size:40px;font-weight:800;color:var(--text-hi);margin-bottom:14px}
.sl-compare .banner p{font-size:26px;line-height:1.6;color:var(--text-mid)}

/* ---- section divider ---- */
.sl-section{display:flex;align-items:center;justify-content:center}
.sl-section .wrap{display:flex;align-items:center;gap:56px;margin-top:-40px;padding:0 120px}
.sl-section .bigidx{font-size:210px;font-weight:800;font-family:var(--font-h);line-height:1;color:var(--acc1);text-shadow:0 0 60px rgba(var(--glow),.45)}
.sl-section .sbar{width:6px;height:210px;background:linear-gradient(180deg,var(--acc1),transparent);border-radius:3px}
.sl-section .stitle{font-size:76px;font-weight:800;color:var(--text-hi);line-height:1.15}
.sl-section .ssub{font-size:32px;color:var(--text-mid);margin-top:22px;max-width:1100px}

/* ---- bullet groups ---- */
.sl-bullets .sub{padding:10px 0 0 122px;font-size:28px;color:var(--text-mid)}
.sl-bullets .groups{display:grid;gap:26px;padding:0 66px;margin-top:40px}
.bgroup{border-radius:var(--r-card-lg);background:var(--card-bg);border:1px solid var(--card-border);padding:30px 34px;border-left:3px solid}
.bgroup .ghead{display:flex;align-items:center;gap:18px;margin-bottom:20px}
.bgroup .ghead .ichip{width:52px;height:52px}
.bgroup .ghead .ichip svg{width:25px;height:25px}
.bgroup h4{font-size:30px;font-weight:800;color:var(--text-hi)}
.bgroup li{list-style:none;display:flex;gap:16px;font-size:23px;line-height:1.5;color:var(--text-mid);margin-bottom:14px}
.bgroup li .bdash{font-weight:800;flex:none}

/* ---- KPI tiles ---- */
.sl-kpi{display:flex;flex-direction:column}
.sl-kpi .sub{padding:10px 0 0 122px;font-size:28px;color:var(--text-mid)}
.sl-kpi .tiles{display:grid;gap:26px;padding:0 66px;margin:auto 0;transform:translateY(-30px)}
.ktile{border-radius:var(--r-card-xl);background:var(--card-bg);border:1px solid var(--card-border);border-top:3px solid;padding:44px 38px;text-align:center}
.ktile .kval{font-size:96px;font-weight:800;font-family:var(--font-h);line-height:1}
.ktile .klabel{font-size:28px;font-weight:700;color:var(--text-hi);margin-top:18px}
.ktile .ksub{font-size:21px;color:var(--text-low);margin-top:10px;line-height:1.45}

/* ---- kpi dashboard ---- */
.sl-kpi-dashboard{display:flex;flex-direction:column}
.sl-kpi-dashboard .sub{padding:10px 0 0 122px;font-size:28px;color:var(--text-mid)}
.sl-kpi-dashboard .kpi-rows{display:flex;flex-direction:column;gap:30px;padding:0 66px;margin:auto 0;transform:translateY(-20px)}
.sl-kpi-dashboard .krow{display:flex;flex-direction:column;gap:18px}
.sl-kpi-dashboard .krow-label{font-size:24px;font-weight:700;color:var(--text-mid);letter-spacing:.04em}
.sl-kpi-dashboard .tiles-sm{grid-template-columns:repeat(4,1fr)}
.sl-kpi-dashboard .ktile-sm{padding:32px 28px}
.sl-kpi-dashboard .ktile-sm .kval{font-size:68px}
.sl-kpi-dashboard .ktile-sm .klabel{font-size:24px}
.sl-kpi-dashboard .ktile-sm .ksub{font-size:18px}

/* ---- chrome ---- */
#chrome{position:absolute;inset:0;z-index:50;pointer-events:none}
#chrome>*{pointer-events:auto;transition:opacity .4s ease}
#chrome.hid>*{opacity:0!important;pointer-events:none}
#hair{position:absolute;top:0;left:0;right:0;height:3px;pointer-events:none!important}
#hair i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--acc2),var(--acc1));box-shadow:0 0 8px rgba(var(--glow),.6);transition:width .5s var(--ease)}
.navbtn{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;border-radius:50%;border:1px solid rgba(var(--glow),.35);background:rgba(var(--glow),.07);color:var(--text-mid);font-size:30px;line-height:1;cursor:pointer;opacity:.38;transition:opacity .25s,background .25s}
.navbtn:hover{opacity:1;background:rgba(var(--glow),.18);box-shadow:0 0 16px rgba(var(--glow),.35)}
#prev{left:22px} #next{right:22px}
#dots{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:11px;align-items:center}
#dots .dot{width:11px;height:11px;border-radius:6px;background:rgba(var(--glow),.28);cursor:pointer;transition:all .35s var(--ease)}
#dots .dot.on{width:34px;background:var(--acc1);box-shadow:0 0 12px rgba(var(--glow),.8)}
#counter{position:absolute;right:24px;bottom:64px;font-size:15px;color:var(--text-low);letter-spacing:.08em;font-weight:600}
#chrome.lite .navbtn{border-color:rgba(27,42,65,.25);background:rgba(27,42,65,.06);color:#33455e}
#chrome.lite #dots .dot{background:rgba(27,42,65,.28)}
#chrome.lite #dots .dot.on{background:var(--l-title);box-shadow:0 0 10px rgba(var(--glow),.55)}
#chrome.lite #counter{color:rgba(27,42,65,.55)}
#toast{position:absolute;bottom:76px;left:50%;transform:translateX(-50%);background:rgba(8,18,40,.9);border:1px solid rgba(var(--glow),.4);border-radius:999px;padding:12px 30px;font-size:16px;color:#c7d5ea;letter-spacing:.04em;opacity:0;transition:opacity .6s ease;white-space:nowrap}
#toast.show{opacity:1}

@media (prefers-reduced-motion: reduce){
  .a{opacity:1!important}
  .play .a-up,.play .a-left,.play .a-pop,.play .a-fade,.play .a-drop,.play .a-zoom,.play .a-wipe{animation:none!important}
  .slide{transition:none}
  .breathe{animation:none}
  .orb{animation:none}
  #hair i{transition:none}
}
`;

function buildCss(theme, overrideThemesUsed) {
  const overrides = Object.entries(overrideThemesUsed)
    .map(([name, t]) => overrideVars(name, t)).join('\n');
  return [rootVars(theme), baseCss(theme), COMPONENT_CSS, overrides].join('\n');
}

module.exports = { buildCss };
