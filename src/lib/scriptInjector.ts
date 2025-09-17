export function scriptInjector(parsesdItem: {
  cdnlink: string;
  apiKey: string;
  isDebug: boolean;
}): void {
  const isInitialized = sessionStorage.getItem("isInitialized");

  const header = document.querySelector("head");
  const cdnLink = document.createElement("script");
  cdnLink.src = parsesdItem.cdnlink;
  cdnLink.async = true;
  cdnLink.onload = () => {
    console.log("CDN script loaded successfully.");

    // Inject script snippet into the body after CDN is loaded
    if (!isInitialized) {
      const script = document.createElement("script");
      script.innerHTML = `if (typeof window !== "undefined") {
            const s = CXGaia();

            if (s.init) {
            s.init({
              apiKey: "${parsesdItem.apiKey}",
              debug: ${parsesdItem.isDebug},
            });
            } else {
            console.error("initV2 is not a function on the returned object.");
            }
            }
      `;
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
