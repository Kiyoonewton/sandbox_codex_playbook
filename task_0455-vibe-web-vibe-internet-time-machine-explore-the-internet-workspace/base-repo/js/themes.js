// Era Theme Definitions
// Each era defines colors, fonts, and visual effects

window.ERA_THEMES = {
  early: {
    name: "Early Internet (2000-2003)",
    // Bright, chaotic, GeoCities vibes
    colors: {
      bg: "#FFE8D6",
      surface: "#FFFFFF",
      surfaceAlt: "#FFF0E0",
      ink: "#1A0066",
      accent: "#FF00FF",
      accent2: "#00CCFF",
      accent3: "#FFD700",
      success: "#00FF00",
      danger: "#FF0000",
      muted: "#8B7355",
      border: "#CC8844",
      hero: "linear-gradient(135deg, #FF6B9D 0%, #C44DFF 30%, #00CCFF 60%, #FFD700 100%)",
      cardBg: "#FFFFFF",
      cardBorder: "#FF00FF",
      tabBg: "#FFE0B2",
      tabActive: "#FF00FF",
      tabText: "#1A0066",
      tabActiveText: "#FFFFFF"
    },
    fonts: {
      display: "'VT323', monospace",
      body: "'Fredoka', sans-serif",
      accent: "'Press Start 2P', monospace"
    },
    effects: {
      cardShadow: "3px 3px 0px #FF00FF, 6px 6px 0px #00CCFF",
      cardBorderWidth: "3px",
      cardBorderRadius: "2px",
      heroTextShadow: "2px 2px 0 #FF00FF, 4px 4px 0 #00CCFF",
      letterSpacing: "1px",
      textTransform: "none",
      imageFilter: "none",
      bgPattern: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,0,255,0.03) 10px, rgba(255,0,255,0.03) 20px)",
      cardHoverShadow: "5px 5px 0px #FF00FF, 10px 10px 0px #00CCFF",
      scanline: true,
      sparkleCursor: true
    },
    transition: "glitch"
  },

  myspace: {
    name: "MySpace Era (2004-2008)",
    // Dark emo/scene aesthetic
    colors: {
      bg: "#0D0015",
      surface: "#1A0A2E",
      surfaceAlt: "#2D1B4E",
      ink: "#E8D5F5",
      accent: "#FF1493",
      accent2: "#00FF66",
      accent3: "#FF6600",
      success: "#00FF66",
      danger: "#FF3366",
      muted: "#8B7AA0",
      border: "#FF1493",
      hero: "linear-gradient(135deg, #1A0A2E 0%, #3D1566 40%, #FF1493 100%)",
      cardBg: "#1A0A2E",
      cardBorder: "#FF1493",
      tabBg: "#0D0015",
      tabActive: "#FF1493",
      tabText: "#E8D5F5",
      tabActiveText: "#FFFFFF"
    },
    fonts: {
      display: "'Trebuchet MS', 'Exo 2', sans-serif",
      body: "'Cabin', sans-serif",
      accent: "'Exo 2', sans-serif"
    },
    effects: {
      cardShadow: "0 0 10px rgba(255,20,147,0.3), inset 0 0 10px rgba(255,20,147,0.1)",
      cardBorderWidth: "2px",
      cardBorderRadius: "0px",
      heroTextShadow: "0 0 20px #FF1493, 0 0 40px #FF1493",
      letterSpacing: "3px",
      textTransform: "uppercase",
      imageFilter: "saturate(1.3) contrast(1.1)",
      bgPattern: "radial-gradient(circle at 20% 50%, rgba(255,20,147,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,255,102,0.05) 0%, transparent 40%)",
      cardHoverShadow: "0 0 20px rgba(255,20,147,0.5), 0 0 40px rgba(255,20,147,0.2)",
      scanline: false,
      sparkleCursor: false,
      glitterOverlay: true
    },
    transition: "star"
  },

  facebook: {
    name: "Facebook Era (2009-2012)",
    // Clean blue social
    colors: {
      bg: "#E9EBEE",
      surface: "#FFFFFF",
      surfaceAlt: "#F0F2F5",
      ink: "#1C1E21",
      accent: "#1877F2",
      accent2: "#42B72A",
      accent3: "#FA3E3E",
      success: "#42B72A",
      danger: "#FA3E3E",
      muted: "#65676B",
      border: "#DADDE1",
      hero: "linear-gradient(135deg, #1877F2 0%, #42A5F5 50%, #90CAF9 100%)",
      cardBg: "#FFFFFF",
      cardBorder: "#DADDE1",
      tabBg: "#FFFFFF",
      tabActive: "#1877F2",
      tabText: "#65676B",
      tabActiveText: "#FFFFFF"
    },
    fonts: {
      display: "'Roboto', 'Helvetica Neue', sans-serif",
      body: "'Roboto', sans-serif",
      accent: "'Source Sans 3', sans-serif"
    },
    effects: {
      cardShadow: "0 1px 3px rgba(0,0,0,0.1)",
      cardBorderWidth: "1px",
      cardBorderRadius: "8px",
      heroTextShadow: "none",
      letterSpacing: "0",
      textTransform: "none",
      imageFilter: "none",
      bgPattern: "none",
      cardHoverShadow: "0 2px 8px rgba(0,0,0,0.15)",
      scanline: false,
      sparkleCursor: false,
      cleanLook: true
    },
    transition: "fade"
  },

  tumblr: {
    name: "Tumblr Era (2013-2015)",
    // Pastel fandom aesthetic
    colors: {
      bg: "#F5E6D3",
      surface: "#FFFFFF",
      surfaceAlt: "#FFF0E6",
      ink: "#2D2D2D",
      accent: "#FF6B9D",
      accent2: "#C44DFF",
      accent3: "#00D4AA",
      success: "#00D4AA",
      danger: "#FF4D6A",
      muted: "#8B7D6B",
      border: "#E8D5C0",
      hero: "linear-gradient(135deg, #FF6B9D 0%, #C44DFF 50%, #00D4AA 100%)",
      cardBg: "#FFFFFF",
      cardBorder: "#F0D0D0",
      tabBg: "#FFF0E6",
      tabActive: "#FF6B9D",
      tabText: "#6B5B4B",
      tabActiveText: "#FFFFFF"
    },
    fonts: {
      display: "'Poppins', sans-serif",
      body: "'Source Serif 4', Georgia, serif",
      accent: "'Poppins', sans-serif"
    },
    effects: {
      cardShadow: "0 2px 12px rgba(196,77,255,0.1)",
      cardBorderWidth: "1px",
      cardBorderRadius: "12px",
      heroTextShadow: "0 2px 20px rgba(255,107,157,0.3)",
      letterSpacing: "0",
      textTransform: "none",
      imageFilter: "saturate(1.1) brightness(1.02)",
      bgPattern: "radial-gradient(circle at 30% 70%, rgba(255,107,157,0.05) 0%, transparent 50%)",
      cardHoverShadow: "0 4px 20px rgba(196,77,255,0.2)",
      scanline: false,
      sparkleCursor: false,
      gifReel: true
    },
    transition: "slide"
  },

  instagram: {
    name: "Instagram Era (2016-2019)",
    // Visual-first polished design
    colors: {
      bg: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceAlt: "#F8F9FA",
      ink: "#262626",
      accent: "#E1306C",
      accent2: "#833AB4",
      accent3: "#F77737",
      success: "#00C853",
      danger: "#ED4956",
      muted: "#8E8E8E",
      border: "#DBDBDB",
      hero: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 30%, #FCB045 100%)",
      cardBg: "#FFFFFF",
      cardBorder: "#DBDBDB",
      tabBg: "#FFFFFF",
      tabActive: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
      tabText: "#262626",
      tabActiveText: "#FFFFFF"
    },
    fonts: {
      display: "'Playfair Display', Georgia, serif",
      body: "'DM Sans', sans-serif",
      accent: "'DM Sans', sans-serif"
    },
    effects: {
      cardShadow: "0 1px 3px rgba(0,0,0,0.08)",
      cardBorderWidth: "1px",
      cardBorderRadius: "12px",
      heroTextShadow: "none",
      letterSpacing: "0",
      textTransform: "none",
      imageFilter: "none",
      bgPattern: "none",
      cardHoverShadow: "0 4px 16px rgba(0,0,0,0.12)",
      scanline: false,
      sparkleCursor: false,
      gridLayout: true
    },
    transition: "crossfade"
  },

  tiktok: {
    name: "TikTok Era (2020-2025)",
    // Dark with vibrant accents, fast motion
    colors: {
      bg: "#0A0A0A",
      surface: "#1A1A1A",
      surfaceAlt: "#242424",
      ink: "#F5F5F5",
      accent: "#FF0050",
      accent2: "#00F2EA",
      accent3: "#FFFF00",
      success: "#00F2EA",
      danger: "#FF0050",
      muted: "#808080",
      border: "#333333",
      hero: "linear-gradient(135deg, #FF0050 0%, #00F2EA 50%, #FFFF00 100%)",
      cardBg: "#1A1A1A",
      cardBorder: "#333333",
      tabBg: "#0A0A0A",
      tabActive: "#FF0050",
      tabText: "#808080",
      tabActiveText: "#FFFFFF"
    },
    fonts: {
      display: "'Space Grotesk', sans-serif",
      body: "'Outfit', sans-serif",
      accent: "'Space Grotesk', sans-serif"
    },
    effects: {
      cardShadow: "0 2px 8px rgba(0,0,0,0.3)",
      cardBorderWidth: "1px",
      cardBorderRadius: "16px",
      heroTextShadow: "0 0 30px rgba(255,0,80,0.5), 0 0 60px rgba(0,242,234,0.3)",
      letterSpacing: "-0.01em",
      textTransform: "none",
      imageFilter: "contrast(1.05) saturate(1.1)",
      bgPattern: "radial-gradient(circle at 50% 0%, rgba(255,0,80,0.08) 0%, transparent 50%)",
      cardHoverShadow: "0 4px 20px rgba(255,0,80,0.2)",
      scanline: false,
      sparkleCursor: false,
      verticalCards: true
    },
    transition: "snap"
  }
};
