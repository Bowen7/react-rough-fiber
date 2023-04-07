module.exports = {
  root: true,
  extends: ['next/babel', 'custom'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
};
