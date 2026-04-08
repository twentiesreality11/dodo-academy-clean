module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},54458,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),i=e.i(59756),n=e.i(61916),o=e.i(74677),s=e.i(69741),l=e.i(16795),d=e.i(87718),p=e.i(95169),c=e.i(47587),u=e.i(66012),h=e.i(70101),x=e.i(26937),f=e.i(10372),g=e.i(93695);e.i(52474);var m=e.i(220),v=e.i(89171),R=e.i(79058);async function y(e,{params:t}){try{let{id:e}=t,r=await (0,R.getDb)(),a=await r.get(`
      SELECT u.name, u.email, a.score, a.created_at 
      FROM assessment_attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.passed = 1 
      ORDER BY a.created_at DESC 
      LIMIT 1
    `);if(!a)return new v.NextResponse("Certificate not found",{status:404});let i=`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion - Dodo Academy</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinema&family=Playfair+Display:wght@400;700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Playfair Display', serif;
          }
          
          .certificate {
            width: 800px;
            height: 600px;
            background: white;
            border: 20px solid #0B1E33;
            position: relative;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          
          .certificate:before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 2px solid #FFB347;
            pointer-events: none;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #0B1E33;
            font-size: 42px;
            margin: 0;
            letter-spacing: 2px;
          }
          
          .header h2 {
            color: #FFB347;
            font-size: 24px;
            margin: 10px 0 0;
            font-weight: normal;
          }
          
          .seal {
            position: absolute;
            bottom: 80px;
            right: 60px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #FFB347;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            text-align: center;
            color: #0B1E33;
            font-weight: bold;
            opacity: 0.8;
          }
          
          .content {
            text-align: center;
            margin: 50px 0;
          }
          
          .recipient {
            font-size: 36px;
            font-weight: bold;
            color: #0B1E33;
            margin: 20px 0;
            border-bottom: 2px solid #FFB347;
            display: inline-block;
            padding-bottom: 10px;
          }
          
          .course {
            font-size: 24px;
            color: #555;
            margin: 20px 0;
          }
          
          .date {
            margin-top: 50px;
            color: #666;
          }
          
          .signature {
            margin-top: 40px;
            text-align: left;
            font-style: italic;
          }
          
          .id {
            font-size: 10px;
            color: #999;
            position: absolute;
            bottom: 20px;
            left: 40px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <h1>DODO ACADEMY</h1>
            <h2>Certificate of Completion</h2>
          </div>
          
          <div class="content">
            <p>This certificate is proudly presented to</p>
            <div class="recipient">${a.name}</div>
            <p>for successfully completing the</p>
            <div class="course">Cybersecurity Foundation Course</div>
            <p>with a score of <strong>${a.score}/20</strong></p>
            <div class="date">
              Date: ${new Date(a.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div class="signature">
            <p>_____________________<br>
            Dr. Adebayo Ogunlesi<br>
            Director, Dodo Academy</p>
          </div>
          
          <div class="seal">
            DODO<br>ACADEMY
          </div>
          
          <div class="id">
            Certificate ID: ${e}
          </div>
        </div>
      </body>
      </html>
    `;return new v.NextResponse(i,{headers:{"Content-Type":"text/html"}})}catch(e){return console.error("Certificate error:",e),new v.NextResponse("Error generating certificate",{status:500})}}e.s(["GET",0,y],99757);var b=e.i(99757);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/certificate/id/route",pathname:"/api/certificate/id",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/certificate/id/route.js",nextConfigOutput:"standalone",userland:b,...{}}),{workAsyncStorage:E,workUnitAsyncStorage:C,serverHooks:_}=w;async function A(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),w.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/certificate/id/route";v=v.replace(/\/index$/,"")||"/";let R=await w.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!R)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:y,params:b,nextConfig:E,parsedUrl:C,isDraftMode:_,prerenderManifest:A,routerServerContext:D,isOnDemandRevalidate:T,revalidateOnlyGenerated:O,resolvedPathname:N,clientReferenceManifest:P,serverActionsManifest:k}=R,S=(0,s.normalizeAppPath)(v),q=!!(A.dynamicRoutes[S]||A.routes[N]),j=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,C,!1):t.end("This page could not be found"),null);if(q&&!_){let e=!!A.routes[N],t=A.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(E.adapterPath)return await j();throw new g.NoFallbackError}}let I=null;!q||w.isDev||_||(I="/index"===(I=N)?"/":I);let F=!0===w.isDev||!q,M=q&&!F;k&&P&&(0,o.setManifestsSingleton)({page:v,clientReferenceManifest:P,serverActionsManifest:k});let H=e.method||"GET",U=(0,n.getTracer)(),B=U.getActiveScopeSpan(),$=!!(null==D?void 0:D.isWrappedByNextServer),K=!!(0,i.getRequestMeta)(e,"minimalMode"),L=(0,i.getRequestMeta)(e,"incrementalCache")||await w.getIncrementalCache(e,E,A,K);null==L||L.resetRequestCache(),globalThis.__incrementalCache=L;let z={params:b,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:F,incrementalCache:L,cacheLifeProfiles:E.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>w.onRequestError(e,t,a,i,D)},sharedContext:{buildId:y}},G=new l.NodeNextRequest(e),W=new l.NodeNextResponse(t),Y=d.NextRequestAdapter.fromNodeNextRequest(G,(0,d.signalFromNodeResponse)(t));try{let i,o=async e=>w.handle(Y,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=U.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${H} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",a),i.updateName(t))}else e.updateName(`${H} ${v}`)}),s=async i=>{var n,s;let l=async({previousCacheEntry:r})=>{try{if(!K&&T&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(i);e.fetchMetrics=z.renderOpts.fetchMetrics;let s=z.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=z.renderOpts.collectedTags;if(!q)return await (0,u.sendResponse)(G,W,n,z.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,a=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:T})},!1,D),t}},d=await w.handleResponse({req:e,nextConfig:E,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:O,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:K});if(!q)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),_&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return K&&q||p.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(G,W,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};$&&B?await s(B):(i=U.getActiveScopeSpan(),await U.withPropagatedContext(e.headers,()=>U.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${v}`,kind:n.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},s),void 0,!$))}catch(t){if(t instanceof g.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:T})},!1,D),q)throw t;return await (0,u.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:C})},"routeModule",0,w,"serverHooks",0,_,"workAsyncStorage",0,E,"workUnitAsyncStorage",0,C],54458)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0asmw86._.js.map