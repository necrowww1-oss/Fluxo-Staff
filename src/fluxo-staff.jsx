import{useState,useEffect,useRef}from"react";

const D={bg:"#0e0e0e",sur:"#161616",sur2:"#1f1f1f",sur3:"#272727",
 b:"rgba(255,255,255,.08)",b2:"rgba(255,255,255,.13)",
 tx:"#fff",off:"rgba(255,255,255,.5)",dim:"rgba(255,255,255,.28)",
 ac:"#a78bfa",acBg:"rgba(167,139,250,.12)",acBd:"rgba(167,139,250,.3)",
 gr:"#4ade80",grBg:"rgba(74,222,128,.1)",
 or:"#fb923c",rd:"#f87171",rdBg:"rgba(248,113,113,.1)",
 sh:"0 2px 0 rgba(0,0,0,.4),0 4px 16px rgba(0,0,0,.3)",
 topBg:"rgba(14,14,14,.92)",navBg:"rgba(14,14,14,.95)",
 inp:"#1f1f1f",barAc:"#a78bfa",barToday:"#c084fc",progBg:"#272727"};
const L={bg:"#f0ede8",sur:"#fff",sur2:"#e8e4dc",sur3:"#dedad0",
 b:"rgba(0,0,0,.08)",b2:"rgba(0,0,0,.14)",
 tx:"#1a1a1a",off:"rgba(0,0,0,.5)",dim:"rgba(0,0,0,.38)",
 ac:"#7c3aed",acBg:"rgba(124,58,237,.08)",acBd:"rgba(124,58,237,.22)",
 gr:"#16a34a",grBg:"rgba(22,163,74,.1)",
 or:"#ea580c",rd:"#dc2626",rdBg:"rgba(220,38,38,.1)",
 sh:"0 1px 0 rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.08)",
 topBg:"rgba(240,237,232,.94)",navBg:"rgba(240,237,232,.97)",
 inp:"#ffffff",barAc:"#7c3aed",barToday:"#9333ea",progBg:"#dedad0"};

const EVTS=[
 {id:"e1",artist:"Marilina Bertoldi & Alok",tag:"Electrónica · Rock",venue:"Club Niceto",city:"Palermo, CABA",day:"28",month:"MAR",year:"2025",time:"23:00",doors:"22:00",emoji:"🎧",c1:"#1a0533",c2:"#6b21a8",c3:"#c084fc",types:[{id:"t1",name:"General",price:9500,sold:187,total:250},{id:"t2",name:"VIP",price:24000,sold:42,total:50}]},
 {id:"e2",artist:"Cuarteto del Norte",tag:"Folklore · Cuarteto",venue:"Ópera Córdoba",city:"Nueva Córdoba, CBA",day:"04",month:"ABR",year:"2025",time:"21:00",doors:"20:00",emoji:"🎶",c1:"#1c0a00",c2:"#9a3412",c3:"#fb923c",types:[{id:"t3",name:"Campo",price:8000,sold:200,total:400},{id:"t4",name:"Platea A",price:18000,sold:28,total:50}]},
 {id:"e3",artist:"La Gaviota",tag:"Teatro · Drama",venue:"Teatro Picadero",city:"Palermo, CABA",day:"29",month:"MAR",year:"2025",time:"20:30",doors:"20:00",emoji:"🎭",c1:"#0a0f1a",c2:"#1e3a5f",c3:"#60a5fa",types:[{id:"t5",name:"Platea",price:14000,sold:40,total:80},{id:"t6",name:"Paraíso",price:7500,sold:20,total:80}]},
];
const BUYERS=[
 {id:"g1",name:"Valentina Rossi",email:"valen@mail.com",dni:"32.456.789",ticket:"VIP",eventId:"e1",hash:"hmac_ab3f9c",checkedIn:false},
 {id:"g2",name:"Martín Aguirre",email:"martin@mail.com",dni:"28.901.234",ticket:"General",eventId:"e1",hash:"hmac_cd7e2a",checkedIn:true},
 {id:"g3",name:"Sofía Méndez",email:"sofi@mail.com",dni:"40.123.456",ticket:"General",eventId:"e1",hash:"hmac_ef1b5d",checkedIn:false},
 {id:"g4",name:"Lucas Fernández",email:"lucas@mail.com",dni:"35.678.901",ticket:"VIP",eventId:"e2",hash:"hmac_gh4c8f",checkedIn:true},
 {id:"g5",name:"Camila Torres",email:"cami@mail.com",dni:"38.234.567",ticket:"General",eventId:"e2",hash:"hmac_ij2d7e",checkedIn:false},
 {id:"g6",name:"Diego Rodríguez",email:"diego@mail.com",dni:"29.876.543",ticket:"General",eventId:"e3",hash:"hmac_kl5a9b",checkedIn:false},
];
const GLIST=[
 {id:"l1",name:"Rodrigo Sánchez",dni:"27.345.678",plus:1,motivo:"Prensa",eventId:"e1",checkedIn:false},
 {id:"l2",name:"Jimena Alvarez",dni:"34.567.890",plus:0,motivo:"Staff",eventId:"e1",checkedIn:true},
 {id:"l3",name:"Pablo Herrera",dni:"30.123.456",plus:2,motivo:"Artista",eventId:"e2",checkedIn:false},
 {id:"l4",name:"Florencia Ruiz",dni:"38.901.234",plus:0,motivo:"Prensa",eventId:"e2",checkedIn:false},
 {id:"l5",name:"Tomás Acosta",dni:"25.678.901",plus:1,motivo:"Sponsor",eventId:"e3",checkedIn:true},
];
const NOW=new Date();
const DIM=new Date(NOW.getFullYear(),NOW.getMonth()+1,0).getDate();
const MS=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const PAL=[{c1:"#1a0533",c2:"#6b21a8",c3:"#c084fc"},{c1:"#1c0a00",c2:"#9a3412",c3:"#fb923c"},{c1:"#0a0f1a",c2:"#1e3a5f",c3:"#60a5fa"},{c1:"#0d1f0d",c2:"#15532e",c3:"#4ade80"}];
const EMOJIS=["🎵","🎧","🎶","🎭","🎸","🎤","🎛️","🥁"];
const PRESETS=["Anticipada","General","VIP"];
const MONTHS=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const BAR_DATA={
 hoy:{vals:Array.from({length:24},(_,i)=>Math.round(5+Math.random()*25+(i>=18&&i<=22?15:0))),labels:Array.from({length:24},(_,i)=>String(i).padStart(2,"0")),ti:NOW.getHours()},
 semana:{vals:[42,58,35,91,124,187,0],labels:["Lun","Mar","Mié","Jue","Vie","Sáb","Hoy"],ti:6},
 mes:{vals:Array.from({length:DIM},(_,i)=>i===NOW.getDate()-1?0:Math.round(10+Math.random()*55)),labels:Array.from({length:DIM},(_,i)=>String(i+1)),ti:NOW.getDate()-1},
 todo:{vals:[320,410,280,620,890,1040,760,930,1100,850,640,480],labels:MS,ti:NOW.getMonth()},
};
const FACTORS={hoy:.04,semana:.28,mes:.72,todo:1};
const SUBS={hoy:"hoy",semana:"esta semana",mes:"este mes",todo:"histórico"};
const fmt=n=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);
const ini=n=>n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const MC={Prensa:{bg:"rgba(96,165,250,.12)",c:"#60a5fa"},Staff:{bg:"rgba(167,139,250,.12)",c:"#a78bfa"},Artista:{bg:"rgba(74,222,128,.12)",c:"#4ade80"},Sponsor:{bg:"rgba(251,191,36,.12)",c:"#fbbf24"},"Invitado VIP":{bg:"rgba(251,146,60,.12)",c:"#fb923c"}};

const inp=(t,extra={})=>({width:"100%",padding:"12px 14px",background:t.inp,border:`1px solid ${t.b}`,borderRadius:10,color:t.tx,fontFamily:"inherit",fontSize:14,outline:"none",...extra});
const card=(t,extra={})=>({background:t.sur,border:`1px solid ${t.b}`,borderRadius:14,boxShadow:t.sh,transition:"background .3s,border-color .3s",...extra});
const pill=(t,active)=>({padding:"6px 14px",borderRadius:100,border:`1px solid ${active?t.ac:t.b}`,background:active?t.acBg:"transparent",color:active?t.ac:t.dim,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"});
const Avatar=({name,t,size=38})=><div style={{width:size,height:size,borderRadius:"50%",background:t.acBg,border:`1px solid ${t.acBd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:800,color:t.ac,flexShrink:0}}>{ini(name)}</div>;
const Lbl=({t,children})=><label style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:t.dim,marginBottom:7}}>{children}</label>;

function Topbar({t,dark,setDark,right,title}){
 return(
 <div style={{position:"sticky",top:0,zIndex:80,background:t.topBg,backdropFilter:"blur(20px)",borderBottom:`1px solid ${t.b}`,padding:"0 18px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"background .3s"}}>
 {title
 ?<div style={{fontSize:17,fontWeight:800,color:t.tx}}>{title}</div>
 :<div style={{fontSize:21,fontWeight:900,letterSpacing:"-.5px",color:t.ac}}>Fluxo</div>
 }
 <div style={{display:"flex",alignItems:"center",gap:8}}>
 <div onClick={()=>setDark(p=>!p)} style={{width:38,height:22,borderRadius:11,background:dark?t.ac:t.sur3,border:`1px solid ${t.b2}`,position:"relative",cursor:"pointer",transition:"background .3s",flexShrink:0}}>
 <div style={{position:"absolute",top:2,left:dark?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .3s cubic-bezier(.34,1.56,.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>{dark?"🌙":"☀️"}</div>
 </div>
 {right}
 </div>
 </div>
 );
}

function Sheet({onClose,children,t}){
 const bg=t?t.bg:"#141414";
 const handle=t?t.b2:"rgba(255,255,255,.12)";
 return(
 <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
 <div style={{background:bg,width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"20px 20px 0 0",maxHeight:"92dvh",overflowY:"auto",animation:"sheetUp .35s cubic-bezier(.16,1,.3,1)",borderTop:`1px solid ${handle}`,transition:"background .3s"}}>
 <div style={{width:36,height:4,borderRadius:2,background:handle,margin:"12px auto 0"}}/>
 {children}
 </div>
 </div>
 );
}

function Dashboard({t,dark,setDark,evts,buyers,onEvClick,onNew}){
 const[period,setPeriod]=useState("semana");
 const pd=BAR_DATA[period],f=FACTORS[period];
 const rev=Math.round(evts.reduce((s,ev)=>s+ev.types.reduce((ts,t)=>ts+t.sold*t.price,0),0)*f);
 const sold=Math.round(evts.reduce((s,ev)=>s+ev.types.reduce((ts,t)=>ts+t.sold,0),0)*f);
 const ci=Math.round(buyers.filter(b=>b.checkedIn).length*f);
 const mx=Math.max(...pd.vals,1);
 const showL=(i)=>period==="hoy"?i%4===0:period==="mes"?i===0||i%5===0||i===pd.vals.length-1:true;
 const sorted=[...evts].sort((a,b)=>{const m=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];return new Date(a.year,m.indexOf(a.month),a.day)-new Date(b.year,m.indexOf(b.month),b.day);});
 const GlowBtn=()=><button onClick={onNew} style={{width:34,height:34,borderRadius:"50%",background:dark?"rgba(74,222,128,.15)":"rgba(22,163,74,.12)",border:`1.5px solid ${dark?"rgba(74,222,128,.5)":"rgba(22,163,74,.4)"}`,cursor:"pointer",color:dark?"#4ade80":"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,animation:"glow 2.5s ease-in-out infinite"}}>＋</button>;
 return(
 <div style={{paddingBottom:80}}>
 <Topbar t={t} dark={dark} setDark={setDark} right={<GlowBtn/>}/>
 <div style={{display:"flex",gap:6,padding:"10px 18px 4px",overflowX:"auto"}}>
 {[["hoy","Hoy"],["semana","Semana"],["mes","Mes"],["todo","Todo"]].map(([k,l])=><button key={k} onClick={()=>setPeriod(k)} style={pill(t,period===k)}>{l}</button>)}
 </div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"10px 18px"}}>
 {[{l:"Ingresos",v:fmt(rev)},{l:"Entradas",v:sold},{l:"Check-ins",v:ci},{l:"Eventos",v:evts.length}].map((s,i)=>(
 <div key={i} style={{...card(t),padding:16}}>
 <div style={{fontSize:11,color:t.dim,fontWeight:600,letterSpacing:.5,marginBottom:7,textTransform:"uppercase"}}>{s.l}</div>
 <div style={{fontSize:24,fontWeight:900,letterSpacing:"-.5px",color:t.tx}}>{s.v}</div>
 <div style={{fontSize:11,color:t.gr,marginTop:4,fontWeight:600}}>{SUBS[period]}</div>
 </div>
 ))}
 </div>
 <div style={{...card(t),margin:"0 18px 14px",padding:16}}>
 <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
 <div><div style={{fontSize:13,fontWeight:700,color:t.tx}}>Entradas vendidas</div><div style={{fontSize:11,color:t.dim,marginTop:2}}>{SUBS[period]}</div></div>
 <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:900,color:t.tx}}>{pd.vals.reduce((a,b)=>a+b,0)}</div><div style={{fontSize:11,color:t.dim,marginTop:2}}>en el período</div></div>
 </div>
 <div style={{display:"flex",alignItems:"flex-end",height:68,gap:period==="hoy"?1:period==="mes"?2:4}}>
 {pd.vals.map((v,i)=>{
 const iT=i===pd.ti;
 return(
 <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:0}}>
 <div style={{width:"80%",borderRadius:"2px 2px 0 0",background:iT?t.barToday:t.barAc,opacity:v===0?.15:iT?1:.65,height:`${Math.max(2,(v/mx)*56)}px`,transition:"height .5s cubic-bezier(.34,1.56,.64,1)"}}/>
 <div style={{fontSize:period==="hoy"||period==="mes"?7:8,color:t.dim,fontWeight:600,opacity:showL(i)?1:0}}>{pd.labels[i]}</div>
 </div>
 );
 })}
 </div>
 </div>
 <div style={{fontSize:11,fontWeight:700,color:t.dim,textTransform:"uppercase",letterSpacing:1.5,padding:"0 18px 8px"}}>Mis eventos</div>
 {sorted.map((ev,idx)=>{
 const s=ev.types.reduce((a,t)=>a+t.sold,0),c=ev.types.reduce((a,t)=>a+t.total,0),pct=c?Math.round((s/c)*100):0;
 return(
 <div key={ev.id} onClick={()=>onEvClick(ev)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",borderBottom:`1px solid ${t.b}`,cursor:"pointer",transition:"background .15s"}}
 onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,.025)":"rgba(0,0,0,.025)"}
 onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
 <div style={{width:46,height:46,borderRadius:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,background:`radial-gradient(circle at 60% 40%,${ev.c3}55,${ev.c2} 60%,${ev.c1})`}}>{ev.emoji}</div>
 <div style={{flex:1,minWidth:0}}>
 <div style={{fontSize:14,fontWeight:700,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:t.tx}}>{ev.artist}</div>
 <div style={{fontSize:11,color:t.off}}>{ev.venue} · {ev.day} {ev.month}</div>
 <div style={{height:3,background:t.progBg,borderRadius:2,overflow:"hidden",marginTop:4}}><div style={{height:"100%",borderRadius:2,background:t.gr,width:`${pct}%`}}/></div>
 </div>
 <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:16,fontWeight:800,color:t.tx}}>{pct}%</div><div style={{fontSize:10,color:t.dim,marginTop:1}}>vendido</div></div>
 </div>
 );
 })}
 </div>
 );
}

function Ventas({t,dark,setDark,evts}){
 const[sel,setSel]=useState(null);
 useEffect(()=>{if(!sel&&evts.length)setSel(evts[0]);},[evts]);
 const ev=sel||evts[0];
 if(!ev)return null;
 const rev=ev.types?.reduce((s,t)=>s+t.sold*t.price,0)??0;
 const sold=ev.types?.reduce((s,t)=>s+t.sold,0)??0;
 const cap=ev.types?.reduce((s,t)=>s+t.total,0)??0;
 return(
 <div style={{paddingBottom:80}}>
 <Topbar t={t} dark={dark} setDark={setDark} title="Ventas"/>
 <div style={{display:"flex",gap:6,padding:"10px 18px 4px",overflowX:"auto"}}>
 {evts.map(e2=><button key={e2.id} onClick={()=>setSel(e2)} style={pill(t,ev?.id===e2.id)}>{e2.emoji} {e2.artist.split(" ")[0]}</button>)}
 </div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"10px 18px"}}>
 <div style={{...card(t),padding:16,gridColumn:"1/-1"}}>
 <div style={{fontSize:11,color:t.dim,fontWeight:600,textTransform:"uppercase",marginBottom:7}}>Ingresos totales</div>
 <div style={{fontSize:24,fontWeight:900,color:t.tx}}>{fmt(rev)}</div>
 <div style={{fontSize:11,color:t.gr,marginTop:4,fontWeight:600}}>{sold} entradas · {cap?Math.round((sold/cap)*100):0}% capacidad</div>
 </div>
 <div style={{...card(t),padding:16}}><div style={{fontSize:11,color:t.dim,fontWeight:600,textTransform:"uppercase",marginBottom:7}}>Vendidas</div><div style={{fontSize:24,fontWeight:900,color:t.tx}}>{sold}</div></div>
 <div style={{...card(t),padding:16}}><div style={{fontSize:11,color:t.dim,fontWeight:600,textTransform:"uppercase",marginBottom:7}}>Disponibles</div><div style={{fontSize:24,fontWeight:900,color:t.tx}}>{cap-sold}</div></div>
 </div>
 <div style={{fontSize:11,fontWeight:700,color:t.dim,textTransform:"uppercase",letterSpacing:1.5,padding:"4px 18px 8px"}}>Por tipo de entrada</div>
 <div style={{...card(t),margin:"0 18px",overflow:"hidden"}}>
 {ev.types?.map((tp,i)=>{
 const pct=tp.total?Math.round((tp.sold/tp.total)*100):0;
 return(
 <div key={tp.id} style={{padding:"14px 16px",borderBottom:i<ev.types.length-1?`1px solid ${t.b}`:"none"}}>
 <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
 <div><div style={{fontSize:14,fontWeight:700,color:t.tx}}>{tp.name}</div><div style={{fontSize:11,color:t.off,marginTop:2}}>{fmt(tp.price)} c/u</div></div>
 <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:t.tx}}>{fmt(tp.sold*tp.price)}</div><div style={{fontSize:11,color:t.dim,marginTop:2}}>{tp.sold}/{tp.total}</div></div>
 </div>
 <div style={{height:4,background:t.progBg,borderRadius:2}}><div style={{height:"100%",borderRadius:2,background:pct>80?t.or:t.gr,width:`${pct}%`,transition:"width .5s"}}/></div>
 <div style={{fontSize:11,color:t.dim,marginTop:4}}>{pct}% vendido</div>
 </div>
 );
 })}
 </div>
 </div>
 );
}

function Invitados({t,dark,setDark,buyers,setBuyers,glist,setGlist,evts}){
 const[tab,setTab]=useState("compradores");
 return(
 <div style={{paddingBottom:80}}>
 <Topbar t={t} dark={dark} setDark={setDark} title="Invitados"/>
 <div style={{display:"flex",borderBottom:`1px solid ${t.b}`,padding:"0 18px",position:"sticky",top:56,zIndex:69,background:t.topBg,backdropFilter:"blur(20px)"}}>
 {[["compradores",`Compradores (${buyers.length})`],["lista",`Lista (${glist.length})`]].map(([k,l])=>(
 <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"13px 0",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer",border:"none",background:"none",fontFamily:"inherit",color:tab===k?t.ac:t.dim,borderBottom:`2px solid ${tab===k?t.ac:"transparent"}`,marginBottom:-1,transition:"all .2s"}}>{l}</button>
 ))}
 </div>
 {tab==="compradores"
 ?<CompradoresTab t={t} buyers={buyers} setBuyers={setBuyers} evts={evts}/>
 :<ListaTab t={t} glist={glist} setGlist={setGlist} evts={evts}/>
 }
 </div>
 );
}

function CompradoresTab({t,buyers,setBuyers,evts}){
 const[q,setQ]=useState(""),[ f,setF]=useState("todos"),[evF,setEvF]=useState("todos"),[showM,setShowM]=useState(false);
 const fil=buyers.filter(g=>{
 const m=!q||g.name.toLowerCase().includes(q.toLowerCase())||g.dni.includes(q);
 const ms=f==="ingresaron"?m&&g.checkedIn:f==="pendientes"?m&&!g.checkedIn:m;
 return ms&&(evF==="todos"||g.eventId===evF);
 });
 const selN=evF==="todos"?"Todos":(evts?.find(e=>e.id===evF)?.emoji+" "+evts?.find(e=>e.id===evF)?.artist.split(" ")[0]??"Evento");
 return(
 <>
 <div style={{padding:"12px 18px",position:"sticky",top:104,zIndex:68,background:t.topBg,backdropFilter:"blur(20px)"}}>
 <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔍</span><input style={{...inp(t),paddingLeft:38}} placeholder="Buscar…" value={q} onChange={e=>setQ(e.target.value)}/></div>
 <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
 {[["todos","Todos"],["ingresaron","Ingresaron"],["pendientes","Pendientes"]].map(([k,l])=><button key={k} onClick={()=>setF(k)} style={pill(t,f===k)}>{l}</button>)}
 </div>
 <div style={{position:"relative",marginTop:8}}>
 <button onClick={()=>setShowM(p=>!p)} style={{...pill(t,evF!=="todos"),display:"flex",alignItems:"center",gap:6}}>
 <span>☰</span><span>{selN}</span><span style={{fontSize:10}}>{showM?"▲":"▼"}</span>
 </button>
 {showM&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:100,background:t.sur2,border:`1px solid ${t.b2}`,borderRadius:10,overflow:"hidden",minWidth:220,boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>
 {[{id:"todos",label:"Todos los eventos",emoji:"📋"},...(evts||[]).map(ev=>({id:ev.id,label:`${ev.artist} · ${ev.day} ${ev.month}`,emoji:ev.emoji}))].map(o=>(
 <button key={o.id} onClick={()=>{setEvF(o.id);setShowM(false);}} style={{width:"100%",padding:"11px 14px",border:"none",borderBottom:`1px solid ${t.b}`,background:evF===o.id?t.acBg:"transparent",color:evF===o.id?t.ac:t.tx,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
 <span>{o.emoji}</span><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.label}</span>
 {evF===o.id&&<span style={{color:t.ac}}>✓</span>}
 </button>
 ))}
 </div>}
 </div>
 </div>
 <div style={{padding:"6px 18px 2px",fontSize:12,color:t.dim,fontWeight:600}}>{buyers.filter(g=>g.checkedIn).length} ingresaron · {buyers.filter(g=>!g.checkedIn).length} pendientes</div>
 {fil.map(g=>(
 <div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:`1px solid ${t.b}`}}>
 <Avatar name={g.name} t={t}/>
 <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:t.tx,marginBottom:2}}>{g.name}</div><div style={{fontSize:11,color:t.dim}}>{g.ticket} · DNI {g.dni}</div></div>
 <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
 <button onClick={()=>setBuyers(prev=>prev.map(b=>b.id===g.id?{...b,checkedIn:!b.checkedIn}:b))}
 style={{width:30,height:30,borderRadius:"50%",border:`2px solid ${g.checkedIn?t.gr:t.b2}`,background:g.checkedIn?t.gr:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .25s cubic-bezier(.34,1.56,.64,1)"}}>
 {g.checkedIn?"✓":""}
 </button>
 <div style={{fontSize:10,color:g.checkedIn?t.gr:t.dim,fontWeight:600}}>{g.checkedIn?"Ingresó":"Pendiente"}</div>
 </div>
 </div>
 ))}
 </>
 );
}

function ListaTab({t,glist,setGlist,evts}){
 const[q,setQ]=useState(""),[f,setF]=useState("todos"),[evF,setEvF]=useState("todos"),[showM,setShowM]=useState(false),[showAdd,setShowAdd]=useState(false),[toDel,setToDel]=useState(null);
 const fil=glist.filter(g=>{
 const mQ=!q||g.name.toLowerCase().includes(q.toLowerCase())||g.dni.includes(q)||g.motivo.toLowerCase().includes(q.toLowerCase());
 return mQ&&(f==="todos"||(f==="ingresaron"?g.checkedIn:!g.checkedIn))&&(evF==="todos"||g.eventId===evF);
 });
 const selN=evF==="todos"?"Todos":(evts?.find(e=>e.id===evF)?.emoji+" "+evts?.find(e=>e.id===evF)?.artist.split(" ")[0]??"Evento");
 return(
 <>
 <div style={{padding:"12px 18px",position:"sticky",top:104,zIndex:68,background:t.topBg,backdropFilter:"blur(20px)"}}>
 <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔍</span><input style={{...inp(t),paddingLeft:38}} placeholder="Buscar…" value={q} onChange={e=>setQ(e.target.value)}/></div>
 <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
 {[["todos","Todos"],["ingresaron","Ingresaron"],["pendientes","Pendientes"]].map(([k,l])=><button key={k} onClick={()=>setF(k)} style={pill(t,f===k)}>{l}</button>)}
 </div>
 <div style={{position:"relative",marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
 <button onClick={()=>setShowM(p=>!p)} style={{...pill(t,evF!=="todos"),display:"flex",alignItems:"center",gap:6}}>
 <span>☰</span><span>{selN}</span><span style={{fontSize:10}}>{showM?"▲":"▼"}</span>
 </button>
 <button onClick={()=>setShowAdd(true)} style={{padding:"6px 12px",borderRadius:100,border:`1px solid ${t.acBd}`,background:t.acBg,color:t.ac,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>＋ Agregar</button>
 {showM&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:100,background:t.sur2,border:`1px solid ${t.b2}`,borderRadius:10,overflow:"hidden",minWidth:220,boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>
 {[{id:"todos",label:"Todos los eventos",emoji:"📋"},...(evts||[]).map(ev=>({id:ev.id,label:`${ev.artist} · ${ev.day} ${ev.month}`,emoji:ev.emoji}))].map(o=>(
 <button key={o.id} onClick={()=>{setEvF(o.id);setShowM(false);}} style={{width:"100%",padding:"11px 14px",border:"none",borderBottom:`1px solid ${t.b}`,background:evF===o.id?t.acBg:"transparent",color:evF===o.id?t.ac:t.tx,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
 <span>{o.emoji}</span><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.label}</span>
 {evF===o.id&&<span style={{color:t.ac}}>✓</span>}
 </button>
 ))}
 </div>}
 </div>
 </div>
 {fil.length===0?<div style={{textAlign:"center",padding:"50px 30px",color:t.dim,fontSize:14}}>{glist.length===0?"La lista está vacía":"Sin resultados"}</div>
 :fil.map(g=>{
 const mc=MC[g.motivo]||{bg:t.sur3,c:t.dim};
 const ev=evts.find(e=>e.id===g.eventId);
 return(
 <div key={g.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 18px",borderBottom:`1px solid ${t.b}`}}>
 <Avatar name={g.name} t={t}/>
 <div style={{flex:1,minWidth:0}}>
 <div style={{fontSize:14,fontWeight:700,color:t.tx,marginBottom:3}}>{g.name}</div>
 <div style={{display:"flex",gap:6,flexWrap:"wrap",fontSize:10}}>
 <span style={{color:t.dim}}>DNI {g.dni}</span>
 {g.plus>0&&<span style={{background:t.acBg,color:t.ac,borderRadius:100,padding:"1px 7px",fontWeight:700}}>+{g.plus}</span>}
 {g.motivo&&<span style={{background:mc.bg,color:mc.c,borderRadius:100,padding:"1px 7px",fontWeight:700}}>{g.motivo}</span>}
 </div>
 {ev&&<div style={{marginTop:5,display:"inline-flex",alignItems:"center",gap:4,background:t.sur3,borderRadius:100,padding:"2px 9px",fontSize:10,fontWeight:700,color:t.dim}}><span>{ev.emoji}</span><span>{ev.artist.split(" ")[0]} · {ev.day} {ev.month}</span></div>}
 </div>
 <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
 <button onClick={()=>setGlist(prev=>prev.map(x=>x.id===g.id?{...x,checkedIn:!x.checkedIn}:x))}
 style={{width:30,height:30,borderRadius:"50%",border:`2px solid ${g.checkedIn?t.gr:t.b2}`,background:g.checkedIn?t.gr:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .25s cubic-bezier(.34,1.56,.64,1)"}}>
 {g.checkedIn?"✓":""}
 </button>
 <div style={{fontSize:10,color:g.checkedIn?t.gr:t.dim,fontWeight:600}}>{g.checkedIn?"Ingresó":"Pendiente"}</div>
 <button onClick={()=>setToDel(g)} style={{background:"none",border:"none",cursor:"pointer",color:t.rd,fontSize:13,padding:0}}>✕</button>
 </div>
 </div>
 );
 })}
 {showAdd&&<AddGuestSheet t={t} onClose={()=>setShowAdd(false)} onSave={g=>{setGlist(prev=>[{id:`l${Date.now()}`,...g,checkedIn:false},...prev]);setShowAdd(false);}} evts={evts}/>}
 {toDel&&<Sheet onClose={()=>setToDel(null)} t={t}>
 <div style={{padding:"20px 20px 36px",textAlign:"center",background:t.sur,borderRadius:"20px 20px 0 0"}}>
 <div style={{width:52,height:52,borderRadius:"50%",background:t.rdBg,border:`1px solid rgba(248,113,113,.3)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 14px"}}>🗑</div>
 <div style={{fontSize:18,fontWeight:900,marginBottom:6,color:t.tx}}>¿Eliminar invitado?</div>
 <div style={{fontSize:13,color:t.off,marginBottom:24}}>Vas a eliminar a <strong style={{color:t.tx}}>{toDel.name}</strong> de la lista.</div>
 <button onClick={()=>{setGlist(prev=>prev.filter(g=>g.id!==toDel.id));setToDel(null);}} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#f87171",color:"#fff",cursor:"pointer",marginBottom:8}}>Sí, eliminar</button>
 <button onClick={()=>setToDel(null)} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
 </div>
 </Sheet>}
 </>
 );
}

function AddGuestSheet({t,onClose,onSave,evts}){
 const[form,setForm]=useState({name:"",dni:"",plus:"0",motivo:"",eventId:""});
 const setF=(k,v)=>setForm(p=>({...p,[k]:v}));
 const valid=form.name.trim()&&form.dni.trim()&&form.eventId;
 const IS={width:"100%",padding:"12px 14px",background:t.inp,border:`1px solid ${t.b}`,borderRadius:10,color:t.tx,fontFamily:"inherit",fontSize:14,outline:"none"};
 return(
 <Sheet onClose={onClose}>
 <div style={{padding:"16px 20px 36px",background:t.sur,borderRadius:"20px 20px 0 0"}}>
 <div style={{fontSize:20,fontWeight:900,color:t.tx,marginBottom:16}}>Agregar a la lista</div>
 <div style={{marginBottom:12}}><Lbl t={t}>Evento</Lbl><select style={IS} value={form.eventId} onChange={e=>setF("eventId",e.target.value)}><option value="">Seleccioná un evento…</option>{evts.map(ev=><option key={ev.id} value={ev.id}>{ev.emoji} {ev.artist} · {ev.day} {ev.month}</option>)}</select></div>
 <div style={{marginBottom:12}}><Lbl t={t}>Nombre completo</Lbl><input style={IS} placeholder="Nombre Apellido" value={form.name} onChange={e=>setF("name",e.target.value)}/></div>
 <div style={{marginBottom:12}}><Lbl t={t}>DNI</Lbl><input style={IS} placeholder="32.456.789" value={form.dni} onChange={e=>setF("dni",e.target.value)}/></div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
 <div><Lbl t={t}>Acompañantes</Lbl><select style={IS} value={form.plus} onChange={e=>setF("plus",e.target.value)}>{[0,1,2,3,4,5].map(n=><option key={n} value={n}>{n===0?"Sin acomp.":`+${n}`}</option>)}</select></div>
 <div><Lbl t={t}>Motivo</Lbl><select style={IS} value={form.motivo} onChange={e=>setF("motivo",e.target.value)}><option value="">Sin motivo</option>{["Prensa","Staff","Artista","Sponsor","Invitado VIP","Otro"].map(m=><option key={m} value={m}>{m}</option>)}</select></div>
 </div>
 <button disabled={!valid} onClick={()=>onSave({name:form.name.trim(),dni:form.dni.trim(),plus:Number(form.plus),motivo:form.motivo||"Invitado",eventId:form.eventId})} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#a78bfa",color:"#0a0014",cursor:"pointer",marginBottom:8,opacity:valid?1:.4}}>Agregar</button>
 <button onClick={onClose} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
 </div>
 </Sheet>
 );
}

function Scanner({t,dark,setDark,buyers,setBuyers}){
 const[res,setRes]=useState(null),[man,setMan]=useState(""),[showM,setShowM]=useState(false);
 function scan(code){
 const b=buyers.find(b=>b.hash===code.trim());
 if(!b){setRes({ok:false,title:"QR inválido",name:"Código no encontrado",sub:code});return;}
 if(b.checkedIn){setRes({ok:false,title:"Ya ingresó",name:b.name,sub:`${b.ticket} · ${b.hash}`});return;}
 setBuyers(prev=>prev.map(x=>x.hash===code.trim()?{...x,checkedIn:true}:x));
 setRes({ok:true,title:"✓ Acceso válido",name:b.name,sub:`${b.ticket} · ${b.hash}`});
 }
 const codes=buyers.filter(b=>!b.checkedIn).slice(0,3).map(b=>b.hash);
 return(
 <div style={{paddingBottom:80}}>
 <Topbar t={t} dark={dark} setDark={setDark} title="Scanner QR"/>
 <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 20px"}}>
 {res?(
 <>
 <div style={{width:"100%",borderRadius:14,padding:18,marginBottom:14,border:"1px solid",background:res.ok?t.grBg:t.rdBg,borderColor:res.ok?"rgba(74,222,128,.3)":"rgba(248,113,113,.3)",animation:"scaleIn .3s cubic-bezier(.34,1.4,.64,1)"}}>
 <div style={{fontSize:17,fontWeight:900,marginBottom:4,color:res.ok?t.gr:t.rd}}>{res.title}</div>
 <div style={{fontSize:14,fontWeight:600,color:t.tx,marginBottom:2}}>{res.name}</div>
 <div style={{fontSize:11,color:t.off}}>{res.sub}</div>
 </div>
 <button onClick={()=>setRes(null)} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:t.ac,color:"#0a0014",cursor:"pointer"}}>Escanear siguiente</button>
 </>
 ):(
 <>
 <div style={{width:260,height:260,borderRadius:20,background:t.sur,border:`1px solid ${t.b}`,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,boxShadow:t.sh}}>
 {[["tl","3px 0 0 3px","4px 0 0"],["tr","3px 3px 0 0","4px 0"],["bl","0 0 3px 3px","0 4px 4px 0"],["br","0 3px 3px 0","0 0 4px 4px"]].map(([p,bw,br])=>(
 <div key={p} style={{position:"absolute",width:36,height:36,borderColor:t.ac,borderStyle:"solid",borderWidth:bw,borderRadius:br,...{tl:{top:14,left:14},tr:{top:14,right:14},bl:{bottom:14,left:14},br:{bottom:14,right:14}}[p]}}/>
 ))}
 <div style={{position:"absolute",left:14,right:14,height:2,background:`linear-gradient(90deg,transparent,${t.ac},transparent)`,animation:"scanMove 2s ease-in-out infinite"}}/>
 <div style={{fontSize:48,opacity:.12}}>⬛</div>
 </div>
 <div style={{fontSize:13,color:t.off,textAlign:"center",lineHeight:1.6,marginBottom:20}}>Apuntá la cámara al código QR de la entrada.</div>
 <div style={{width:"100%"}}>
 <div style={{fontSize:10,color:t.dim,textAlign:"center",marginBottom:10,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Demo — simular scan</div>
 {codes.map(c=><button key={c} onClick={()=>scan(c)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${t.b2}`,background:"transparent",color:t.tx,fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:6,textAlign:"left"}}>{c}</button>)}
 <button onClick={()=>scan("hmac_invalido")} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${t.b2}`,background:"transparent",color:t.rd,fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:6}}>Simular QR inválido</button>
 <button onClick={()=>setShowM(true)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${t.b2}`,background:"transparent",color:t.tx,fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer"}}>Código manual</button>
 </div>
 </>
 )}
 </div>
 {showM&&<Sheet onClose={()=>setShowM(false)} t={t}>
 <div style={{padding:"16px 20px 36px"}}>
 <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:16}}>Código manual</div>
 <input style={{width:"100%",padding:"12px 14px",background:"#1f1f1f",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,outline:"none",marginBottom:12}} placeholder="hmac_..." value={man} onChange={e=>setMan(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(scan(man),setMan(""),setShowM(false))} autoFocus/>
 <button onClick={()=>{scan(man);setMan("");setShowM(false);}} disabled={!man.trim()} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#a78bfa",color:"#0a0014",cursor:"pointer",marginBottom:8,opacity:man.trim()?1:.4}}>Validar</button>
 <button onClick={()=>setShowM(false)} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancelar</button>
 </div>
 </Sheet>}
 </div>
 );
}

function Perfil({t,dark,setDark}){
 const[form,setForm]=useState({nombre:"Carlos Vega",email:"carlos@fluxo.ar",dni:"30.456.789",telefono:"",banco:"",cbu:"",alias:"",titular:""});
 const[saved,setSaved]=useState(false);
 const setF=(k,v)=>{setForm(p=>({...p,[k]:v}));setSaved(false);};
 const F=({label,k,ph,type="text",extra={}})=>(
 <div style={{marginBottom:12}}>
 <Lbl t={t}>{label}</Lbl>
 <input style={inp(t)} type={type} placeholder={ph} value={form[k]} onChange={e=>setF(k,e.target.value)} {...extra}/>
 </div>
 );
 return(
 <div style={{paddingBottom:80}}>
 <Topbar t={t} dark={dark} setDark={setDark} title="Mi perfil"/>
 <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 20px 16px",background:dark?"radial-gradient(ellipse 80% 50% at 50% 0%,rgba(167,139,250,.1),transparent)":"radial-gradient(ellipse 80% 50% at 50% 0%,rgba(124,58,237,.06),transparent)"}}>
 <Avatar name={form.nombre} t={t} size={64}/>
 <div style={{fontSize:15,fontWeight:800,color:t.tx,marginTop:10,marginBottom:2}}>{form.nombre||"Sin nombre"}</div>
 <div style={{fontSize:12,color:t.dim}}>{form.email}</div>
 </div>
 <div style={{padding:"0 18px"}}>
 <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:t.dim,margin:"16px 0 12px"}}>Datos personales</div>
 <F label="Nombre completo" k="nombre" ph="Tu nombre"/>
 <F label="Email" k="email" ph="tu@email.com" type="email"/>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
 <div><Lbl t={t}>DNI</Lbl><input style={inp(t)} placeholder="30.456.789" value={form.dni} onChange={e=>setF("dni",e.target.value)}/></div>
 <div><Lbl t={t}>Teléfono</Lbl><input style={inp(t)} placeholder="+54 9 11..." value={form.telefono} onChange={e=>setF("telefono",e.target.value)}/></div>
 </div>
 <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:t.dim,margin:"16px 0 12px"}}>Datos bancarios</div>
 <div style={{...card(t),padding:"12px 14px",marginBottom:12,fontSize:12,color:t.dim,lineHeight:1.6}}>💳 Los ingresos se acreditarán en esta cuenta al finalizar cada evento.</div>
 <F label="Banco" k="banco" ph="Galicia, Brubank, Mercado Pago…"/>
 <F label="CBU / CVU" k="cbu" ph="22 dígitos" extra={{maxLength:22}}/>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
 <div><Lbl t={t}>Alias</Lbl><input style={inp(t)} placeholder="mi.alias.mp" value={form.alias} onChange={e=>setF("alias",e.target.value)}/></div>
 <div><Lbl t={t}>Titular</Lbl><input style={inp(t)} placeholder="Nombre titular" value={form.titular} onChange={e=>setF("titular",e.target.value)}/></div>
 </div>
 <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:saved?t.gr:t.ac,color:saved?"#fff":dark?"#0a0014":"#fff",cursor:"pointer",marginBottom:8,transition:"background .3s",boxShadow:`0 4px 16px ${saved?t.grBg:t.acBg}`}}>
 {saved?"✓ Guardado":"Guardar cambios"}
 </button>
 <button style={{width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${t.rdBg}`,background:"transparent",color:t.rd,fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}} onClick={()=>window.location.reload()}>Cerrar sesión</button>
 </div>
 </div>
 );
}

function CreateEventSheet({t,onClose,onSave}){
 const[form,setForm]=useState({artist:"",venue:"",city:"",day:"",month:"",year:"2025",time:"",doors:"",tag:"",types:[]});
 const setF=(k,v)=>setForm(p=>({...p,[k]:v}));
 const setTT=(i,k,v)=>setForm(p=>{const tp=[...p.types];tp[i]={...tp[i],[k]:v};return{...p,types:tp};});
 const addTT=(n="")=>setForm(p=>({...p,types:[...p.types,{name:n,price:"",total:""}]}));
 const delTT=(i)=>setForm(p=>({...p,types:p.types.filter((_,j)=>j!==i)}));
 const valid=form.artist&&form.venue&&form.day&&form.month&&form.types.every(tp=>tp.name&&tp.price&&tp.total);
 const used=form.types.map(tp=>tp.name);
 const IS={width:"100%",padding:"12px 14px",background:"#1f1f1f",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:14,outline:"none"};
 const IL=(c)=><label style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:7}}>{c}</label>;
 return(
 <Sheet onClose={onClose} t={t}>
 <div style={{padding:"16px 20px 40px",background:t.bg,transition:"background .3s"}}>
 <div style={{fontSize:20,fontWeight:900,color:t.tx,marginBottom:16}}>Nuevo evento</div>
 <div style={{marginBottom:10}}>{IL("Título")}<input style={IS} placeholder="Nombre del evento" value={form.artist} onChange={e=>setF("artist",e.target.value)}/></div>
 <div style={{marginBottom:10}}>{IL("Descripción")}<input style={IS} placeholder="Sobre el evento…" value={form.tag} onChange={e=>setF("tag",e.target.value)}/></div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
 <div>{IL("Lugar")}<input style={IS} placeholder="Club Niceto" value={form.venue} onChange={e=>setF("venue",e.target.value)}/></div>
 <div>{IL("Ciudad")}<input style={IS} placeholder="CABA" value={form.city} onChange={e=>setF("city",e.target.value)}/></div>
 </div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
 <div>{IL("Día")}<input style={IS} placeholder="28" type="number" min="1" max="31" value={form.day} onChange={e=>setF("day",e.target.value)}/></div>
 <div>{IL("Mes")}<select style={IS} value={form.month} onChange={e=>setF("month",e.target.value)}><option value="">Mes</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
 </div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
 <div>{IL("Apertura")}<input style={IS} placeholder="20:00" value={form.doors} onChange={e=>setF("doors",e.target.value)}/></div>
 <div>{IL(<>Show <span style={{fontSize:10,fontWeight:400,opacity:.5}}>(opcional)</span></>)}<input style={IS} placeholder="21:00" value={form.time} onChange={e=>setF("time",e.target.value)}/></div>
 </div>
 <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:10}}>Tipos de entrada</div>
 <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
 {PRESETS.map(n=>{const a=used.includes(n);return <button key={n} disabled={a} onClick={()=>addTT(n)} style={{padding:"6px 14px",borderRadius:100,border:"1px solid",borderColor:a?t.b:t.acBd,background:a?"transparent":t.acBg,color:a?t.dim:t.ac,fontSize:12,fontWeight:700,cursor:a?"not-allowed":"pointer",fontFamily:"inherit",opacity:a?.5:1}}>{a?"✓ ":"＋ "}{n}</button>;})}
 </div>
 {form.types.map((tp,i)=>(
 <div key={i} style={{background:t.sur2,border:`1px solid ${t.b}`,borderRadius:10,padding:12,marginBottom:8,transition:"background .3s"}}>
 <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
 <span style={{fontSize:13,fontWeight:700,color:t.tx}}>{tp.name||`Tipo ${i+1}`}</span>
 {form.types.length>1&&<button onClick={()=>delTT(i)} style={{width:24,height:24,borderRadius:"50%",border:"1px solid rgba(248,113,113,.3)",background:"rgba(248,113,113,.1)",color:"#f87171",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
 </div>
 <div style={{marginBottom:8}}>{IL("Nombre")}<input style={{...IS,background:t.sur}} placeholder="General / VIP…" value={tp.name} onChange={e=>setTT(i,"name",e.target.value)}/></div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
 <div>{IL("Precio (ARS)")}<input style={{...IS,background:t.sur}} placeholder="9500" type="number" value={tp.price} onChange={e=>setTT(i,"price",e.target.value)}/></div>
 <div>{IL("Capacidad")}<input style={{...IS,background:t.sur}} placeholder="250" type="number" value={tp.total} onChange={e=>setTT(i,"total",e.target.value)}/></div>
 </div>
 </div>
 ))}
 <button onClick={()=>addTT()} style={{width:"100%",padding:"11px",borderRadius:10,border:`1px dashed ${t.acBd}`,background:"transparent",color:t.ac,fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14}}>＋ Otro tipo</button>
 <button disabled={!valid} onClick={()=>{const c=PAL[Math.floor(Math.random()*PAL.length)];onSave({id:`e${Date.now()}`,artist:form.artist,tag:form.tag,venue:form.venue,city:form.city,day:form.day,month:form.month,year:form.year,time:form.time,doors:form.doors,emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],...c,types:form.types.map((tp,i)=>({id:`t${Date.now()}${i}`,name:tp.name,price:Number(tp.price),sold:0,total:Number(tp.total)}))});onClose();}} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:t.ac,color:"#fff",cursor:"pointer",opacity:valid?1:.4}}>Crear evento</button>
 <button onClick={onClose} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:8}}>Cancelar</button>
 </div>
 </Sheet>
 );
}

function Login({onLogin}){
 const[email,setEmail]=useState(""),[pass,setPass]=useState(""),[err,setErr]=useState(""),[reg,setReg]=useState(false);
 const[rf,setRf]=useState({nombre:"",email:"",pass:"",pass2:""});
 const setF=(k,v)=>setRf(p=>({...p,[k]:v}));
 const[done,setDone]=useState(false);
 if(done)return(
 <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",background:"#0e0e0e"}}>
 <div style={{width:"100%",background:"#161616",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
 <div style={{fontSize:40,marginBottom:14}}>🎉</div>
 <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:6}}>¡Cuenta creada!</div>
 <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:24}}>Ya podés iniciar sesión.</div>
 <button onClick={()=>{setReg(false);setDone(false);}} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#a78bfa",color:"#0a0014",cursor:"pointer"}}>Ir al login</button>
 </div>
 </div>
 );
 const IS={width:"100%",padding:"13px 16px",background:"#1f1f1f",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,color:"#fff",fontFamily:"inherit",fontSize:15,outline:"none"};
 const IL=(c)=><label style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:8}}>{c}</label>;
 if(reg)return(
 <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",background:"radial-gradient(ellipse 70% 60% at 50% 0%,rgba(167,139,250,.14) 0%,transparent 70%) #0e0e0e"}}>
 <div style={{fontSize:26,fontWeight:900,color:"#a78bfa",marginBottom:4}}>Fluxo</div>
 <div style={{fontSize:12,color:"rgba(255,255,255,.3)",marginBottom:36,letterSpacing:.5,textTransform:"uppercase",fontWeight:600}}>Crear cuenta</div>
 <div style={{width:"100%",background:"#161616",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"24px 20px"}}>
 <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}}>Nueva cuenta</div>
 <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:20}}>Completá tus datos para registrarte</div>
 <div style={{marginBottom:12}}>{IL("Nombre completo")}<input style={IS} placeholder="Tu nombre" value={rf.nombre} onChange={e=>setF("nombre",e.target.value)}/></div>
 <div style={{marginBottom:12}}>{IL("Email")}<input style={IS} type="email" placeholder="tu@email.com" value={rf.email} onChange={e=>setF("email",e.target.value)}/></div>
 <div style={{marginBottom:12}}>{IL("Contraseña")}<input style={IS} type="password" placeholder="Mínimo 6 caracteres" value={rf.pass} onChange={e=>setF("pass",e.target.value)}/></div>
 <div style={{marginBottom:20}}>{IL("Repetir contraseña")}<input style={IS} type="password" placeholder="••••••••" value={rf.pass2} onChange={e=>setF("pass2",e.target.value)}/>{rf.pass2&&rf.pass!==rf.pass2&&<div style={{fontSize:11,color:"#f87171",marginTop:5}}>Las contraseñas no coinciden</div>}</div>
 <button disabled={!(rf.nombre&&rf.email&&rf.pass.length>=6&&rf.pass===rf.pass2)} onClick={()=>setDone(true)} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#a78bfa",color:"#0a0014",cursor:"pointer",marginBottom:8,opacity:(rf.nombre&&rf.email&&rf.pass.length>=6&&rf.pass===rf.pass2)?1:.4}}>Crear cuenta</button>
 <button onClick={()=>setReg(false)} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer"}}>Ya tengo cuenta</button>
 </div>
 </div>
 );
 return(
 <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",background:"radial-gradient(ellipse 70% 60% at 50% 0%,rgba(167,139,250,.14) 0%,transparent 70%) #0e0e0e"}}>
 <div style={{fontSize:26,fontWeight:900,color:"#a78bfa",marginBottom:4}}>Fluxo</div>
 <div style={{fontSize:12,color:"rgba(255,255,255,.3)",marginBottom:36,letterSpacing:.5,textTransform:"uppercase",fontWeight:600}}>Staff & Organizadores</div>
 <div style={{width:"100%",background:"#161616",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"24px 20px"}}>
 <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}}>Iniciá sesión</div>
 <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:20}}>Demo: carlos@fluxo.ar / fluxo123</div>
 {err&&<div style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",borderRadius:10,padding:"11px 14px",fontSize:13,color:"#f87171",marginBottom:12}}>{err}</div>}
 <div style={{marginBottom:12}}>{IL("Email")}<input style={IS} type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(email==="carlos@fluxo.ar"&&pass==="fluxo123"?onLogin():setErr("Email o contraseña incorrectos."))}/></div>
 <div style={{marginBottom:20}}>{IL("Contraseña")}<input style={IS} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(email==="carlos@fluxo.ar"&&pass==="fluxo123"?onLogin():setErr("Email o contraseña incorrectos."))}/></div>
 <button onClick={()=>email==="carlos@fluxo.ar"&&pass==="fluxo123"?onLogin():setErr("Email o contraseña incorrectos.")} disabled={!email||!pass} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#a78bfa",color:"#0a0014",cursor:"pointer",marginBottom:8,opacity:email&&pass?1:.4}}>Ingresar</button>
 <button onClick={()=>setReg(true)} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid rgba(167,139,250,.3)",background:"rgba(167,139,250,.08)",color:"#a78bfa",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}}>Crear cuenta nueva</button>
 </div>
 </div>
 );
}

const NAV_ITEMS=[
 {key:"home",label:"Inicio",icon:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"},
 {key:"ventas",label:"Ventas",icon:"M22 12h-4l-3 9L9 3l-3 9H2"},
 {key:"invitados",label:"Invitados",icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"},
 {key:"scanner",label:"Scanner",icon:"M3 9V5a2 2 0 0 1 2-2h4 M21 9V5a2 2 0 0 0-2-2h-4 M3 15v4a2 2 0 0 0 2 2h4 M21 15v4a2 2 0 0 1-2 2h-4"},
 {key:"perfil",label:"Perfil",icon:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"},
];

export default function App(){
 const[loggedIn,setLoggedIn]=useState(false);
 const[tab,setTab]=useState("home");
 const[dark,setDark]=useState(true);
 const[evts,setEvts]=useState(EVTS);
 const[buyers,setBuyers]=useState(BUYERS);
 const[glist,setGlist]=useState(GLIST);
 const[selEv,setSelEv]=useState(null);
 const[showCreate,setShowCreate]=useState(false);
 const t=dark?D:L;

 if(!loggedIn)return <Login onLogin={()=>setLoggedIn(true)}/>;

 return(
 <>
 <style>{`
 @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap');
 *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
 body{font-family:'Figtree',system-ui,sans-serif;-webkit-font-smoothing:antialiased;max-width:430px;margin:0 auto;}
 ::-webkit-scrollbar{width:0;}
 @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
 @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
 @keyframes scanMove{0%{top:14px;opacity:1}90%{top:calc(100% - 16px);opacity:1}100%{top:calc(100% - 16px);opacity:0}}
 @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(74,222,128,.4),0 0 20px rgba(74,222,128,.15)}50%{box-shadow:0 0 16px rgba(74,222,128,.7),0 0 36px rgba(74,222,128,.3)}}
 @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
 `}</style>
 <div style={{background:t.bg,minHeight:"100vh",color:t.tx,transition:"background .3s,color .3s",position:"relative"}}>
 {tab==="home"&&<Dashboard t={t} dark={dark} setDark={setDark} evts={evts} buyers={buyers} onEvClick={ev=>setSelEv(ev)} onNew={()=>setShowCreate(true)}/>}
 {tab==="ventas"&&<Ventas t={t} dark={dark} setDark={setDark} evts={evts}/>}
 {tab==="invitados"&&<Invitados t={t} dark={dark} setDark={setDark} buyers={buyers} setBuyers={setBuyers} glist={glist} setGlist={setGlist} evts={evts}/>}
 {tab==="scanner"&&<Scanner t={t} dark={dark} setDark={setDark} buyers={buyers} setBuyers={setBuyers}/>}
 {tab==="perfil"&&<Perfil t={t} dark={dark} setDark={setDark}/>}

 {/* Event detail */}
 {selEv&&<Sheet onClose={()=>setSelEv(null)} t={t}>
 <div style={{padding:"16px 20px 36px"}}>
 <div style={{height:120,borderRadius:12,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,marginBottom:16,background:`radial-gradient(ellipse at 60% 40%,${selEv.c3}55,${selEv.c2} 55%,${selEv.c1})`}}>{selEv.emoji}</div>
 <div style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{selEv.tag}</div>
 <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:4}}>{selEv.artist}</div>
 <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:16}}>{selEv.venue} · {selEv.city}</div>
 {[{ico:"📅",l:"Fecha",v:`${selEv.day} de ${selEv.month} de ${selEv.year}`,s:`Puertas: ${selEv.doors} hs`},{ico:"⏰",l:"Horario",v:`${selEv.time} hs`,s:"Duración: 2:30 hs"},{ico:"🎟",l:"Vendidas",v:`${selEv.types.reduce((a,t)=>a+t.sold,0)} / ${selEv.types.reduce((a,t)=>a+t.total,0)}`,s:`${Math.round(selEv.types.reduce((a,t)=>a+t.sold,0)/selEv.types.reduce((a,t)=>a+t.total,0)*100)}% ocupado`}].map((d,i)=>(
 <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
 <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{d.ico}</div>
 <div><div style={{fontSize:11,color:"rgba(255,255,255,.3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>{d.l}</div><div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{d.v}</div>{d.s&&<div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:1}}>{d.s}</div>}</div>
 </div>
 ))}
 <button onClick={()=>setSelEv(null)} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",fontFamily:"inherit",fontSize:15,fontWeight:800,background:"#a78bfa",color:"#0a0014",cursor:"pointer",marginTop:16}}>Cerrar</button>
 </div>
 </Sheet>}

 {/* Create event */}
 {showCreate&&<CreateEventSheet t={t} onClose={()=>setShowCreate(false)} onSave={ev=>{setEvts(prev=>[ev,...prev]);setShowCreate(false);}}/>}

 {/* Bottom nav */}
 <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:t.navBg,backdropFilter:"blur(20px)",borderTop:`1px solid ${t.b}`,display:"flex",zIndex:90,transition:"background .3s"}}>
 {NAV_ITEMS.map(item=>(
 <button key={item.key} onClick={()=>setTab(item.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 0 12px",cursor:"pointer",border:"none",background:"none",color:tab===item.key?t.ac:t.dim,fontFamily:"inherit",transition:"color .2s",gap:4}}>
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20,transition:"transform .25s cubic-bezier(.34,1.56,.64,1)",transform:tab===item.key?"scale(1.2)":"scale(1)"}}>
 {item.icon.split(" M").map((d,i)=><path key={i} d={(i===0?"":" M")+d}/>)}
 </svg>
 <span style={{fontSize:9,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{item.label}</span>
 </button>
 ))}
 </nav>
 </div>
 </>
 );
}
