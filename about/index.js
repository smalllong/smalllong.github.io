var L = Lightue

new L({
  name: {
    $tag: 'h1',
    $$: 'Smalllong',
  },
  details: [
    'experienced frontend developer located in Shanghai',
    {
      $$: 'github:',
      link: L.a({
        _href: 'https://github.com/smalllong',
        $$: 'https://github.com/smalllong',
      }),
    },
    {
      $$: 'email:',
      link: L.a({
        _href: 'mailto:m18818276304@icloud.com',
        $$: 'm18818276304@icloud.com',
      }),
    },
  ],
})
