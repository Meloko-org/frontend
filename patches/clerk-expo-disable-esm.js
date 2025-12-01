// Empêche Clerk d'exécuter du code ESM pendant le prebuild Expo
if (process.env.EXPO_PREBUILD) {
  require = () => ({});
}
