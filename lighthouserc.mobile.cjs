const baseUrl = (process.env.LHCI_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const paths = [
  "/",
  "/servicos/gestao-de-redes-sociais",
  "/contato",
  "/cliente/onboarding",
  "/servicos/process-intelligence"
];

module.exports = {
  ci: {
    collect: {
      url: paths.map((path) => `${baseUrl}${path}`),
      numberOfRuns: 2,
      settings: {
        maxWaitForFcp: 15000,
        maxWaitForLoad: 20000,
        pauseAfterLoadMs: 1000,
        chromeFlags: "--no-sandbox --disable-dev-shm-usage"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }]
      }
    },
    upload: {
      target: "filesystem",
      outputDir: ".audit/lighthouse/mobile"
    }
  }
};
