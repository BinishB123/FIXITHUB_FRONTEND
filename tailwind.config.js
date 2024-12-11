import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
   
    extend: {

      textShadow: {
        blue: '2px 2px 5px rgba(0, 0, 255, 0.6)',  
      },
      scrollbar: {
        hide: {
          "::-webkit-scrollbar": "none",
          "-ms-overflow-style": "none",
          "scrollbar-width": "none", 
        },
      },
      fontFamily: {
        dm: ["DM Sans"],
        "days-one": ["Days One"],
      },
      backgroundColor: {
        signcardblue: "#0A1418",
        orange: "#FF591E",
        "banner-gray": "#111111",
        red: '#ff0000',
        grey:"rgb(128,128,128)",
        brown:"#3c341f"
      },
      textColor: {
        orange: "#FF591E",
        red: '#ff0000',
        grey:"rgb(128,128,128)"
      },
      rotate: {
        360: "360deg",
      },
      keyframes: {
        
        marquee: {
          '0%': { transform: 'translateX(1%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        backInDown: {
          "0%": {
            transform: "translateY(-1200px) scale(0.7)",
            opacity: "0.7",
          },
          "80%": {
            transform: "translateY(0px) scale(0.7)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        backInUp: {
          "0%": {
            transform: "translateY(1200px) scale(0.7)",
            opacity: "0.7",
          },
          "80%": {
            transform: "translateY(0px) scale(0.7)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        flipInX: {
          "0%": {
            transform: "perspective(400px) rotateX(90deg)",
            opacity: "0",
          },
          "40%": {
            transform: "perspective(400px) rotateX(-20deg)",
            opacity: "0.7",
          },
          "60%": {
            transform: "perspective(400px) rotateX(10deg)",
            opacity: "0.9",
          },
          "80%": {
            transform: "perspective(400px) rotateX(-5deg)",
            opacity: "1",
          },
          "100%": {
            transform: "perspective(400px) rotateX(0deg)",
            opacity: "1",
          },
        },
        flipInX: {
          "0%": {
            transform: "perspective(400px) rotateX(90deg)",
            opacity: "0",
          },
          "40%": {
            transform: "perspective(400px) rotateX(-20deg)",
            opacity: "0.7",
          },
          "60%": {
            transform: "perspective(400px) rotateX(10deg)",
            opacity: "0.9",
          },
          "80%": {
            transform: "perspective(400px) rotateX(-5deg)",
            opacity: "1",
          },
          "100%": {
            transform: "perspective(400px) rotateX(0deg)",
            opacity: "1",
          },
        },
        fadeInDownBig: {
          "0%": {
            opacity: "0",
            transform: "translateY(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        marquee: "marquee 16s linear infinite",
        spinslow: "spin 3s linear infinite",
        spinfast: "spin 0.5s linear infinite",
        backInDown: "backInDown 1.5s ease-out",
        backInUp: "backInUp 1.5s ease-out",
        fadeInDown: "fadeInDown 2s ease-out",
        flipInX: "flipInX 1s ease-out",
        flipInX: "flipInX 1s ease-out",
        fadeInDownBig: "fadeInDownBig 1s ease forwards",
         fadeInUp: 'fadeInUp 1s ease-out'
      },
    },
  },
  plugins: [],
};
