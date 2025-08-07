module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
  compilerOptions: {
    types: ['jest', 'node'],
  },
};