import { useState, useEffect } from "react";

const S_HOUR = 8, E_HOUR = 23, PPH = 58;
const TOTAL_H = E_HOUR - S_HOUR;

const DAYS = [
  { name:"ראשון", date:"10/5" }, { name:"שני",   date:"11/5" },
  { name:"שלישי", date:"12/5" }, { name:"רביעי", date:"13/5" },
  { name:"חמישי", date:"14/5" }, { name:"שישי",  date:"15/5" },
];
const HOURS = Array.from({ length: TOTAL_H+1 }, (_,i) => S_HOUR+i);

const CAT = {
  blocked: { label:"מחויבות",   c:"#F43F5E", bg:"rgba(244,63,94,0.13)",  icon:"🔒" },
  workout: { label:"אימון",     c:"#10B981", bg:"rgba(16,185,129,0.13)", icon:"🧘" },
  yin:     { label:"Yin ⭐",    c:"#8B5CF6", bg:"rgba(139,92,246,0.15)", icon:"✨" },
  meal:    { label:"ארוחות",    c:"#D97706", bg:"rgba(217,119,6,0.11)",  icon:"🍽️" },
  admin:   { label:"אדמין",     c:"#2563EB", bg:"rgba(37,99,235,0.11)",  icon:"📧" },
  content: { label:"תוכן",     c:"#0891B2", bg:"rgba(8,145,178,0.11)",  icon:"📱" },
  editing: { label:"עריכה",     c:"#EA580C", bg:"rgba(234,88,12,0.13)",  icon:"🎬" },
  study:   { label:"לימוד",     c:"#65A30D", bg:"rgba(101,163,13,0.13)", icon:"📚" },
  hair:    { label:"שיער",      c:"#DB2777", bg:"rgba(219,39,119,0.11)", icon:"💆" },
  nophone: { label:"ללא טלפון", c:"#64748B", bg:"rgba(100,116,139,0.09)",icon:"📵" },
  client:  { label:"לקוח",     c:"#7C3AED", bg:"rgba(124,58,237,0.12)", icon:"💼" },
};

const RAW = [
  { id:101, day:0, s:"08:30", e:"20:20", t:"עסוקה",         n:"יום סגור",             type:"blocked" },
  { id:102, day:0, s:"20:30", e:"21:15", t:"תוכן יומי",     n:"low effort",           type:"content" },
  { id:103, day:0, s:"22:00", e:"23:00", t:"ללא טלפון",     n:"",                     type:"nophone" },
  { id:201, day:1, s:"09:00", e:"09:30", t:"ארוחת בוקר",    n:"",                     type:"meal"    },
  { id:202, day:1, s:"09:30", e:"10:30", t:"אדמין",          n:"מיילים · הודעות",      type:"admin"   },
  { id:203, day:1, s:"10:30", e:"11:30", t:"הכנה לקורס",    n:"קריאה לפני המפגש",     type:"study"   },
  { id:204, day:1, s:"11:30", e:"12:00", t:"באפר",           n:"",                     type:"blocked" },
  { id:205, day:1, s:"12:00", e:"13:00", t:"קורס קארין",    n:"מפגש שבועי",           type:"study"   },
  { id:206, day:1, s:"13:00", e:"13:20", t:"באפר",           n:"",                     type:"blocked" },
  { id:207, day:1, s:"13:20", e:"14:00", t:"ארוחת צהריים",  n:"",                     type:"meal"    },
  { id:208, day:1, s:"14:00", e:"16:30", t:"תוכן",           n:"עבודת תוכן",           type:"content" },
  { id:210, day:1, s:"16:40", e:"17:00", t:"נסיעה",         n:"לפגישה",               type:"blocked" },
  { id:211, day:1, s:"17:00", e:"18:30", t:"פגישה",         n:"",                     type:"blocked" },
  { id:212, day:1, s:"19:00", e:"19:45", t:"ארוחת ערב",     n:"",                     type:"meal"    },
  { id:215, day:1, s:"20:00", e:"21:00", t:"תוכן יומי",     n:"low effort",           type:"content" },
  { id:213, day:1, s:"22:00", e:"23:00", t:"ללא טלפון",     n:"",                     type:"nophone" },
  { id:301, day:2, s:"09:00", e:"09:15", t:"בוקר קל",       n:"לפני אימון",           type:"meal"    },
  { id:302, day:2, s:"09:15", e:"10:15", t:"Vinyasa",        n:"בר אלקלעי · בת גלים", type:"workout" },
  { id:303, day:2, s:"11:00", e:"11:45", t:"אדמין",          n:"מיילים · הודעות",      type:"admin"   },
  { id:304, day:2, s:"11:45", e:"12:30", t:"ארוחת בוקר",    n:"אחרי אימון",           type:"meal"    },
  { id:305, day:2, s:"13:00", e:"17:00", t:"עריכה ותוכן",   n:"בלוק 1 · 4 שעות",     type:"editing" },
  { id:306, day:2, s:"17:00", e:"17:20", t:"נשנוש",          n:"",                     type:"meal"    },
  { id:313, day:2, s:"17:20", e:"19:30", t:"יודן",           n:"אמנות המרחב",          type:"client"  },
  { id:307, day:2, s:"19:30", e:"20:15", t:"ארוחת ערב",     n:"",                     type:"meal"    },
  { id:308, day:2, s:"20:15", e:"21:15", t:"תוכן יומי",     n:"low effort",           type:"content" },
  { id:309, day:2, s:"21:30", e:"21:50", t:"שמן לשיער",     n:"הכנה לרביעי",          type:"hair"    },
  { id:310, day:2, s:"22:00", e:"23:00", t:"ללא טלפון",     n:"",                     type:"nophone" },
  { id:401, day:3, s:"09:00", e:"10:00", t:"שיער",           n:"חפיפה · ייבוש · יישור",type:"hair"   },
  { id:402, day:3, s:"10:00", e:"10:30", t:"ארוחת בוקר",    n:"",                     type:"meal"    },
  { id:403, day:3, s:"10:30", e:"12:00", t:"צילום תוכן",    n:"📸 יום תוכן",          type:"content" },
  { id:404, day:3, s:"12:00", e:"12:30", t:"אדמין",          n:"מהיר",                 type:"admin"   },
  { id:405, day:3, s:"12:30", e:"15:00", t:"מחויבות",        n:"",                     type:"blocked" },
  { id:406, day:3, s:"15:00", e:"15:15", t:"ארוחת צהריים",  n:"מהירה",                type:"meal"    },
  { id:412, day:3, s:"15:15", e:"16:00", t:"יודן",           n:"אמנות המרחב",          type:"client"  },
  { id:407, day:3, s:"16:00", e:"20:00", t:"עריכה ותוכן",   n:"בלוק 2 · 4 שעות",     type:"editing" },
  { id:408, day:3, s:"20:00", e:"20:45", t:"ארוחת ערב",     n:"",                     type:"meal"    },
  { id:409, day:3, s:"20:45", e:"21:30", t:"תוכן יומי",     n:"low effort",           type:"content" },
  { id:410, day:3, s:"22:00", e:"23:00", t:"ללא טלפון",     n:"",                     type:"nophone" },
  { id:501, day:4, s:"09:00", e:"09:30", t:"ארוחת בוקר",    n:"",                     type:"meal"    },
  { id:502, day:4, s:"09:30", e:"10:00", t:"אדמין",          n:"מיילים · הודעות",      type:"admin"   },
  { id:503, day:4, s:"10:00", e:"13:30", t:"קורס קארין",    n:"בלוק לימוד · 3.5 שע׳", type:"study"   },
  { id:504, day:4, s:"13:30", e:"14:15", t:"ארוחת צהריים",  n:"",                     type:"meal"    },
  { id:505, day:4, s:"16:30", e:"16:50", t:"נשנוש",          n:"",                     type:"meal"    },
  { id:506, day:4, s:"18:00", e:"19:15", t:"Hatha Yoga",     n:"נזנין אברהם · הנמל",  type:"workout" },
  { id:507, day:4, s:"19:30", e:"20:15", t:"ארוחת ערב",     n:"",                     type:"meal"    },
  { id:508, day:4, s:"20:15", e:"21:15", t:"תוכן יומי",     n:"low effort",           type:"content" },
  { id:509, day:4, s:"22:00", e:"23:00", t:"ללא טלפון",     n:"",                     type:"nophone" },
  { id:601, day:5, s:"09:00", e:"09:30", t:"ארוחת בוקר",    n:"",                     type:"meal"    },
  { id:602, day:5, s:"09:30", e:"10:20", t:"אדמין",          n:"מיילים · הודעות",      type:"admin"   },
  { id:603, day:5, s:"10:20", e:"11:35", t:"Yin + Sounds",   n:"נזנין אברהם · הנמל",  type:"yin"     },
  { id:604, day:5, s:"12:00", e:"12:45", t:"ארוחת צהריים",  n:"",                     type:"meal"    },
  { id:605, day:5, s:"16:30", e:"16:50", t:"נשנוש",          n:"",                     type:"meal"    },
  { id:606, day:5, s:"19:30", e:"20:15", t:"ארוחת ערב",     n:"",                     type:"meal"    },
  { id:607, day:5, s:"20:15", e:"21:15", t:"תוכן יומי",     n:"low effort",           type:"content" },
  { id:608, day:5, s:"22:00", e:"23:00", t:"ללא טלפון",     n:"",                     type:"nophone" },
];

function px(t) {
  const [h,m] = t.split(":").map(Number);
  return (h + m/60 - S_HOUR) * PPH;
}

function Block({ ev, onToggle }) {
  const cat = CAT[ev.type];
  const top = px(ev.s);
  const height = Math.max(px(ev.e) - top, 20);
  const tiny = height < 34;
  const small = height < 54;
  return (
    <div
      onClick={() => onToggle(ev.id)}
      title={`${ev.t}${ev.n?" · "+ev.n:""} | ${ev.s}–${ev.e}`}
      style={{
        position:"absolute", top, left:2, right:2, height,
        background: ev.done ? "rgba(241,245,249,0.9)" : cat.bg,
        border: `1px solid ${ev.done?"#E2E8F0":cat.c}`,
        borderRight: `3.5px solid ${ev.done?"#CBD5E1":cat.c}`,
        borderRadius:7, padding:tiny?"1px 4px":"3px 6px",
        cursor:"pointer", overflow:"hidden", userSelect:"none", zIndex:1,
        opacity:ev.done?0.45:1,
        transition:"opacity 0.2s, background 0.2s",
        boxShadow:ev.done?"none":`0 1px 4px ${cat.c}18`,
      }}
    >
      <div style={{
        fontSize:tiny?7.5:9, fontWeight:700,
        color:ev.done?"#94A3B8":cat.c,
        textDecoration:ev.done?"line-through":"none",
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", lineHeight:1.2,
      }}>
        {ev.done?"✓ ":tiny?"":cat.icon+" "}{ev.t}
      </div>
      {!tiny && !small && ev.n && !ev.done && (
        <div style={{fontSize:7.5,color:cat.c,opacity:0.7,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {ev.n}
        </div>
      )}
      {!tiny && (
        <div style={{fontSize:7.5,color:ev.done?"#CBD5E1":cat.c,opacity:0.6}}>{ev.s}–{ev.e}</div>
      )}
    </div>
  );
}

const STORAGE_KEY = "weekly-planner-v1";

export default function WeeklyPlanner() {
  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const doneIds = new Set(JSON.parse(saved));
          return RAW.map(e => ({ ...e, done: doneIds.has(e.id) }));
        }
      } catch(e) {}
    }
    return RAW.map(e => ({ ...e, done: false }));
  });
  const [hidden, setHidden] = useState(new Set(["nophone"]));

  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const doneIds = events.filter(e => e.done).map(e => e.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doneIds));
    }
  }, [events]);

  const toggle = id => setEvents(p => p.map(e => e.id === id ? { ...e, done: !e.done } : e));
  const toggleHide = k => setHidden(p => { const s = new Set(p); s.has(k) ? s.delete(k) : s.add(k); return s; });

  const wDone  = events.filter(e => (e.type==="workout"||e.type==="yin") && e.done).length;
  const eDone  = events.filter(e => e.type==="editing" && e.done).length * 4;
  const stDone = events.filter(e => e.type==="study" && e.done).length;

  const visible = events.filter(e => !hidden.has(e.type));

  const stats = [
    { label:"אימונים", done:wDone,  total:3, c:"#10B981", suffix:"" },
    { label:"עריכה",   done:eDone,  total:8, c:"#EA580C", suffix:"שע'" },
    { label:"קורס קארין", done:stDone, total:5, c:"#65A30D", suffix:"" },
  ];

  return (
    <div style={{direction:"rtl",fontFamily:"'Rubik',Tahoma,sans-serif",background:"#F7F6F3",minHeight:"100vh",padding:"14px 10px 40px"}}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:9,letterSpacing:3,color:"#E8510A",fontWeight:700,marginBottom:2}}>
          סטודיו נעים · מאי 2026
        </div>
        <h1 style={{margin:0,fontSize:20,fontWeight:800,color:"#1E293B"}}>תכנון שבועי 🗓️</h1>
        <div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>10–15 במאי</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {stats.map(({label,done,total,c,suffix}) => (
          <div key={label} style={{flex:1,background:"white",borderRadius:10,padding:"7px 8px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",textAlign:"center"}}>
            <div style={{fontSize:8,color:"#94A3B8",marginBottom:2}}>{label}</div>
            <div style={{fontSize:15,fontWeight:700,color:c}}>
              {done}{suffix && <span style={{fontSize:8,fontWeight:500}}>{suffix}</span>}
              <span style={{fontSize:9,color:"#CBD5E1",fontWeight:400}}>/{total}{suffix}</span>
            </div>
            <div style={{height:3,background:"#F1F5F9",borderRadius:4,marginTop:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min((done/total)*100,100)}%`,background:c,borderRadius:4,transition:"width 0.4s"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10,justifyContent:"center"}}>
        {Object.entries(CAT).map(([k,cat]) => {
          const off = hidden.has(k);
          return (
            <button key={k} onClick={() => toggleHide(k)} style={{
              border: `1.5px solid ${off?"#E2E8F0":cat.c}`,
              background: off ? "#F8FAFC" : cat.bg,
              color: off ? "#94A3B8" : cat.c,
              borderRadius:20, padding:"3px 9px",
              fontSize:9, fontWeight:600, cursor:"pointer",
              fontFamily:"inherit", opacity:off?0.55:1,
              transition:"all 0.15s",
            }}>
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>
      <div style={{background:"white",borderRadius:16,boxShadow:"0 3px 20px rgba(0,0,0,0.07)",overflow:"hidden",overflowX:"auto"}}>
        <div style={{minWidth:500}}>
          <div style={{display:"flex",borderBottom:"1.5px solid #F1F5F9"}}>
            <div style={{width:36,flexShrink:0}}/>
            {DAYS.map((d,i) => {
              const hasW  = events.some(e => e.day===i && (e.type==="workout"||e.type==="yin") && !e.done);
              const doneW = events.some(e => e.day===i && (e.type==="workout"||e.type==="yin") &&  e.done);
              const hasE  = events.some(e => e.day===i && e.type==="editing");
              const hasS  = events.some(e => e.day===i && e.type==="study");
              return (
                <div key={i} style={{
                  flex:1, textAlign:"center", padding:"7px 2px",
                  borderRight: i<5 ? "1px solid #F1F5F9" : "none",
                  background: hasW ? "#FAFFF8" : doneW ? "#F0FDF4" : "white",
                }}>
                  <div style={{fontSize:11,fontWeight:700,color:"#1E293B"}}>{d.name}</div>
                  <div style={{fontSize:9,color:"#94A3B8"}}>{d.date}</div>
                  <div style={{fontSize:9,marginTop:1,height:10,display:"flex",justifyContent:"center",gap:2}}>
                    {(hasW||doneW) && <span style={{color:doneW?"#34D399":"#10B981"}}>🧘</span>}
                    {hasE && <span>🎬</span>}
                    {hasS && <span>📚</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex"}}>
            <div style={{width:36,flexShrink:0,position:"relative",height:TOTAL_H*PPH}}>
              {HOURS.map(h => (
                <div key={h} style={{
                  position:"absolute", top:(h-S_HOUR)*PPH-7,
                  width:"100%", textAlign:"center",
                  fontSize:8, color:"#CBD5E1", fontWeight:500,
                }}>
                  {String(h).padStart(2,"0")}:00
                </div>
              ))}
            </div>
            {DAYS.map((_,di) => (
              <div key={di} style={{
                flex:1, position:"relative", height:TOTAL_H*PPH,
                borderRight: di<5 ? "1px solid #F8FAFC" : "none",
              }}>
                {HOURS.map(h => (
                  <div key={h} style={{
                    position:"absolute", top:(h-S_HOUR)*PPH, width:"100%",
                    borderTop: h%2===0 ? "1px solid #F1F5F9" : "1px dashed #F9FAFB",
                  }}/>
                ))}
                {visible.filter(e => e.day===di).map(ev => (
                  <Block key={ev.id} ev={ev} onToggle={toggle}/>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap",justifyContent:"center"}}>
        {[
          {e:"📚", t:"לימוד קארין: שני הכנה + חמישי באץ' 3.5 שע'", c:"#65A30D"},
          {e:"🎬", t:"עריכה: שלישי + רביעי = 8 שעות", c:"#EA580C"},
          {e:"💆", t:"שיער: שלישי לילה שמן → רביעי בוקר + צילום", c:"#DB2777"},
        ].map(({e,t,c}) => (
          <div key={t} style={{background:"white",borderRadius:20,padding:"4px 12px",fontSize:9,color:c,fontWeight:600,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            {e} {t}
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",color:"#CBD5E1",fontSize:9,marginTop:10}}>
        לחצי על אייטם לסימון כ-✓ · לחצי על קטגוריה להסתרה/הצגה
      </p>
    </div>
  );
}
