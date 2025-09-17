export function scriptInjector(parsesdItem: {
  cdnlink: string;
  apiKey: string;
  isDebug: boolean;
  targetAttributes: { key: string; value: string }[];
  targetApi: "v1" | "v2";
}): void {
  const isInitialized = sessionStorage.getItem("isInitialized");

  const header = document.querySelector("head");
  const cdnLink = document.createElement("script");
  cdnLink.src = parsesdItem.cdnlink;
  cdnLink.async = true;
  cdnLink.onload = () => {
    console.log("CDN script loaded successfully.");

    let templateAttributes = {};
    if (parsesdItem.targetAttributes.length > 0) {
      templateAttributes = parsesdItem.targetAttributes.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as { [key: string]: string });

      console.log("Template attributes set:", templateAttributes);
    }

    // Inject script snippet into the body after CDN is loaded
    if (!isInitialized) {
      const script = document.createElement("script");
      if (parsesdItem.targetApi === "v1") {
        script.innerHTML = `if (typeof window !== "undefined") {
            const s = CXGaia();

            if (s.init) {
              s.init({
                apiKey: "${parsesdItem.apiKey}",
                debug: ${parsesdItem.isDebug},
                targetAttributes: ${JSON.stringify(templateAttributes)},
              });
            } else {
               console.error("initV2 is not a function on the returned object.");
            }
          }
      `;
      } else if (parsesdItem.targetApi === "v2") {
        script.innerHTML = `if (typeof window !== "undefined") {
            const s = CXGaia();

            if (s.initV2) {
              s.initV2({
                apiKey: "${parsesdItem.apiKey}",
                debug: ${parsesdItem.isDebug},
                targetAttributes: ${JSON.stringify(templateAttributes)},
              });
            } else {
               console.error("initV2 is not a function on the returned object.");
            }
          }
      `;
      } else {
        console.error("Invalid targetApi specified.");
        return;
      }
      script.async = true;
      script.onload = () => {
        console.log("Script loaded successfully.");
      };
      script.onerror = () => {
        console.error("Error loading script.");
      };
      document.body.appendChild(script);
      console.log("Script snippet added to the body.");
      sessionStorage.setItem("isInitialized", "true");
    }
  };

  cdnLink.onerror = () => {
    console.error("Error loading CDN script.");
  };
  if (header) {
    header.appendChild(cdnLink);
    console.log("CDN link added to the head.");
  } else {
    console.error("Header element not found.");
  }
}
