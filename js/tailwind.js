 tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
            colors: {
              brand: { 50:"#eefcf8", 100:"#d5f7ec", 200:"#aeeeda", 300:"#79dfc2", 400:"#43c9a5", 500:"#14b8a6", 600:"#0d9488", 700:"#0f766e", 800:"#115e59" },
              ink: "#242a2e", paper: "#f5f8f7",
              night: { 950:"#070c0f", 900:"#0a1014", 800:"#0f171c", 700:"#152026" },
            },
            keyframes: {
              float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
              pulseSoft: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
              cardIn: { "0%": { opacity: "0", transform: "translateY(14px) scale(0.97)" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } },
            },
            animation: {
              float: "float 7s ease-in-out infinite", floatDelayed: "float 9s ease-in-out infinite",
              pulseSoft: "pulseSoft 2.4s ease-in-out infinite", cardIn: "cardIn 0.45s ease both",
            },
          },
        },
      };