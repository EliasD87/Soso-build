/** Runs before first paint (inlined in <head>): the saved choice, otherwise light. */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){}})()`;
