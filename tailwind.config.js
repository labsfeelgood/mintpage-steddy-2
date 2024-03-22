/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'libre': 'Libre Baskerville',
      'normalF': 'Nunito Sans',
      'ClashDisplayR': ['ClashDisplay-Regular', 'system-ui'],
      'ClashDisplayM': ['ClashDisplay-Medium', 'system-ui'],
      'ClashDisplayB': ['ClashDisplay-Bold', 'system-ui'],
      'ClashDisplaySB': ['ClashDisplay-SemiBold', 'system-ui'],
      'NohemiT': ['Nohemi-Thin', 'system-ui'],
      'NohemiEL': ['Nohemi-ExtraLight', 'system-ui'],
      'NohemiL': ['Nohemi-Light', 'system-ui'],
      'NohemiR': ['Nohemi-Regular', 'system-ui'],
      'NohemiM': ['Nohemi-Medium', 'system-ui'],
      'NohemiB': ['Nohemi-Bold', 'system-ui'],
      'NohemiSB': ['Nohemi-SemiBold', 'system-ui'],
      'NohemiBL': ['Nohemi-Black', 'system-ui'],
      'Satoshi': ['Satoshi-Regular', 'system-ui'],
        'Satoshi-Light': ['Satoshi-Light', 'system-ui'],
        'Satoshi-Medium': ['Satoshi-Medium', 'system-ui'],
        'Satoshi-Bold': ['Satoshi-Bold', 'system-ui'],
        'Satoshi-Black': ['Satoshi-Black', 'system-ui'],
    },
    extend: {
      screens: {
        'm14': '1380px',
        // => @media (min-width: 1380px) { ... }
      },
      colors: {
        gray: {
          DEFAULT: '#595959',
          "79": '#797979',
          'c5':'#C5C5C5',
          '97':'#979797'
        },
        "main": "#F8F4E8",
        "sec": "#0090FF",
        "secD": "#0079d5",
        "comp": "#F99925",
        "dark": "#181618",
        "light": "#ffffff"
      },
    },
  },
  plugins: [],
}

